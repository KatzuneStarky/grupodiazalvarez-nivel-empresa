export enum RolUsuario {
    Super_Admin = "super_administrador",
    Admin = "administrador",
    usuario = "usuario",
    Supervisor_Logistica = "supervisor_logistica",
    Conductor = "conductor",
    Mecanico = "mecanico",
    Operador_Tanqueo = "operador_tanqueo",
    Auditor = "auditor",
    Cliente = "cliente",
    Coordinador_Seguridad = "coordinador_seguridad",
    Planificador_Rutas = "planificador_rutas",
    Despachador = "despachador",
    Control_Combustible = "control_combustible",
    Operador_GPS = "operador_gps",
    Administrativo = "administrativo",
    Responsable_Incidentes = "responsable_incidentes"
}

export const ArrayRoles = Object.values(RolUsuario).map((rol) => ({
    label: rol,
    value: rol,
}))