"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Canal, Subcanal } from "@/types";

interface PropiedadesColumnaSubcanales {
  canalActivo: Canal;
  subcanalActivo: Subcanal | null;
  alSeleccionarSubcanal: (subcanal: Subcanal) => void;
  esAdministrador: boolean;
  alCrearSubcanal: () => void;
}

export default function ColumnaSubcanales({ canalActivo, subcanalActivo, alSeleccionarSubcanal, esAdministrador, alCrearSubcanal }: PropiedadesColumnaSubcanales) {
  const [subcanales, setSubcanales] = useState<Subcanal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const consulta = query(
      collection(db, `canales/${canalActivo.id}/subcanales`),
      orderBy("creadoEn", "asc")
    );
    const cancelarSuscripcion = onSnapshot(consulta, (resultado) => {
      setSubcanales(resultado.docs.map(documento => ({ id: documento.id, ...documento.data() } as Subcanal)));
      setCargando(false);
    });
    return () => cancelarSuscripcion();
  }, [canalActivo.id]);

  return (
    <div className="w-60 flex-shrink-0 bg-[#2b2d31] flex flex-col border-r border-white/10 h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Canal</p>
          <h2 className="text-white font-semibold text-sm">{canalActivo.nombre}</h2>
        </div>
        {esAdministrador && (
          <button
            onClick={alCrearSubcanal}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
            title="Crear subcanal"
          >
            +
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {cargando && <p className="text-gray-400 text-xs px-2 mt-2">Cargando subcanales...</p>}

        {!cargando && subcanales.length === 0 && (
          <p className="text-gray-400 text-xs px-2 mt-2">
            {esAdministrador ? "No hay subcanales. Crea el primero con +" : "No hay subcanales disponibles."}
          </p>
        )}

        {subcanales.map((subcanal) => (
          <button
            key={subcanal.id}
            onClick={() => alSeleccionarSubcanal(subcanal)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              subcanalActivo?.id === subcanal.id
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