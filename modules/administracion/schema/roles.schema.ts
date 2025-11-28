import { z } from "zod";

export const RolesSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre debe tener menos de 50 caracteres"),
    type: z.enum(["Global", "Personalizado"]),
    users: z.coerce.number().min(1, "Debe haber al menos 1 usuario"),
    color: z.string().min(7, "El color debe tener al menos 7 caracteres"),
    permisos: z.object({
        crear: z.boolean(),
        leer: z.boolean(),
        actualizar: z.boolean(),
        eliminar: z.boolean(),
        aprobar: z.boolean(),
        exportar: z.boolean()
    })
})

export type RolesSchemaType = z.infer<typeof RolesSchema>