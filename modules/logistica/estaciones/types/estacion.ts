import { TanqueCombustible } from "./tanque-combustible";

export interface EstacionServicio {
  id: string;
  nombre: string;
  razonSocial?: string;
  rfc?: string;
  direccion: {
    calle: string;
    numeroExterior: string;
    numeroInterior?: string;
    colonia: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
  };
  ubicacion?: {
    lat: number;
    lng: number;
  };
  contacto: {
    telefono?: string;
    email?: string;
    responsable?: string;
  };
  numeroPermisoCRE?: string;
  horarios?: string;
  productos?: string[];
  tanques: TanqueCombustible[];
  activo: boolean;
  fechaRegistro: Date;

  createdAt: Date
  updatedAt: Date
}