import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const EstadoOrdenConsumoEnum = z.enum([
  "GENERADA",
  "IMPRESA",
  "PENDIENTE_CAPTURA",
  "COMPLETADA",
  "CANCELADA",
])
export type EstadoOrdenConsumo = z.infer<typeof EstadoOrdenConsumoEnum>

export const LecturaCombustibleSchema = z.object({
  diesel: z.coerce.number(),
  medidaTanque: z.coerce.number(),
  medidaTablero: z.coerce.number(),
})
export type LecturaCombustible = z.infer<typeof LecturaCombustibleSchema>

export const OrdenDeConsumoSchema = z.object({
  folio: z.number().int().nonnegative(),
  fecha: z.union([
    z.date(),
    z.instanceof(Timestamp),
  ]),

  estado: EstadoOrdenConsumoEnum,

  mediciones: z.object({
    antes: LecturaCombustibleSchema,
    despues: LecturaCombustibleSchema,
  }),

  equipoId: z.string(),
  numEconomico: z.string(),

  operadorId: z.string(),
  operadorNombre: z.string(),

  kilometraje: z.coerce.number(),
  destino: z.string(),

  observaciones: z.string().optional(),
})

export type OrdenDeConsumoType = z.infer<typeof OrdenDeConsumoSchema>