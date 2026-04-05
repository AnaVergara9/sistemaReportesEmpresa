"use client";

import { Area, Categoria, Hilo } from "@/types";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from "firebase/firestore";

interface MiddleColumnProps {
  areas: Area[];
  selectedArea: Area | null;
  onSelectArea: (area: Area | null) => void;
  selectedCategory: Categoria | null;
  onSelectCategory: (category: Categoria | null) => void;
  selectedThread: Hilo | null;
  onSelectThread: (thread: Hilo | null) => void;
}

export default function MiddleColumn({
  areas,
  selectedArea,
  onSelectArea,
  selectedCategory,
  onSelectCategory,
  selectedThread,
  onSelectThread,
}: MiddleColumnProps) {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [threads, setThreads] = useState<Hilo[]>([]);

  // Efecto para cargar categorías cuando cambia el área seleccionada
  useEffect(() => {
    if (selectedArea) {
      const q = query(
        collection(db, `areas/${selectedArea.id}/categorias`),
        orderBy("creadoEn", "asc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Categoria));
        setCategories(categoriesData);
      });
      return () => unsubscribe();
    } else {
      setCategories([]);
    }
  }, [selectedArea]);

  // Efecto para cargar hilos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedArea && selectedCategory) {
      const q = query(
        collection(db, `areas/${selectedArea.id}/categorias/${selectedCategory.id}/hilos`),
        orderBy("creadoEn", "asc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const threadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hilo));
        setThreads(threadsData);
      });
      return () => unsubscribe();
    } else {
      setThreads([]);
    }
  }, [selectedArea, selectedCategory]);

  return (
    <div className="w-80 bg-discord-darker flex flex-col p-4 border-r border-discord-gray overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Áreas</h2>
      <ul className="space-y-2 mb-6">
        {areas.map((area) => (
          <li key={area.id}>
            <button
              onClick={() => onSelectArea(area)}
              className={`w-full text-left p-2 rounded ${selectedArea?.id === area.id ? "bg-discord-accent" : "hover:bg-discord-hover"}`}
            >
              {area.nombre}
            </button>
          </li>
        ))}
      </ul>

      {selectedArea && (
        <>
          <h2 className="text-lg font-bold mb-4">Categorías de {selectedArea.nombre}</h2>
          <ul className="space-y-2 mb-6">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category)}
                  className={`w-full text-left p-2 rounded ${selectedCategory?.id === category.id ? "bg-discord-accent" : "hover:bg-discord-hover"}`}
                >
                  {category.nombre}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedCategory && (
        <>
          <h2 className="text-lg font-bold mb-4">Hilos de {selectedCategory.nombre}</h2>
          <ul className="space-y-2">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => onSelectThread(thread)}
                  className={`w-full text-left p-2 rounded ${selectedThread?.id === thread.id ? "bg-discord-accent" : "hover:bg-discord-hover"}`}
                >
                  {thread.nombre}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
