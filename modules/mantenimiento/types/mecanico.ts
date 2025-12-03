export enum EstadoMecanico {
    DISPONIBLE = "DISPONIBLE",
    OCUPADO = "OCUPADO",
    INACTIVO = "INACTIVO",
    FUERA_TALLER = "FUERA_TALLER",
}

export interface Mecanico {
    id: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
    email?: string;
    estado: EstadoMecanico;
    activo: boolean;
    mantenimientosAsignados: string[];
    historial: string[];
    createdAt: Date;
    updatedAt: Date;
}