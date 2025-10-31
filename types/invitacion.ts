import { RolUsuario } from "@/enum/user-roles";

export interface Invitacion {
    id: string,
    email: string,
    rol: RolUsuario,
    empresaId: string,
    empresaName: string,
    creadaEn: Date,
    expiraEn: Date,
    usada: boolean,
}