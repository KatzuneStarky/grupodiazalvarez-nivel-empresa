import { z } from "zod";

export const ContactosEmergenciaSchema = z.object({
    nombre: z.string(),
    relacion: z.string(),
    telefono: z.string(),
})

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
    contactosEmergencia: z.array(ContactosEmergenciaSchema),
    idEquipo: z.string().optional(),
})

export type OperadoresSchemaType = z.infer<typeof OperadoresSchema>