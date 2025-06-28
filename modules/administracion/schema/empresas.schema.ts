import { EstadoEmpresa } from "../enum/estado-empresa";
import { TipoEmpresa } from "../enum/tipo-empresa";
import { z } from "zod";

export const EmpresasSchema = z.object({
    nombre: z.string().min(3, {
        message: "El nombre debe tener al menos 3 caracteres"
    }),
    rfc: z.string().min(12, {
        message: "El RFC debe tener al menos 12 caracteres"
    }),
    direccion: z.string().min(10, {
        message: "La dirección debe tener al menos 10 caracteres"
    }),
    email: z.string().email({
        message: "El email debe ser válido"
    }),
    telefono: z.string().min(10, {
        message: "El teléfono debe tener al menos 10 caracteres"
    }),
    estado: z.nativeEnum(EstadoEmpresa),
    logoUrl: z.string().optional(),
    razonSocial: z.string().optional(),
    tipo: z.nativeEnum(TipoEmpresa).optional(),
    empresaPadre: z.string().optional()
})