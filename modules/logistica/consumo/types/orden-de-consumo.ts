export type EstadoOrdenConsumo =
    | "GENERADA"
    | "IMPRESA"
    | "PENDIENTE_CAPTURA"
    | "COMPLETADA"
    | "CANCELADA";


export interface OrdenDeConsumo {
    id: string
    folio: number
    fecha: Date
    estado: EstadoOrdenConsumo;

    mediciones: {
        antes: LecturaCombustible;
        despues: LecturaCombustible;
    }

    idEquipo: string
    numEconomico: string

    idOperador: string
    operador: string
    
    kilometraje: number
    destino: string
    observaciones?: string

    createdAt: Date
    updatedAt: Date
}

export interface LecturaCombustible {
    diesel: number
    medidaTanque: number
    medidaTablero: number
}