import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"

export const STATUS_COLORS = {
    [EstadoEquipos.DISPONIBLE]: "bg-green-500",
    [EstadoEquipos.DISPONIBLE_CON_DETALLES]: "bg-orange-500",
    [EstadoEquipos.EN_TALLER]: "bg-yellow-500",
    [EstadoEquipos.EN_VIAJE]: "bg-blue-500",
    [EstadoEquipos.FUERA_DE_SERVICIO]: "bg-red-500",
}

export const STATUS_LABELS = {
    [EstadoEquipos.DISPONIBLE]: "Disponible",
    [EstadoEquipos.DISPONIBLE_CON_DETALLES]: "Disponible con detalles",
    [EstadoEquipos.EN_TALLER]: "En taller",
    [EstadoEquipos.EN_VIAJE]: "En viaje",
    [EstadoEquipos.FUERA_DE_SERVICIO]: "Fuera de servicio",
}

export interface StatusSummaryItem {
    status: EstadoEquipos
    count: number
    color: string
    label: string
}