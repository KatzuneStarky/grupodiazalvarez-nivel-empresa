import { FileType } from "@/types/file-types";
import { Equipo } from "./equipos";

export interface Certificado {
    id: string;
    nombre: string;
    ruta: string;
    fecha: Date;
    tipo: FileType;
    extension: string;
    peso: number;
    equipoId: string;
    equipo?: Equipo;
    createAt: Date;
}