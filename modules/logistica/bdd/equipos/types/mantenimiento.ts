import { Revisiones } from "./revisiones";
import { Equipo } from "./equipos";
import { Tanque } from "./tanque";

export interface Mantenimiento {
    id: string;
    fecha: Date;
    kmMomento: number;
    mecanicoId?: string;
    notas?: string;
    tipoServicio?: string; // e.g., "Cambio de Aceite", "Revisión General"
    tipoMantenimiento?: 'Preventivo' | 'Correctivo' | 'Predictivo' | 'Emergencia'; // Added more specific type
    estado?: 'Pendiente' | 'En Progreso' | 'Completado' | 'Cancelado'; // Added status
    fechaProximo?: Date;
    proximoKm?: number; // Added next km for maintenance
    equipoId?: string;
    Evidencia?: Evidencia[];
    mantenimientoData?: MantenimientoData[];
    createAt: Date;
    updateAt: Date;
}

export interface MantenimientoData {
    id: string;
    descripcion: string;
    cantidad: string;
    unidadMedida?: string; // e.g., "litros", "unidades", "horas"
    precioUnitario?: number; // Added unit price
    costo?: number; // Added total cost for this item
    referenciaParte?: string; // Added part number/reference
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
    equipo: Equipo;
}

export interface EquipoConMantenimientos extends Equipo {
    mantenimientos: MantenimientoConDetalles[];
    tanques: Tanque[]
}

export type MantenimientoDataInput = Omit<MantenimientoData, "id" | "createAt" | "updateAt">;
export type EvidenciaInput = Omit<Evidencia, "id" | "createAt" | "updateAt">;

export type MantenimientoInput = Omit<Mantenimiento, "id" | "createAt" | "updateAt" | "mantenimientoData" | "Evidencia"> & {
    mantenimientoData: MantenimientoDataInput[];
    Evidencia: EvidenciaInput[];
};