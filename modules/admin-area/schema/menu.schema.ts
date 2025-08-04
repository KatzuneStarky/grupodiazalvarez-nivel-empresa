import { RolUsuario } from "@/enum/user-roles";
import { z } from "zod";

export const areaMenuSchema = z.object({
    name: z.string(),
    icon: z.string(),
    areaId: z.string(),
    link: z.string(),
    allowedRoles: z.array(z.nativeEnum(RolUsuario)),
})