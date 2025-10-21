"use client"

import { ConsumoSchemaType, consumoSchema } from "@/modules/logistica/consumo/schema/consumo.schema"
import { useReporteViajes } from "@/modules/logistica/reportes-viajes/hooks/use-reporte-viajes"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import ConsumoForm from "@/modules/logistica/consumo/components/consumo-form"
import { writeNotification } from "@/modules/notificaciones/actions/write"
import { writeConsumo } from "@/modules/logistica/consumo/actions/write"
import SubmitButton from "@/components/global/submit-button"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

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
            setIsSubmiting(true)
            const resultData = writeConsumo(data)

            toast.promise(resultData, {
                loading: "Creando registro de consumo, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el consumo.";
                },
            })

            await writeNotification({
                title: "Nuevo consumo generado",
                message: `Se generó un nuevo registro de consumo`,
                readBy: [],
                type: NotificationType.Consumo,
                createdBy: userBdd?.nombre,
                priority: "medium",
                dialogData: JSON.stringify(data, null, 2),
                actionUrl: `${directLink}?consumoId=${(await resultData).data?.id}`,
                systemGenerated: userBdd ? false : true
            });

            form.reset()
            router.back()
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