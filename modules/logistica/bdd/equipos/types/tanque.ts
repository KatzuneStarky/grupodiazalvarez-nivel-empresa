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

    capacidadLitros: number;
    tipoCombustible: "Diesel" | "Gasolina" | "Otro";
    numeroTanque?: string;
    ubicacion?: "Izquierdo" | "Derecho" | "Superior" | "Trasero";
    activo?: boolean;
    estadoFisico?: "Bueno" | "Regular" | "Malo";

    seguro?: {
        numeroPoliza: string;
        aseguradora: string;
        vigenciaHasta: Date;
        tipoCobertura?: string;
    };
    permisoSCT?: {
        numero: string;
        tipo: string;
        vigenciaHasta: Date;
    };

    createdAt: Date;
    updatedAt: Date;
}