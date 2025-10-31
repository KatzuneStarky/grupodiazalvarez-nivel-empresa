import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa";
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa";
import { ContactInfoInput } from "./contactos";
import { AreaInput } from "@/types/area";

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
  usuarios?: string[];  
  configuraciones: {
    notificacionesEmail: boolean;
    reportesAutomaticos: boolean;
    accesoPublico: boolean;
  };
  fechaCreacion: Date;
  fechaActualizacion: Date;
}