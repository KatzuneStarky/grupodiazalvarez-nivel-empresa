"use client"

import { useReporteViajes } from "@/modules/logistica/reportes-viajes/hooks/use-reporte-viajes"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import ConsumoForm from "@/modules/logistica/consumo/components/consumo-form"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ConsumoSchemaType, consumoSchema } from "@/modules/logistica/consumo/schema/consumo.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import SubmitButton from "@/components/global/submit-button"

const NuevoConsumoPage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const { directLink } = useDirectLink("consumo/registros")
    const { reporteViajes } = useReporteViajes()
    const { operadores } = useOperadores()
    const { equipos } = useEquipos()
    const { userBdd } = useAuth()
    const router = useRouter()

    const form = useForm<ConsumoSchemaType>({
        resolver: zodResolver(consumoSchema),
        defaultValues: {
            costoLitro: 0,
            costoTotal: 0,
            fecha: new Date(),
            equipoId: "",
            operadorId: "",
            viajeId: "",
            kmFinal: 0,
            kmInicial: 0,
            kmRecorridos: 0,
            litrosCargados: 0,
            observaciones: "",
            rendimientoKmL: 0
        }
    })

    const onSubmit = async (data: ConsumoSchemaType) => {
        try {

        } catch (error) {
            toast.error("Error al generar el consumo")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                title={"Nuevo registro de consumo"}
                description={"Ingrese la información necesaria para generar el nuevo registro de consumo"}
                icon={<Icon iconName="picon:fuel" className="w-12 h-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <ConsumoForm
                isSubmiting={isSubmitting}
                operadores={operadores}
                viajes={reporteViajes}
                equipos={equipos}
                onSubmit={onSubmit}
                form={form}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmitting}
                        text="Crear nuevo consumo"
                        loadingText="Creando nuevo consumo..."
                    />
                }
            />
        </div>
    )
}

export default NuevoConsumoPage