import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";
import { z } from "zod";

export const EquiposSchema = z.object({
    tipoUnidad: z.string().optional(),
    numEconomico: z.string(),
    marca: z.string(),
    modelo: z.string(),
    year: z.number().int().positive(),
    serie: z.string().optional(),
    placas: z.string().optional(),
    m3: z.number().optional(),
    tipoTanque: z.string().optional(),
    activo: z.boolean().optional(),
    estado: z.nativeEnum(EstadoEquipos),
    ultimaUbicacion: z.object({
        latitud: z.number(),
        longitud: z.number(),
        fecha: z.date(),
        direccionAproximada: z.string().optional(),
    }).optional(),
    gpsActivo: z.boolean().optional(),
    rendimientoPromedioKmPorLitro: z.number().optional(),
    ultimoConsumo: z.object({
        fecha: z.date(),
        litros: z.number(),
        odometro: z.number(),
    }).optional(),
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
    idOperador: z.string().optional()
})

export type EquiposSchemaType = z.infer<typeof EquiposSchema>