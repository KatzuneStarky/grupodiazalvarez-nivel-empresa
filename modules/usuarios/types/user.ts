import { SystemUser } from "@/types/usuario"

export interface UserFilters {
    search: string
    estado: string
    tipoRegistro: string
    rol: string
    empresaId: string
    departamento: string
    cargo: string
    fechaCreacionDesde?: Date
    fechaCreacionHasta?: Date
    ultimoAccesoDesde?: Date
    ultimoAccesoHasta?: Date
}

export type ViewMode = "table" | "cards" | "list"
export type SortDirection = "asc" | "desc"
export type SortField = keyof SystemUser