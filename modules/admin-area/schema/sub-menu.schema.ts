import { RolUsuario } from "@/enum/user-roles";
import { z } from "zod";

export const SubMenuSchema = z.object({
    name: z.string(),
    icon: z.string(),
    areaId: z.string(),
    link: z.string(),
    allowedRoles: z.array(z.nativeEnum(RolUsuario)),
})