import { Timestamp } from "firebase/firestore";

export interface ConsumoCombustible {
    id: string;
    equipoId: string;
    operadorId?: string;
    viajeId?: string;

    fecha: Date | Timestamp;
    kmInicial?: number;
    kmFinal?: number;
    kmRecorridos?: number;

    litrosCargados: number;
    rendimientoKmL?: number;

    costoLitro?: number;
    costoTotal?: number;

    observaciones?: string;

    createdAt: Date;
    updatedAt: Date;
}