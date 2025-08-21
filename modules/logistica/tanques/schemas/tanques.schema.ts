import { z } from "zod";

export const TanquesSchema = z.object({
    marca: z.string(),
    modelo: z.string(),
    year: z.coerce.number(),
    serie: z.string().optional(),
    placas: z.string().optional(),
    equipoId: z.string().optional(),
    capacidadLitros: z.coerce.number(),
    tipoCombustible: z.enum(["Diesel", "Gasolina", "Otro"]),
    numeroTanque: z.string().optional(),
    ubicacion: z.enum(["Izquierdo", "Derecho", "Superior", "Trasero"]).optional(),
    activo: z.boolean().optional(),
    estadoFisico: z.enum(["Bueno", "Regular", "Malo"]).optional(),
    seguro: z.object({
        numeroPoliza: z.string(),
        aseguradora: z.string(),
        vigenciaHasta: z.date(),
        tipoCobertura: z.string().optional(),
    }).optional(),
    permisoSCT: z.object({
        numero: z.string(),
        tipo: z.string(),
        vigenciaHasta: z.date(),
    }).optional(),
})

export type TanquesSchemaType = z.infer<typeof TanquesSchema>