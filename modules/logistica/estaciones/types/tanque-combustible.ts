export interface TanqueCombustible {
    id: string;
    tipoCombustible: "Magna" | "Premium" | "Diesel" | string;
    capacidadTotal: number;
    capacidadActual: number;
    numeroTanque?: string;
    fechaUltimaRecarga?: Date;
}