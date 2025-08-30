import { z } from "zod";

const ContactoClienteSchema = z.object({
    nombre: z.string(),
    email: z.string().email(),
    telefono: z.string()
})

const DomicilioClienteSchema = z.object({
    pais: z.string(),
    cp: z.string(),
    estado: z.string(),
    municipio: z.string(),
    colonia: z.string().optional(),
    localidad: z.string(),
    calle: z.string(),
    exterior: z.string().optional(),
    interior: z.string().optional(),
    telefono: z.string().optional(),
    celular: z.string().optional()
})

export const ClienteSchema = z.object({
    nombreFiscal: z.string(),
    nombreCorto: z.string().optional(),
    rfc: z.string().min(13).max(16)
        .regex(/^(((?!(([CcKk][Aa][CcKkGg][AaOo])|([Bb][Uu][Ee][YyIi])|([Kk][Oo](([Gg][Ee])|([Jj][Oo])))|([Cc][Oo](([Gg][Ee])|([Jj][AaEeIiOo])))|([QqCcKk][Uu][Ll][Oo])|((([Ff][Ee])|([Jj][Oo])|([Pp][Uu]))[Tt][Oo])|([Rr][Uu][Ii][Nn])|([Gg][Uu][Ee][Yy])|((([Pp][Uu])|([Rr][Aa]))[Tt][Aa])|([Pp][Ee](([Dd][Oo])|([Dd][Aa])|([Nn][Ee])))|([Mm](([Aa][Mm][OoEe])|([Ee][Aa][SsRr])|([Ii][Oo][Nn])|([Uu][Ll][Aa])|([Ee][Oo][Nn])|([Oo][Cc][Oo])))))[A-Za-zñÑ&][aeiouAEIOUxX]?[A-Za-zñÑ&]{2}(((([02468][048])|([13579][26]))0229)|(\d{2})((02((0[1-9])|1\d|2[0-8]))|((((0[13456789])|1[012]))((0[1-9])|((1|2)\d)|30))|(((0[13578])|(1[02]))31)))[a-zA-Z1-9]{2}[\dAa])|([Xx][AaEe][Xx]{2}010101000))$/),
    curp: z.string().min(15).max(18)
        .regex(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/),
    tipoCliente: z.string(),
    grupo: z.string().optional(),
    activo: z.boolean(),
    correo: z.string().email().optional(),
    domicilio: DomicilioClienteSchema,
    contactos: z.array(ContactoClienteSchema)
})

export type ClienteSchemaType = z.infer<typeof ClienteSchema>