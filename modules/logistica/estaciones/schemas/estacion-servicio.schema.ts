import { z } from "zod";

export const TanqueCombustibleSchema = z.object({
    tipoCombustible: z.enum(["Magna", "Premium", "Diesel"]),
    capacidadTotal: z.coerce.number(),
    capacidadActual: z.coerce.number(),
    numeroTanque: z.string(),
    fechaUltimaRecarga: z.date()
})

export const EstacionDeServicioSchema = z.object({
    nombre: z.string(),
    razonSocial: z.string(),
    rfc: z.string().min(10).max(16)
        .regex(/^(((?!(([CcKk][Aa][CcKkGg][AaOo])|([Bb][Uu][Ee][YyIi])|([Kk][Oo](([Gg][Ee])|([Jj][Oo])))|([Cc][Oo](([Gg][Ee])|([Jj][AaEeIiOo])))|([QqCcKk][Uu][Ll][Oo])|((([Ff][Ee])|([Jj][Oo])|([Pp][Uu]))[Tt][Oo])|([Rr][Uu][Ii][Nn])|([Gg][Uu][Ee][Yy])|((([Pp][Uu])|([Rr][Aa]))[Tt][Aa])|([Pp][Ee](([Dd][Oo])|([Dd][Aa])|([Nn][Ee])))|([Mm](([Aa][Mm][OoEe])|([Ee][Aa][SsRr])|([Ii][Oo][Nn])|([Uu][Ll][Aa])|([Ee][Oo][Nn])|([Oo][Cc][Oo])))))[A-Za-zñÑ&][aeiouAEIOUxX]?[A-Za-zñÑ&]{2}(((([02468][048])|([13579][26]))0229)|(\d{2})((02((0[1-9])|1\d|2[0-8]))|((((0[13456789])|1[012]))((0[1-9])|((1|2)\d)|30))|(((0[13578])|(1[02]))31)))[a-zA-Z1-9]{2}[\dAa])|([Xx][AaEe][Xx]{2}010101000))$/),
    direccion: z.object({
        calle: z.string(),
        numeroExterior: z.string(),
        numeroInterior: z.string().optional(),
        colonia: z.string(),
        ciudad: z.string(),
        estado: z.string(),
        codigoPostal: z.string(),
        pais: z.string(),
    }),
    ubicacion: z.object({
        lat: z.string(),
        lng: z.string()
    }),
    contacto: z.object({
        telefono: z.string().min(10).max(16),
        email: z.string().email(),
        responsable: z.string(),
    }),
    numeroPermisoCRE: z.string(),
    horarios: z.string(),
    productos: z.array(z.string()),
    tanques: z.array(TanqueCombustibleSchema),
    activo: z.boolean(),
    fechaRegistro: z.date(),
})

export type EstacionDeServicioType = z.infer<typeof EstacionDeServicioSchema>