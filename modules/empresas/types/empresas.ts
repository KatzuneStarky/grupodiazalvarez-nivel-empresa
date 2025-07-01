import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa";
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa";
import { SystemUser } from "@/types/usuario";
import { ContactInfo } from "./contactos";
import { Area } from "@/types/area";

export interface Empresa {
  id: string;
  nombre: string;
  rfc: string;
  razonSocial?: string;
  direccion: string;
  email: string;
  telefono: string;
  direccionWeb?: string
  logoUrl?: string;
  industria?: string
  numeroEmpleados?: number
  tipo?: TipoEmpresa;
  descripcion?: string
  estado: EstadoEmpresa;
  empresaPadreId?: string;
  fechaCierre?: Date;
  areas?: Area[];
  contactos: ContactInfo[]
  usuarios?: SystemUser[];  
  configuraciones: {
    notificacionesEmail: boolean;
    reportesAutomaticos: boolean;
    accesoPublico: boolean;
  };
  fechaCreacion: Date;
  fechaActualizacion: Date;
}