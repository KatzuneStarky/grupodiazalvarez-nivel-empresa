import { RolUsuario } from "@/enum/user-roles";

export interface SystemUser {
    id: string;
    uidFirebase: string;
    email: string;
    nombre?: string;
    avatarUrl?: string;
    fechaNacimiento: Date
    creadoEn: Date;
    actualizadoEn: Date;
    ultimoAcceso?: Date;
    estado: "pendiente" | "activo" | "suspendido";
    tipoRegistro: "google" | "email";
    rol?: RolUsuario;
    empresaId?: string;
    empleadoId?: string;
}