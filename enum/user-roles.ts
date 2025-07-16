export enum RolUsuario {
    Super_Admin = "super_administrador",
    Admin = "administrador",
    usuario = "usuario"
}

export const ArrayRoles = Object.values(RolUsuario).map((rol) => ({
    label: rol,
    value: rol,
}))