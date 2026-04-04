export interface Usuario {
  uid: string;
  nombre: string;
  empresa: string;
  email: string;
  avatarColor: string;
  creadoEn: any;
}

export interface Area {
  id: string;
  nombre: string;
  descripcion: string;
  año: number;
  creadoEn: any;
}

export interface Categoria {
  id: string;
  nombre: string;
  creadoEn: any;
}

export interface Hilo {
  id: string;
  nombre: string;
  creadoPor: string;
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
  [emoji: string]: string[]; // array of userIds
}

export interface Mensaje {
  id: string;
  texto: string;
  autorId: string;
  autorNombre: string;
  autorEmpresa: string;
  fecha: any;
  archivos: ArchivoAdjunto[];
  reacciones: Reacciones;
  respondidoA: string | null;
}