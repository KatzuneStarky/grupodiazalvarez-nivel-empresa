import { FileType } from "@/types/file-types";
import { Equipo } from "../bdd/equipos";

export interface Archivo {
    id: string;
    nombre: string;
    ruta: string;
    tipo: FileType;
    extension: string;
    peso: number;
    equipoId: string;
    equipo?: Equipo;
    createAt: Date;
    updateAt: Date;
}