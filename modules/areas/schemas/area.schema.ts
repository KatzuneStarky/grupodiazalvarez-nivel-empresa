import { z } from "zod";

export const AreaSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    correoContacto: z.string().email(),
    empresaId: z.string(),
    descripcion: z.string().optional(),
    responsableId: z.string().optional(),
})

export type AreaSchemaType = z.infer<typeof AreaSchema>