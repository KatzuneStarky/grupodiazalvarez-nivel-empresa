import { Revisiones } from "../revisiones/revisiones";
import { Mantenimiento } from "./mantenimiento";
import { Equipo } from "../bdd/equipos";

export interface Evidencia {
    id: string;
    nombre: string;
    ruta: string;
    tipo?: string;
    mantenimientoId?: string;
    mantenimiento?: Mantenimiento;
    revisionId?: string;
    revision?: Revisiones;
    equipoId?: string;
    equipo?: Equipo;
    createAt: Date;
}