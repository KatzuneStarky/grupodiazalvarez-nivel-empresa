import { Equipo } from "../bdd/equipos";

export interface Revisiones {
    id: string;
    fecha: Date;
    equipoId?: string[];
    equipo?: Equipo[];
    createAt: Date;
    updateAt: Date;
}