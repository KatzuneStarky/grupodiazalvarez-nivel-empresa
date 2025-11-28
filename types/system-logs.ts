import { Timestamp } from "firebase/firestore"
import { RolUsuario } from "@/enum/user-roles"

export type LogAction =
    | 'create'
    | 'update'
    | 'delete'
    | 'login'
    | 'logout'
    | 'export'
    | 'import'
    | 'error'
    | 'view'
    | 'other'

export type LogResource =
    | 'usuario'
    | 'empresa'
    | 'vehiculo'
    | 'viaje'
    | 'mantenimiento'
    | 'sistema'
    | 'configuracion'
    | 'documento'
    | 'otro'

export interface SystemLog {
    id: string

    userId: string
    userEmail: string
    userRole: RolUsuario | string
    userName?: string
    timestamp: Timestamp
    empresaId?: string
    ip?: string
    userAgent?: string
    location?: string

    action: LogAction
    resourceType: LogResource
    resourceId?: string
    description: string
    metadata?: {
        previousData?: Record<string, any>
        newData?: Record<string, any>
        details?: string
        path?: string
        [key: string]: any
    }

    status: 'success' | 'failure' | 'warning'
    errorMessage?: string
}