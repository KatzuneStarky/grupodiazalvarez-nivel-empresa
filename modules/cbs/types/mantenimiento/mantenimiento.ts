import { MantenimientoData } from "./mantenimiento-data";
import { Equipo } from "../bdd/equipos";
import { Evidencia } from "./evidencia";
import { Tanque } from "../equipos/tanque";

export interface Mantenimiento {
    id: string;
    fecha: Date;
    kmMomento: number;
    mecanico?: string;
    notas?: string;
    tipoServicio?: string;
    equipoId?: string;
    equipo?: Equipo | null;
    Evidencia: Evidencia[];
    mantenimientoData: MantenimientoData[];
    createAt: Date;
    updateAt: Date;
}

export interface MantenimientoConDetalles extends Mantenimiento {
    mantenimientoData: MantenimientoData[];
    evidencias: Evidencia[];
}

export interface EquipoConMantenimientos extends Equipo {
    mantenimientos: MantenimientoConDetalles[];
    tanques: Tanque[]
}