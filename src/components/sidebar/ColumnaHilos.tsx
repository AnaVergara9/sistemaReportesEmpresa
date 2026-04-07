"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Canal, Subcanal, Hilo } from "@/types";

interface ColumnaHilosProps {
  canalSeleccionado: Canal;
  subcanalSeleccionado: Subcanal;
  hiloSeleccionado: Hilo | null;
  onSeleccionarHilo: (hilo: Hilo) => void;
  esAdmin: boolean;
  onCrearHilo: () => void;
}

export default function ColumnaHilos({ canalSeleccionado, subcanalSeleccionado, hiloSeleccionado, onSeleccionarHilo, esAdmin, onCrearHilo }: ColumnaHilosProps) {
  const [hilos, setHilos] = useState<Hilo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, `canales/${canalSeleccionado.id}/subcanales/${subcanalSeleccionado.id}/hilos`),
      orderBy("creadoEn", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setHilos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Hilo)));
      setCargando(false);
    });
    return () => unsub();
  }, [canalSeleccionado.id, subcanalSeleccionado.id]);

  return (
    <div className="w-60 bg-[#2b2d31] flex flex-col border-r border-white/10 h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">{subcanalSeleccionado.nombre}</p>
          <h2 className="text-white font-semibold text-sm">Hilos</h2>
        </div>
        {esAdmin && (
          <button
            onClick={onCrearHilo}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
            title="Crear hilo"
          >
            +
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {cargando && (
          <p className="text-gray-400 text-xs px-2 mt-2">Cargando hilos...</p>
        )}

        {!cargando && hilos.length === 0 && (
          <p className="text-gray-400 text-xs px-2 mt-2">
            {esAdmin ? "No hay hilos. Crea el primero con el botón +." : "No hay hilos disponibles."}
          </p>
        )}

        {hilos.map((hilo) => (
          <button
            key={hilo.id}
            onClick={() => onSeleccionarHilo(hilo)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              hiloSeleccionado?.id === hilo.id
                ? "bg-[#5865f2] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-gray-500">💬</span>
            {hilo.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}