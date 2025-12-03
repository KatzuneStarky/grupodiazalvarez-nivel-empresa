import { z } from "zod";

export const MecanicoSchema = z.object({
    nombre: z.string(),
    apellido: z.string(),
    telefono: z.string(),
    email: z.string(),
    activo: z.boolean(),
    estado: z.enum(["DISPONIBLE", "OCUPADO", "INACTIVO", "FUERA_TALLER"]),
})

export type MecanicoSchemaType = z.infer<typeof MecanicoSchema>
