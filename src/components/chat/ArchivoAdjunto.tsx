import { ArchivoAdjunto as TipoArchivo } from "@/types";

export default function ArchivoAdjunto({
  archivos,
}: {
  archivos: TipoArchivo[];
}) {
  if (!archivos || archivos.length === 0) return null;

  return (
    <div className="mt-2">
      {archivos.map((a, i) => (
        <a
          key={i}
          href={a.url}
          target="_blank"
          className="text-blue-400 block"
        >
          📎 {a.nombre}
        </a>
      ))}
    </div>
  );
}