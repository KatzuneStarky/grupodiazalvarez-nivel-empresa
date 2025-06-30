import { z } from "zod";

export const ContactInfoSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    cargo: z.string().min(1, "El cargo es obligatorio"),
    email: z.string().email("Correo inválido"),
    telefono: z.string().min(7, "Teléfono inválido"),
    principal: z.boolean(),
});


export const ContactosStep3 = z.object({
    contactos: z.array(ContactInfoSchema),
})

export type ContactInfo
    = z.infer<typeof ContactInfoSchema>;
export type ContactosStep3Type
    = z.infer<typeof ContactosStep3>