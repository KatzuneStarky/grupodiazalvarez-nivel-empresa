import { SystemUser } from "./usuario";

export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
  correoContacto?: string;
  empresaId: string;
  usuarios: SystemUser[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  responsableId?: string;
}

export type AreaInput = Omit<Area, "id" | "empresaId" | "fechaCreacion" | "fechaActualizacion" | "usuarios">;