import { FileType } from "@/types/file-types";
import { Equipo } from "./equipos";

export interface Archivo {
    id: string;
    nombre: string;
    ruta: string;
    tipo: FileType;
    extension: string;
    peso: number;
    equipoId: string;
    equipo?: Equipo;
    createdAt: Date;
    updatedAt: Date;
}