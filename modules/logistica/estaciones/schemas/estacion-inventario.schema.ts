import { z } from "zod";

export const InventariosEstacionesSchema = z.object({
    estacion: z.string(),
    inventarioManga: z.coerce.number(),
    pVentasDiarias: z.coerce.number(),
    inventarioPremium: z.coerce.number(),
    pVentasDiarias2: z.coerce.number(),
    inventarioDiesel: z.coerce.number(),
    pVentasDiarias3: z.coerce.number(),
})


export type InventariosEstacionesType = z.infer<typeof InventariosEstacionesSchema>