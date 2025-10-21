import { z } from "zod";

export const consumoSchema = z.object({
    equipoId: z.string(),
    operadorId: z.string(),
    viajeId: z.string(),
    fecha: z.date(),
    kmInicial: z.number(),
    kmFinal: z.number(),
    kmRecorridos: z.number(),
    litrosCargados: z.number(),
    rendimientoKmL: z.number(),
    costoLitro: z.number(),
    costoTotal: z.number(),
    observaciones: z.string()
})

export type ConsumoSchemaType = z.infer<typeof consumoSchema>