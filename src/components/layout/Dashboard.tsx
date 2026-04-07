"use client";

import { useState, useEffect } from "react";
import { Usuario, Canal, Subcanal, Hilo } from "@/types";

// Importamos los componentes de la interfaz de Dashboard. Estos son sub-componentes.
import Sidebar from "../sidebar/ColumnaCanales"; // Columna izquierda para selección canal
import MiddleColumn from "../sidebar/ColumnaSubcanales"; // Columna central para áreas, categorías e hilos
import ChatArea from "../chat/ChatArea"; // Columna derecha para el chat
import Header from "./Header"; // Encabezado de la aplicación

// Importamos la configuración de Firebase para la base de datos
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

/**
 * Define las propiedades que el componente Dashboard espera recibir.
 */
interface DashboardProps {
  usuarioData: Usuario; // Datos adicionales del usuario guardados en Firestore
  onLogout: () => void; // Función para cerrar la sesión
}

/**
 * Componente principal del Dashboard.
 * Organiza la interfaz en tres columnas (Sidebar, MiddleColumn, ChatArea) y un encabezado.
 * Gestiona el estado de las selecciones del usuario (año, área, categoría, hilo)
 * y carga las áreas desde Firestore basándose en el año seleccionado.
 */
export default function Dashboard({ usuarioData, onLogout }: DashboardProps) {
  // Estado para el año seleccionado (por defecto 2024)
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  // Estados para las selecciones actuales (canal, subcanal, hilo)
  const [selectedArea, setSelectedArea] = useState<Canal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Subcanal | null>(null);
  const [selectedThread, setSelectedThread] = useState<Hilo | null>(null);

  // Estado para almacenar la lista de canales cargados desde Firestore
  const [areas, setAreas] = useState<Canal[]>([]);

  // Efecto que se ejecuta cada vez que cambia el año seleccionado
  useEffect(() => {
    // Creamos una consulta a la colección "areas" en Firestore
    const q = query(
      collection(db, "areas"),
      where("año", "==", selectedYear), // Filtramos por el año seleccionado
      orderBy("creadoEn", "asc") // Ordenamos por fecha de creación
    );

    // Nos suscribimos a los cambios en tiempo real de la consulta
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Mapeamos los documentos de Firestore a nuestro tipo 'Canal'
      const areasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Canal));
      setAreas(areasData); // Actualizamos el estado de los canales
    });

    // La función de retorno limpia la suscripción cuando el componente se desmonta o el efecto se re-ejecuta
    return () => unsubscribe();
  }, [selectedYear]); // Este efecto depende de 'selectedYear'

  return (
    <div className="flex flex-col h-screen bg-discord-darkest text-white overflow-hidden">
      {/* Encabezado de la aplicación */}
      <Header usuarioData={usuarioData} onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Columna Izquierda: Selección de Años */}
        <Sidebar 
          selectedYear={selectedYear} 
          onSelectYear={(year) => {
            setSelectedYear(year);
            // Cuando se cambia el año, reseteamos las selecciones de área, categoría e hilo
            setSelectedArea(null);
            setSelectedCategory(null);
            setSelectedThread(null);
          }} 
        />

        {/* Columna Central: Áreas, Categorías y Hilos */}
        <MiddleColumn 
          areas={areas} // Le pasamos las áreas cargadas
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedThread(null); // Cuando se cambia la categoría, reseteamos el hilo
          }}
          selectedThread={selectedThread}
          onSelectThread={setSelectedThread}
        />

        {/* Columna Derecha: Área de Chat */}
        <ChatArea 
          selectedArea={selectedArea}
          selectedCategory={selectedCategory}
          selectedThread={selectedThread}
          usuarioData={usuarioData} // Le pasamos los datos del usuario actual
        />
      </div>
    </div>
  );
}