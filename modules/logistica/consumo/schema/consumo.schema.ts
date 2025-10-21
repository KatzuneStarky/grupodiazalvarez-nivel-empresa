import { z } from "zod";

export const consumoSchema = z.object({
    equipoId: z.string(),
    operadorId: z.string(),
    viajeId: z.string(),
    fecha: z.date(),
    kmInicial: z.coerce.number(),
    kmFinal: z.coerce.number(),
    kmRecorridos: z.coerce.number(),
    litrosCargados: z.coerce.number(),
    rendimientoKmL: z.coerce.number(),
    costoLitro: z.coerce.number(),
    costoTotal: z.coerce.number(),
    observaciones: z.string()
})

export type ConsumoSchemaType = z.infer<typeof consumoSchema>