"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { Usuario, Area, Categoria, Hilo } from "@/types";
import Sidebar from "./Sidebar";
import MiddleColumn from "./MiddleColumn";
import ChatArea from "./ChatArea";
import Header from "./Header";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

interface DashboardProps {
  user: User;
  usuarioData: Usuario;
  onLogout: () => void;
}

export default function Dashboard({ user, usuarioData, onLogout }: DashboardProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  const [selectedThread, setSelectedThread] = useState<Hilo | null>(null);

  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "areas"),
      where("año", "==", selectedYear),
      orderBy("creadoEn", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const areasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Area));
      setAreas(areasData);
    });

    return () => unsubscribe();
  }, [selectedYear]);

  return (
    <div className="flex flex-col h-screen bg-discord-darkest text-white overflow-hidden">
      <Header usuarioData={usuarioData} onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Columna Izquierda: AÑOS */}
        <Sidebar 
          selectedYear={selectedYear} 
          onSelectYear={(year) => {
            setSelectedYear(year);
            setSelectedArea(null);
            setSelectedCategory(null);
            setSelectedThread(null);
          }} 
        />

        {/* Columna Central: Áreas, Categorías y Hilos */}
        <MiddleColumn 
          areas={areas}
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedThread(null);
          }}
          selectedThread={selectedThread}
          onSelectThread={setSelectedThread}
        />

        {/* Columna Derecha: Chat */}
        <ChatArea 
          selectedArea={selectedArea}
          selectedCategory={selectedCategory}
          selectedThread={selectedThread}
          usuarioData={usuarioData}
        />
      </div>
    </div>
  );
}