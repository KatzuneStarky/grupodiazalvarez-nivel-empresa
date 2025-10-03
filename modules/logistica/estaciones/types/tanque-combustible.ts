export interface TanqueCombustible {
    tipoCombustible: "Magna" | "Premium" | "Diesel";
    capacidadTotal: number;
    capacidadActual: number;
    numeroTanque?: string;
    fechaUltimaRecarga?: Date;
}