import { Equipo } from "./equipos";

export interface Tanque {
    id: string;
    marca: string;
    modelo: string;
    year: number;
    serie?: string;
    placas?: string;
    equipoId?: string;
    equipo?: Equipo;
    createAt: Date;
    updateAt: Date;
}