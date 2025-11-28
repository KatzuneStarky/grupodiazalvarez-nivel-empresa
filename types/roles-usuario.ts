export interface RolesUsuario {
    id: string;
    name: string
    type: string
    users?: number
    color: string
    permisos: {
        crear?: boolean
        leer?: boolean
        actualizar?: boolean
        eliminar?: boolean
        aprobar?: boolean
        exportar?: boolean
    }
}