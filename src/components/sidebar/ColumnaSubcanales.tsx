"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Canal, Subcanal } from "@/types";

interface ColumnaSubcanalesProps {
  canalSeleccionado: Canal;
  subcanalSeleccionado: Subcanal | null;
  onSeleccionarSubcanal: (subcanal: Subcanal) => void;
  esAdmin: boolean;
  onCrearSubcanal: () => void;
}

export default function ColumnaSubcanales({ canalSeleccionado, subcanalSeleccionado, onSeleccionarSubcanal, esAdmin, onCrearSubcanal }: ColumnaSubcanalesProps) {
  const [subcanales, setSubcanales] = useState<Subcanal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, `canales/${canalSeleccionado.id}/subcanales`),
      orderBy("creadoEn", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setSubcanales(snap.docs.map(d => ({ id: d.id, ...d.data() } as Subcanal)));
      setCargando(false);
    });
    return () => unsub();
  }, [canalSeleccionado.id]);

  return (
    <div className="w-60 bg-[#2b2d31] flex flex-col border-r border-white/10 h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Canal</p>
          <h2 className="text-white font-semibold text-sm">{canalSeleccionado.nombre}</h2>
        </div>
        {esAdmin && (
          <button
            onClick={onCrearSubcanal}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
            title="Crear subcanal"
          >
            +
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {cargando && (
          <p className="text-gray-400 text-xs px-2 mt-2">Cargando subcanales...</p>
        )}

        {!cargando && subcanales.length === 0 && (
          <p className="text-gray-400 text-xs px-2 mt-2">
            {esAdmin ? "No hay subcanales. Crea el primero con el botón +." : "No hay subcanales disponibles."}
          </p>
        )}

        {subcanales.map((subcanal) => (
          <button
            key={subcanal.id}
            onClick={() => onSeleccionarSubcanal(subcanal)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              subcanalSeleccionado?.id === subcanal.id
                ? "bg-[#5865f2] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-gray-500">≡</span>
            {subcanal.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}