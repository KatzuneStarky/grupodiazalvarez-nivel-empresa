import { z } from "zod";

export const ProductosSatSchema = z.object({
    key: z.string(),
    score: z.coerce.number(),
    description: z.string(),
})

export const UnidadesSatSchema = z.object({
    key: z.string(),
    score: z.coerce.number(),
    description: z.string(),
})

export const ProductoInventarioSchema = z.object({
    productoSAT: ProductosSatSchema,
    unidad: UnidadesSatSchema,
    cantidad: z.coerce.number(),
    minimo: z.coerce.number(),
    maximo: z.coerce.number(),
    notas: z.string(),
    inventarioId: z.string(),
    fechaUltimaEntrada: z.date(),
    fechaUltimaSalida: z.date(),
})

export const InventarioSchema = z.object({
    nombre: z.string(),
    ubicacion: z.string(),
    productos: z.array(ProductoInventarioSchema),
    fechaActualizacion: z.date(),
})