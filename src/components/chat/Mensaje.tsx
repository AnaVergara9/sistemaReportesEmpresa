import { Mensaje as TipoMensaje, Usuario } from "@/types";
import ArchivoAdjunto from "./ArchivoAdjunto";
import Acciones from "./Acciones";

interface Props {
  mensaje: TipoMensaje;
  ruta: string;
  datosUsuario: Usuario;
  alResponder: (m: TipoMensaje) => void;
}

export default function Mensaje({
  mensaje,
  ruta,
  datosUsuario,
  alResponder,
}: Props) {
  return (
    <div className="group hover:bg-white/5 p-2 rounded">

      {/* RESPUESTA */}
      {mensaje.respondidoA && (
        <div className="text-xs text-gray-400">
          {mensaje.respondidoA.autorNombre}: {mensaje.respondidoA.texto}
        </div>
      )}

      <div className="text-white font-semibold">
        {mensaje.autorNombre}
      </div>

      <div className="text-gray-200">
        {mensaje.texto}
      </div>

      {/* ARCHIVOS */}
      <ArchivoAdjunto archivos={mensaje.archivos} />

      {/* ACCIONES */}
      <Acciones
        mensaje={mensaje}
        ruta={ruta}
        datosUsuario={datosUsuario}
        alResponder={alResponder}
      />
    </div>
  );
}