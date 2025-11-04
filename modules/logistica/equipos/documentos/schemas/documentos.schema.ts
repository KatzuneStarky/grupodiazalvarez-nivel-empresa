import { z } from "zod";

const baseSchema = z.object({
  equipoId: z.string({ required_error: "El equipo es requerido" }),
  fecha: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date({ required_error: "La fecha es requerida" })
  ),
  nombre: z.string({ required_error: "El nombre es requerido" }).optional(),
  files: z.array(z.instanceof(File)).min(1, "Debes seleccionar al menos un archivo"),
});

export const ArchivosSchema = baseSchema.pick({ equipoId: true, files: true });

export const CertificadoSchema = baseSchema.extend({
  fecha: baseSchema.shape.fecha,
  nombre: z.string(),
});

export const ArchivosVencimientoSchema = CertificadoSchema;

export type ArchivosVencimientoSchemaType = z.infer<typeof ArchivosVencimientoSchema>
export type CertificadoSchemaType = z.infer<typeof CertificadoSchema>
export type ArchivosSchemaType = z.infer<typeof ArchivosSchema>