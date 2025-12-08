import { Wrench, AlertTriangle, Activity, Zap, type LucideIcon } from "lucide-react"

export function getMaintenanceTypeColor(tipo?: "Preventivo" | "Correctivo" | "Predictivo" | "Emergencia"): string {
    switch (tipo) {
        case "Preventivo":
            return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        case "Correctivo":
            return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        case "Predictivo":
            return "bg-purple-500/10 text-purple-600 dark:text-purple-400"
        case "Emergencia":
            return "bg-red-500/10 text-red-600 dark:text-red-400"
        default:
            return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
    }
}

export function getMaintenanceTypeIcon(tipo?: "Preventivo" | "Correctivo" | "Predictivo" | "Emergencia"): LucideIcon {
    switch (tipo) {
        case "Preventivo":
            return Wrench
        case "Correctivo":
            return AlertTriangle
        case "Predictivo":
            return Activity
        case "Emergencia":
            return Zap
        default:
            return Wrench
    }
}

export function getStatusColor(estado?: "Pendiente" | "En Progreso" | "Completado" | "Cancelado"): string {
    switch (estado) {
        case "Pendiente":
            return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
        case "En Progreso":
            return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        case "Completado":
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        case "Cancelado":
            return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
        default:
            return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
    }
}
