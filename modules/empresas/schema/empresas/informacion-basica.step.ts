import { z } from "zod";

export const InformacionBasicaStep1 = z.object({
    nombre: z.string().min(3, {
        message: "El nombre es muy corto"
    }),
    rfc: z.string().regex(/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/, {
        message: "El RFC es inválido"
    }),
    razonSocial: z.string().optional(),
    direccion: z.string().min(10, {
        message: "La dirección es muy corta"
    }),
    email: z.string().email(),
    telefono: z.string(),
    direccionWeb:
        z.string()
            .regex(/^https?:\/\/.+/,
                {
                    message: "URL inválida (debe incluir http:// o https://)"
                }
            ).optional()
})

export type InformacionBasicaStep1Type
    = z.infer<typeof InformacionBasicaStep1>