import { z } from "zod";

export const OperadoresSchema = z.object({
    image: z.string().optional(),
    apellidos: z.string(),
    nombres: z.string(),
    telefono: z.string(),
    email: z.string().email(),
    nss: z.string(),
    curp: z.string(),
    ine: z.string(),
    colonia: z.string(),
    calle: z.string(),
    externo: z.coerce.number(),
    cp: z.coerce.number(),
    tipoSangre: z.string(),
    numLicencia: z.string(),
    tipoLicencia: z.string(),
    emisor: z.string(),
    idEquipo: z.string().optional(),
})

export type OperadoresSchemaType = z.infer<typeof OperadoresSchema>