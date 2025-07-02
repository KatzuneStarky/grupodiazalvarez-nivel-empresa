import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa";
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa";
import { ContactInfo, ContactInfoInput } from "./contactos";
import { Area, AreaInput } from "@/types/area";
import { SystemUser } from "@/types/usuario";

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
  numeroEmpleados?: string
  tipo?: TipoEmpresa;
  descripcion?: string
  estado: EstadoEmpresa;
  empresaPadreId?: string;
  fechaCierre?: Date;
  areas?: AreaInput[];
  contactos: ContactInfoInput[]
  usuarios?: SystemUser[];  
  configuraciones: {
    notificacionesEmail: boolean;
    reportesAutomaticos: boolean;
    accesoPublico: boolean;
  };
  fechaCreacion: Date;
  fechaActualizacion: Date;
}