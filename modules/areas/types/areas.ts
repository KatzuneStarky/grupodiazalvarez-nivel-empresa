import { Menu } from "@/modules/menus/types/menu-sistema";
import { SystemUser } from "@/types/usuario";

export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
  correoContacto?: string;
  empresaId: string;
  usuarios?: string[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  responsable?: string
  responsableId?: string;
  menus?: Menu[];
}