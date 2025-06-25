import { SystemUser } from "./usuario";
import { Area } from "./area";

export interface Empresa {
  id: string;
  nombre: string;
  rfc: string;
  direccion: string;
  email: string;
  telefono: string;
  usuarios: SystemUser[];
  areas: Area[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaCierre?: Date;
  estado: "activa" | "cerrada" | "suspendida";
  logoUrl?: string;
  razonSocial?: string;
  tipo?: "matriz" | "sucursal";
  empresaPadreId?: string;
}