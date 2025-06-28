import { TipoEmpresaType } from "@/modules/administracion/enum/tipo-empresa";
import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa";
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
  areas?: Area[] | null;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaCierre?: Date;
  estado: EstadoEmpresa;
  logoUrl?: string;
  razonSocial?: string;
  tipo?: TipoEmpresaType;
  empresaPadreId?: string;
}