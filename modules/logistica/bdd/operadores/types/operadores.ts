import { Equipo } from "../../equipos/types/equipos";

export const relacionContactoMap = Object.entries({
    "FAMILIAR": "FAMILIAR",
    "MADRE": "MADRE",
    "PADRE": "PADRE",
    "HERMANO": "HERMANO",
    "AMIGO": "AMIGO",
    "TRABAJO": "TRABAJO",
    "ESPOSA": "ESPOSA",
    "ESPOSO": "ESPOSO",
    "HIJO": "HIJO",
    "HIJA": "HIJA",
    "OTRO": "OTRO"
}).map(([key, value]) => ({ key, value }))

export interface Operador {
    id: string;
    image?: string;
    apellidos: string;
    nombres: string;
    telefono: string;
    email: string;
    nss: string;
    curp: string;
    ine: string;
    colonia: string;
    calle: string;
    externo: number;
    cp: number;
    tipoSangre: string;
    numLicencia: string;
    tipoLicencia: string;
    emisor: string;
    contactosEmergencia?: ContactosEmergencia[]
    idEquipo?: string
    equipo?: Equipo
    createdAt: Date;
    updatedAt: Date;
}

export interface ContactosEmergencia {
    nombre: string
    relacion: string
    telefono: string
}