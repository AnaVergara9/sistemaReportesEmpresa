"use client";

import { Area, Categoria, Hilo, Usuario, Mensaje } from "@/types";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatAreaProps {
  selectedArea: Area | null;
  selectedCategory: Categoria | null;
  selectedThread: Hilo | null;
  usuarioData: Usuario;
}

export default function ChatArea({
  selectedArea,
  selectedCategory,
  selectedThread,
  usuarioData,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedArea && selectedCategory && selectedThread) {
      const q = query(
        collection(db, `areas/${selectedArea.id}/categorias/${selectedCategory.id}/hilos/${selectedThread.id}/mensajes`),
        orderBy("fecha", "asc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mensaje));
        setMessages(msgs);
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [selectedArea, selectedCategory, selectedThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedArea || !selectedCategory || !selectedThread) return;

    const messageData = {
      texto: newMessage,
      autorId: usuarioData.uid,
      autorNombre: usuarioData.nombre,
      autorEmpresa: usuarioData.empresa,
      fecha: serverTimestamp(),
      archivos: [],
      reacciones: {},
      respondidoA: null,
    };

    await addDoc(
      collection(db, `areas/${selectedArea.id}/categorias/${selectedCategory.id}/hilos/${selectedThread.id}/mensajes`),
      messageData
    );

    setNewMessage("");
  };

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-discord-darkest p-4 text-discord-gray-light">
        Selecciona un hilo para empezar a chatear.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-discord-darkest p-4">
      <div className="flex-none border-b border-discord-gray pb-4 mb-4">
        <h2 className="text-xl font-bold">Hilo: {selectedThread.nombre}</h2>
        <p className="text-discord-gray-light">En {selectedCategory?.nombre} ({selectedArea?.nombre})</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 p-2 bg-discord-darker rounded-lg">
            <div className="flex items-center text-sm mb-1">
              <span className="font-bold" style={{ color: usuarioData.avatarColor }}>
                {msg.autorNombre}
              </span>
              <span className="text-discord-gray-light ml-2 text-xs">
                {new Date(msg.fecha?.toDate()).toLocaleString()}
              </span>
            </div>
            <p>{msg.texto}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none flex gap-2">
        <Input
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1 bg-discord-darker border-discord-gray text-white placeholder-discord-gray-light"
        />
        <Button onClick={handleSendMessage} className="bg-discord-blue hover:bg-discord-blue-dark">
          Enviar
        </Button>
      </div>
    </div>
  );
}
