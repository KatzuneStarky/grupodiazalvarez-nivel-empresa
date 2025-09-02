import { FileType } from "@/types/file-types";
import { Equipo } from "./equipos";

export interface ArchivosVencimiento {
    id: string;
    nombre: string;
    ruta: string;
    fecha: Date;
    tipo: FileType;
    extension: string;
    peso: number;
    equipoId: string;
    equipo?: Equipo;
    createdAt: Date;
    updatedAt: Date
}