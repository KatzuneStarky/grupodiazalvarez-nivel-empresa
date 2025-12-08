import { RolUsuario } from "@/enum/user-roles";

export interface Invitacion {
    id: string,
    email: string,
    rol: RolUsuario,
    empresaId: string,
    empresaName: string,
    areaId?: string,
    creadaEn: Date,
    expiraEn: Date,
    usada: boolean,
}