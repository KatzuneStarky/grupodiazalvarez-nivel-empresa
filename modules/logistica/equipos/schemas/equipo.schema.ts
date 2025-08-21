import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos";
import { z } from "zod";

export const EquiposSchema = z.object({
    imagen: z.string().optional(), //listo
    tipoUnidad: z.string().optional(), //listo
    numEconomico: z.string(), //listo
    marca: z.string(), //listo
    modelo: z.string(), //listo
    year: z.coerce.number(), //listo
    serie: z.string().optional(), //listo
    placas: z.string().optional(), //listo
    m3: z.coerce.number(), //listo
    tipoTanque: z.string().optional(), //listo
    activo: z.boolean().optional(), //listo
    estado: z.nativeEnum(EstadoEquipos), //listo
    ultimaUbicacion: z.object({ //listo
        latitud: z.coerce.number(),
        longitud: z.coerce.number(),
        fecha: z.date(),
        direccionAproximada: z.string().optional(),
    }).optional(),
    gpsActivo: z.boolean().optional(), //listo
    rendimientoPromedioKmPorLitro: z.coerce.number().optional(), //listo
    ultimoConsumo: z.object({//listo
        fecha: z.date(),
        litros: z.coerce.number(),
        odometro: z.coerce.number(),
    }).optional(),
    seguro: z.object({//listo
        numeroPoliza: z.string(),
        aseguradora: z.string(),
        vigenciaHasta: z.date(),
        tipoCobertura: z.string().optional(),
    }).optional(),
    permisoSCT: z.object({//listo
        numero: z.string(),
        tipo: z.string(),
        vigenciaHasta: z.date(),
    }).optional(),
    idOperador: z.string().optional(),// listo
    grupoUnidad: z.enum(["GRUPO DIAZ ALVAREZ", "FELIX DIAZ ALVAREZ", "GENERAL"])//listo
})

export type EquiposSchemaType = z.infer<typeof EquiposSchema>