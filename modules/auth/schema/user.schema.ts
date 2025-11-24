import { TipoRegistroUsuario } from "../enum/tipo-registro-usuario";
import { estadoUsuario } from "../enum/estado-usuario";
import { RolUsuario } from "@/enum/user-roles";
import { z } from "zod";

export const UserSchema = z.object({
    uid: z.string(),
    email: z.string().email(),
    nombre: z.string().optional(),
    avatarUrl: z.string().optional(),
    fechaNacimiento: z.date({
        required_error: "La fecha de nacimiento es requerida",
        invalid_type_error: "Debe ser una fecha válida",
    }).refine(date => {
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100);
        return date <= today && date >= minDate;
    }, "La fecha debe estar entre hoy y hace 100 años"),
    estado: z.nativeEnum(estadoUsuario).default(estadoUsuario.activo).optional(),
    tipoRegistro: z.nativeEnum(TipoRegistroUsuario).default(TipoRegistroUsuario.google).optional(),
    rol: z.nativeEnum(RolUsuario).optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
