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
    proximoKm: z.coerce.number(),
    mecanicoId: z.string().optional(),
    notas: z.string().optional(),
    tipoServicio: z.string(),
    tipoMantenimiento: z.enum(['Preventivo', 'Correctivo', 'Predictivo', 'Emergencia']),
    estado: z.enum(['Pendiente', 'En Progreso', 'Completado', 'Cancelado']),
    equipoId: z.string(),
    ordenMantenimientoId: z.string().optional(), // Relación con la orden de mantenimiento
    incidenciaId: z.string().optional(), // Relación con la incidencia original
    mantenimientoData: z.array(MantenimientoDataSchema),
    Evidencia: z.array(EvidenciaSchema),
});

export type MantenimientoSchemaType = z.infer<typeof MantenimientoSchema>;
export type MantenimientoDataSchemaType = z.infer<typeof MantenimientoDataSchema>;
export type EvidenciaSchemaType = z.infer<typeof EvidenciaSchema>;
