import { Revisiones } from "./revisiones";
import { Equipo } from "./equipos";
import { Tanque } from "./tanque";

export interface Mantenimiento {
    id: string;
    fecha: Date;
    kmMomento: number;
    mecanico?: string;
    notas?: string;
    tipoServicio?: string;
    fechaProximo?: Date;
    equipoId?: string;
    equipo?: Equipo | null;
    Evidencia: Evidencia[];
    mantenimientoData: MantenimientoData[];
    createAt: Date;
    updateAt: Date;
}

export interface MantenimientoData {
    id: string;
    descripcion: string;
    cantidad: string;
    Mantenimiento?: Mantenimiento;
    mantenimientoId?: string;
    createAt: Date;
    updateAt: Date;
}

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

export interface MantenimientoConDetalles extends Mantenimiento {
    mantenimientoData: MantenimientoData[];
    evidencias: Evidencia[];
}

export interface EquipoConMantenimientos extends Equipo {
    mantenimientos: MantenimientoConDetalles[];
    tanques: Tanque[]
}