import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa";
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa";
import { AreaSchema } from "@/modules/areas/schemas/area.schema";
import { z } from "zod";

export const DetallesStep2 = z.object({
    logoUrl: z.string().optional(),
    industria: z.string().optional(),
    numeroEmpleados: z.string().optional(),
    tipoEmpresa: z.nativeEnum(TipoEmpresa),
    descripcion: z.string().optional(),
    estado: z.nativeEnum(EstadoEmpresa),
    fechaCreacion: z.date(),
    areas: z.array(AreaSchema)
})

export type DetallesStep2Type
    = z.infer<typeof DetallesStep2>