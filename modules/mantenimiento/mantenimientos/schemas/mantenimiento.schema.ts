import { z } from "zod";

export const MantenimientoDataSchema = z.object({
    descripcion: z.string(),
    cantidad: z.string(),
    mantenimientoId: z.string(),
});

export const EvidenciaSchema = z.object({
    nombre: z.string().min(1, "El nombre del archivo es requerido"),
    ruta: z.string().url("Debe ser una URL válida"),
    tipo: z.string().optional(),
    mantenimientoId: z.string().uuid().optional(),
    equipoId: z.string().uuid().optional(),
});

export const MantenimientoSchema = z.object({
    fecha: z.date(),
    fechaProximo: z.date(),
    kmMomento: z.coerce.number(),
    mecanico: z.string().optional(),
    notas: z.string().optional(),
    tipoServicio: z.string(),
    equipoId: z.string(),
    mantenimientoData: z.array(MantenimientoDataSchema).optional(),
    Evidencia: z.array(EvidenciaSchema).optional(),
});

export type MantenimientoSchemaType = z.infer<typeof MantenimientoSchema>;
export type MantenimientoDataSchemaType = z.infer<typeof MantenimientoDataSchema>;
export type EvidenciaSchemaType = z.infer<typeof EvidenciaSchema>;
