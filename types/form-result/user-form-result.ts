import { RolUsuario } from "@/enum/user-roles";

export interface WriteUserResult {
    success: boolean;
    message: string;
    error?: Error;
    rol?: RolUsuario
}