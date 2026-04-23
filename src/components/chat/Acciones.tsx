import { Mensaje, Usuario } from "@/types";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const EMOJIS = ["👍", "❤️", "😂"];

export default function Acciones({
  mensaje,
  ruta,
  datosUsuario,
  alResponder,
}: {
  mensaje: Mensaje;
  ruta: string;
  datosUsuario: Usuario;
  alResponder: (m: Mensaje) => void;
}) {
  const reaccionar = async (emoji: string) => {
    const ref = doc(db, ruta, mensaje.id);

    await updateDoc(ref, {
      [`reacciones.${emoji}`]: arrayUnion(datosUsuario.uid),
    });
  };

  return (
    <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100">

      {EMOJIS.map((e) => (
        <button key={e} onClick={() => reaccionar(e)}>
          {e}
        </button>
      ))}

      <button onClick={() => alResponder(mensaje)}>
        Responder
      </button>
    </div>
  );
}