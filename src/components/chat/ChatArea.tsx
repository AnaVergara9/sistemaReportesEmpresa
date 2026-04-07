"use client";

import { Canal, Subcanal, Hilo, Usuario, Mensaje } from "@/types";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, addDoc, serverTimestamp, query, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PropiedadesChatArea {
  canalActivo: Canal | null;
  subcanalActivo: Subcanal | null;
  hiloActivo: Hilo;
  datosUsuario: Usuario;
}

export default function ChatArea({ canalActivo, subcanalActivo, hiloActivo, datosUsuario }: PropiedadesChatArea) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [textoNuevoMensaje, setTextoNuevoMensaje] = useState("");
  const [mensajeCitado, setMensajeCitado] = useState<Mensaje | null>(null);
  const referenciaFinal = useRef<HTMLDivElement>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);

  const rutaMensajes = `canales/${canalActivo?.id}/subcanales/${subcanalActivo?.id}/hilos/${hiloActivo.id}/mensajes`;

  useEffect(() => {
    if (!canalActivo || !subcanalActivo) return;
    const consulta = query(collection(db, rutaMensajes), orderBy("fecha", "asc"));
    const cancelarSuscripcion = onSnapshot(consulta, (resultado) => {
      setMensajes(resultado.docs.map(documento => ({ id: documento.id, ...documento.data() } as Mensaje)));
    });
    return () => cancelarSuscripcion();
  }, [canalActivo?.id, subcanalActivo?.id, hiloActivo.id]);

  useEffect(() => {
    referenciaFinal.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!canalActivo || !subcanalActivo) return;

    let archivoSubido = null;
    if (archivoSeleccionado) {
      archivoSubido = await subirArchivo(archivoSeleccionado);
    }

    {/* Evitar enviar vacíos */}
    if (!textoNuevoMensaje.trim() && !archivoSubido) return;

    await addDoc(collection(db, rutaMensajes), {
      texto: textoNuevoMensaje,
      autorId: datosUsuario.uid,
      autorNombre: datosUsuario.nombre,
      autorEmpresa: datosUsuario.empresa,
      fecha: serverTimestamp(),
      archivos: archivoSubido ? [archivoSubido] : [],
      reacciones: {},
      respondidoA: mensajeCitado ? {autorNombre: mensajeCitado.autorNombre, texto: mensajeCitado.texto} : null,
    });
    setTextoNuevoMensaje("");
    setArchivoSeleccionado(null);
    setMensajeCitado(null);
  };

  const subirArchivo = async (archivo: File) => {
    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "chat_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/chat_upload/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return {url: data.secure_url, nombre: archivo.name, tipo: archivo.type,};
  };

  const reaccionar = async (idMensaje: string, emoji: string) => {
    const referencia = doc(db, rutaMensajes, idMensaje);
    await updateDoc(referencia, {
      [`reacciones.${emoji}`]: arrayUnion(datosUsuario.uid)
    });
  };

  function obtenerColor(nombre: string) {
    const colores = ["#5865f2", "#57f287", "#eb459e", "#fee75c", "#ed4245"];
    let suma = 0;
    for (let i = 0; i < nombre.length; i++) suma += nombre.charCodeAt(i);
    return colores[suma % colores.length];
  }

  function obtenerIniciales(nombre: string) {
    return nombre.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  const EMOJIS = ["👍", "❤️", "✅", "😂"];

  return (
    <div className="flex-1 flex flex-col bg-[#313338] overflow-hidden">
      /* Encabezado del chat */
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h2 className="text-white font-semibold">💬 {hiloActivo.nombre}</h2>
        <p className="text-gray-400 text-xs">{canalActivo?.nombre} › {subcanalActivo?.nombre}</p>
      </div>

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {mensajes.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">No hay mensajes aún. ¡Sé el primero en escribir!</p>
        )}

        {mensajes.map((mensaje) => (
          <div key={mensaje.id} className="group relative hover:bg-white/5 rounded-lg px-2 py-1 -mx-2">

            {/* Mensaje citado */}
            {mensaje.respondidoA && (
              <div className="ml-10 mb-1 pl-2 border-l-2 border-gray-500 text-gray-400 text-xs">
                <span className="font-semibold">{mensaje.respondidoA.autorNombre}: </span>
                {mensaje.respondidoA.texto?.slice(0, 80)}
              </div>
            )}

            <div className="flex gap-3 items-start">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: obtenerColor(mensaje.autorNombre) }}
              >
                {obtenerIniciales(mensaje.autorNombre)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-semibold text-white text-sm">{mensaje.autorNombre}</span>
                  <span className="text-gray-400 text-xs">
                    {mensaje.fecha?.toDate?.()?.toLocaleString("es-ES") ?? ""}
                  </span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">{mensaje.texto}</p>

                {/* Archivos adjuntos */}
                {mensaje.archivos && mensaje.archivos.length > 0 && (
                <div className="mt-2">
                  {mensaje.archivos.map((archivo: any, index: number) => (
                    <a
                      key={index}
                      href={archivo.url}
                      target="_blank"
                      className="text-blue-400 underline text-sm block"
                      download
                    >
                      📎 {archivo.nombre}
                    </a>
                  ))}
                </div>
              )}

                {/* Reacciones */}
                {mensaje.reacciones && Object.keys(mensaje.reacciones).length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {Object.entries(mensaje.reacciones).map(([emoji, usuarios]) =>
                      (usuarios as string[]).length > 0 && (
                        <button
                          key={emoji}
                          onClick={() => reaccionar(mensaje.id, emoji)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                            (usuarios as string[]).includes(datosUsuario.uid)
                              ? "bg-[#5865f2]/20 border-[#5865f2]"
                              : "bg-white/5 border-white/10 hover:border-white/30"
                          }`}
                        >
                          {emoji} {(usuarios as string[]).length}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Acciones al hacer hover */}
            <div className="absolute right-2 top-1 hidden group-hover:flex gap-1 bg-[#2b2d31] border border-white/10 rounded-lg p-1">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => reaccionar(mensaje.id, emoji)}
                  className="hover:bg-white/10 rounded px-1 text-sm transition-colors"
                >
                  {emoji}
                </button>
              ))}
              <button
                onClick={() => setMensajeCitado(mensaje)}
                className="hover:bg-white/10 rounded px-2 text-xs text-gray-400 hover:text-white transition-colors ml-1"
              >
                ↩ Responder
              </button>
            </div>
          </div>
        ))}
        <div ref={referenciaFinal} />
      </div>

      {/* Input para escribir */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        {mensajeCitado && (
          <div className="mb-2 px-3 py-2 bg-white/5 rounded-lg flex items-center justify-between">
            <p className="text-gray-400 text-xs">
              Respondiendo a <span className="font-semibold text-white">{mensajeCitado.autorNombre}</span>: {mensajeCitado.texto.slice(0, 60)}
            </p>
            <button onClick={() => setMensajeCitado(null)} className="text-gray-400 hover:text-white text-xs ml-2">✕</button>
          </div>
        )}
        <div className="flex gap-2 items-center">

          {/* BOTÓN CLIP */}
          <label className="cursor-pointer text-white text-xl">
            📎
            <input
              type="file"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setArchivoSeleccionado(e.target.files[0]);
                }
              }}
            />
          </label>
          {archivoSeleccionado && (
            <p className="text-xs text-gray-400 mb-1">
              Archivo: {archivoSeleccionado.name}
            </p>)}

          <Input
            placeholder={`Escribe un mensaje en ${hiloActivo.nombre}...`}
            value={textoNuevoMensaje}
            onChange={(e) => setTextoNuevoMensaje(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") enviarMensaje(); }}
            className="flex-1 bg-[#383a40] border-none text-white placeholder-gray-500 focus:ring-0"
          />
          <Button onClick={enviarMensaje} className="bg-[#5865f2] hover:bg-[#4752c4] text-white">
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}