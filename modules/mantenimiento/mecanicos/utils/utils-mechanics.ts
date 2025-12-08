import { EstadoMecanico } from "../../types/mecanico"

export function getStatusColor(estado: EstadoMecanico): string {
    switch (estado) {
        case EstadoMecanico.DISPONIBLE:
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        case EstadoMecanico.OCUPADO:
            return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        case EstadoMecanico.INACTIVO:
            return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
        case EstadoMecanico.FUERA_TALLER:
            return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        default:
            return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
    }
}

export function getStatusLabel(estado: EstadoMecanico): string {
    switch (estado) {
        case EstadoMecanico.DISPONIBLE:
            return "Disponible"
        case EstadoMecanico.OCUPADO:
            return "Ocupado"
        case EstadoMecanico.INACTIVO:
            return "Inactivo"
        case EstadoMecanico.FUERA_TALLER:
            return "Fuera del Taller"
        default:
            return "Desconocido"
    }
}