"use client";

import { Canal, Subcanal, Hilo, Usuario, Mensaje as TipoMensaje } from "@/types";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  query,
} from "firebase/firestore";

import Mensaje from "./Mensaje";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  canalActivo: Canal | null;
  subcanalActivo: Subcanal | null;
  hiloActivo: Hilo;
  datosUsuario: Usuario;
}

export default function ChatArea({
  canalActivo,
  subcanalActivo,
  hiloActivo,
  datosUsuario,
}: Props) {
  const [mensajes, setMensajes] = useState<TipoMensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensajeCitado, setMensajeCitado] = useState<TipoMensaje | null>(null);

  const finalRef = useRef<HTMLDivElement>(null);

  const ruta = `canales/${canalActivo?.id}/subcanales/${subcanalActivo?.id}/hilos/${hiloActivo.id}/mensajes`;

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!canalActivo || !subcanalActivo) return;

    const q = query(collection(db, ruta), orderBy("fecha", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TipoMensaje[];

      setMensajes(data);
    });

    return () => unsub();
  }, [canalActivo?.id, subcanalActivo?.id, hiloActivo.id, ruta]);

  // Si esta abajo me baja, si no me deja donde estaba
  useEffect(() => {
    const contenedorChat = finalRef.current?.parentElement;
    if (contenedorChat) {
      const usuarioEstaAbajo =
        contenedorChat.scrollHeight - contenedorChat.scrollTop <=
        contenedorChat.clientHeight + 50;

      if (usuarioEstaAbajo) {
        finalRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [mensajes]);

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!texto.trim() && !archivo) return;

    let archivoSubido = null;

    if (archivo) {
      archivoSubido = await subirArchivo(archivo);
    }

    await addDoc(collection(db, ruta), {
      texto,
      autorId: datosUsuario.uid,
      autorNombre: datosUsuario.nombre,
      fecha: serverTimestamp(),
      archivos: archivoSubido ? [archivoSubido] : [],
      reacciones: {},
      respondidoA: mensajeCitado
        ? {
            autorNombre: mensajeCitado.autorNombre,
            texto: mensajeCitado.texto,
          }
        : null,
    });

    setTexto("");
    setArchivo(null);
    setMensajeCitado(null);
  };

  // Subir a Cloudinary
  const subirArchivo = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat_upload");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    return {
      url: data.secure_url,
      nombre: file.name,
      tipo: file.type,
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-[#313338]">
      
      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.map((m) => (
          <Mensaje
            key={m.id}
            mensaje={m}
            ruta={ruta}
            datosUsuario={datosUsuario}
            alResponder={setMensajeCitado}
          />
        ))}
        <div ref={finalRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">

          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          />

          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe..."
          />

          <Button onClick={enviarMensaje}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}