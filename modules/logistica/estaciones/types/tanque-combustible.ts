export interface TanqueCombustible {
    tipoCombustible: "Magna" | "Premium" | "Diesel" | string;
    capacidadTotal: number;
    capacidadActual: number;
    numeroTanque?: string;
    fechaUltimaRecarga?: Date;
}