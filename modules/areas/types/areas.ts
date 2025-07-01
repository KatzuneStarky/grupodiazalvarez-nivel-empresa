import { SystemUser } from "@/types/usuario";

export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
  correoContacto?: string;
  empresaId: string;
  usuarios?: SystemUser[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  responsable?: SystemUser
  responsableId?: string;
}