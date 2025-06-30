import { InformacionBasicaStep1 } from "./empresas/informacion-basica.step";
import { DetallesStep2 } from "./empresas/detalles.step";
import { ContactosStep3 } from "./empresas/contactos.step";
import { ConfiguracionesStep4 } from "./empresas/configuraciones.step";
import { z } from "zod";

export const EmpresaSchema
    = InformacionBasicaStep1
        .merge(DetallesStep2)
        .merge(ContactosStep3)
        .merge(ConfiguracionesStep4)

export type EmpresaSchemaType
    = z.infer<typeof EmpresaSchema>