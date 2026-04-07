export type Rol = "admin" | "empleado";

export interface Usuario {
  uid: string; // ID único del usuario
  nombre: string;
  cargo: string;
  rol: Rol;
  empresa: string;
  email: string;
  avatarColor: string;
  creadoEn: any;
}

export interface Canal {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: any;
}

export interface Subcanal {
  id: string;
  nombre: string;
  creadoEn: any;
}

export interface Hilo {
  id: string;
  nombre: string;
  creadoEn: any;
}

export interface ArchivoAdjunto {
  nombre: string;
  tamaño: number;
  driveId: string;
  driveLink: string;
  tipo: string;
}

export interface Reacciones {
  [emoji: string]: string[]; //usuarios que reaccionaron con ese emoji
}

export interface Mensaje {
  id: string;
  texto: string;
  autorId: string;
  autorNombre: string;
  fecha: any;
  archivos: ArchivoAdjunto[];
  reacciones: Reacciones;
  respondidoA: string | null;
}