import { z } from "zod";

export const RutaSchema = z.object({
    idCliente: z.string(),
    origen: z.object({
        nombre: z.string(),
        latitud: z.coerce.number(),
        longitud: z.coerce.number(),
    }),
    destino: z.object({
        nombre: z.string(),
        latitud: z.coerce.number(),
        longitud: z.coerce.number(),
    }),
    descripcion: z.string(),
    tipoViaje: z.enum(["local", "foráneo"]),
    clasificacion: z.enum(["material peligroso", "grava de 3/4", "cemento", "arena", "agua"]),
    activa: z.boolean(),
    viajeFacturable: z.boolean(),
    trayecto: z.object({
        origen: z.object({
            nombre: z.string(),
            latitud: z.coerce.number(),
            longitud: z.coerce.number(),
        }),
        destino: z.object({
            nombre: z.string(),
            latitud: z.coerce.number(),
            longitud: z.coerce.number(),
        }),
        kilometros: z.coerce.number(),
        horas: z.coerce.number(),
        tipoTrayecto: z.enum(["sencillo", "redondo", "otro"]),
        activo: z.boolean()
    })
})

export type RutaSchemaType = z.infer<typeof RutaSchema>