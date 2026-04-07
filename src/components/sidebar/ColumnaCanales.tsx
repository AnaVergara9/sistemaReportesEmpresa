"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Canal } from "@/types";

interface ColumnaCanalesProps {
  canalSeleccionado: Canal | null;
  onSeleccionarCanal: (canal: Canal) => void;
  esAdmin: boolean;
  onCrearCanal: () => void;
}

export default function ColumnaCanales({ canalSeleccionado, onSeleccionarCanal, esAdmin, onCrearCanal }: ColumnaCanalesProps) {
  const [canales, setCanales] = useState<Canal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "canales"), orderBy("creadoEn", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setCanales(snap.docs.map(d => ({ id: d.id, ...d.data() } as Canal)));
      setCargando(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-60 bg-[#2b2d31] flex flex-col border-r border-white/10 h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide">Canales</h2>
        {esAdmin && (
          <button
            onClick={onCrearCanal}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
            title="Crear canal"
          >
            +
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {cargando && (
          <p className="text-gray-400 text-xs px-2 mt-2">Cargando canales...</p>
        )}

        {!cargando && canales.length === 0 && (
          <p className="text-gray-400 text-xs px-2 mt-2">
            {esAdmin ? "No hay canales. Crea el primero con el botón +." : "No hay canales disponibles."}
          </p>
        )}

        {canales.map((canal) => (
          <button
            key={canal.id}
            onClick={() => onSeleccionarCanal(canal)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              canalSeleccionado?.id === canal.id
                ? "bg-[#5865f2] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-gray-500">#</span>
            {canal.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}