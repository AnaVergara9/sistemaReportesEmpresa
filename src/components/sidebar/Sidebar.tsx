"use client";

import { useState } from "react";

interface SidebarProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export default function Sidebar({ selectedYear, onSelectYear }: SidebarProps) {
  // Podemos generar una lista de años dinámicamente o tenerla fija
  const years = [2024, 2025, 2026]; // Ejemplo de años

  return (
    <div className="w-60 bg-discord-darker flex flex-col p-4 border-r border-discord-gray">
      <h2 className="text-lg font-bold mb-4">Años</h2>
      <ul className="space-y-2">
        {years.map((year) => (
          <li key={year}>
            <button
              onClick={() => onSelectYear(year)}
              className={`w-full text-left p-2 rounded ${selectedYear === year ? "bg-discord-accent" : "hover:bg-discord-hover"}`}
            >
              {year}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
