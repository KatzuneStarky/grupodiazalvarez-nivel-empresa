import { EvidenciaSchema } from "../../mantenimientos/schemas/mantenimiento.schema";
import { z } from "zod";

export const IncidenciaSchema = z.object({
    operadorId: z.string(),
    equipoId: z.string(),
    fecha: z.date(),
    tipo: z.enum(['Mecanica', 'Electrica', 'Frenos', 'Motor', 'Neumaticos', 'Transmision', 'Fuga', 'Tanque', 'GPS', 'Documentacion', 'Accidente', 'Otro']),
    severidad: z.enum(['Baja', 'Media', 'Alta', 'Critica']),
    descripcion: z.string(),
    ubicacion: z.object({
        latitud: z.coerce.number(),
        longitud: z.coerce.number(),
        direccionAproximada: z.string(),
    }),
    estado: z.enum(['Reportada', 'En Revisión', 'En Proceso', 'Resuelta', 'Cancelada']),
    kmActual: z.coerce.number(),
    nivelCombustible: z.coerce.number(),
    velocidadAprox: z.coerce.number(),
    operable: z.boolean(),
    categoria: z.enum(['Seguridad', 'Mantenimiento', 'Operativa', 'Medio Ambiente', 'Documentos', 'Combustible']),
    mantenimientoId: z.string(),
    evidencias: z.array(EvidenciaSchema),
});

export type IncidenciaSchemaType = z.infer<typeof IncidenciaSchema>