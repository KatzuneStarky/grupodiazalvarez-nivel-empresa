import { z } from "zod";

export const ConfiguracionesStep4 = z.object({
    notificacionesEmail: z.boolean(),
    reportesAutomaticos: z.boolean(),
    accesoPublico: z.boolean(),
})

export type ConfiguracionesStep4Type
    = z.infer<typeof ConfiguracionesStep4>