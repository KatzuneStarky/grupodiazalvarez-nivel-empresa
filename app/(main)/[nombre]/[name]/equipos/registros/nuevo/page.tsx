"use client"

import { EquiposSchema, EquiposSchemaType } from "@/modules/logistica/equipos/schemas/equipo.schema"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import EquipoForm from "@/modules/logistica/equipos/components/equipo-form"
import { writeNotification } from "@/modules/notificaciones/actions/write"
import { writeEquipo } from "@/modules/logistica/equipos/actions/write"
import SubmitButton from "@/components/global/submit-button"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Truck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const NuevoEquipoPage = () => {
    const [equipoId, setEquipoId] = useState<string | undefined>(undefined)
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const { directLink } = useDirectLink("equipos")
    const { userBdd } = useAuth()
    const router = useRouter()

    const form = useForm<EquiposSchemaType>({
        resolver: zodResolver(EquiposSchema),
        defaultValues: {
            activo: true,
            estado: EstadoEquipos.DISPONIBLE,
            gpsActivo: false,
            idOperador: "",
            m3: 0,
            marca: "",
            modelo: "",
            numEconomico: "",
            permisoSCT: {
                numero: "",
                tipo: "",
                vigenciaHasta: new Date()
            },
            placas: "",
            rendimientoPromedioKmPorLitro: 0,
            seguro: {
                aseguradora: "",
                numeroPoliza: "",
                tipoCobertura: "",
                vigenciaHasta: new Date()
            },
            serie: "",
            tipoTanque: "",
            tipoUnidad: "",
            ultimaUbicacion: {
                direccionAproximada: "",
                fecha: new Date(),
                latitud: 0,
                longitud: 0
            },
            ultimoConsumo: {
                fecha: new Date(),
                litros: 0,
                odometro: 0
            },
            year: 0
        }
    })

    const onSubmit = async (data: EquiposSchemaType) => {
        try {
            setIsSubmiting(true)

            const resultData = writeEquipo(data)

            toast.promise(resultData, {
                loading: "Creando registro de equipo, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        setEquipoId(result.id);
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el equipo.";
                },
            })

            await writeNotification({
                title: "Nuevo equipo generado",
                message: `Se generó un nuevo registro de equipo con numero economico ${data.numEconomico}`,
                readBy: [],
                type: NotificationType.Equipo,
                createdBy: userBdd?.nombre ?? "Sistema",
                priority: "medium",
                dialogData: JSON.stringify(data, null, 2),
                actionUrl: `${directLink}/${(await resultData).id}`
            });

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al guardar el equipo")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description={"Ingrese la información necesaria para generar el nuevo registro de un nuevo equipo"}
                title={"Nuevo registro de equipo"}
                icon={<Truck className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <EquipoForm
                form={form}
                isSubmiting={isSubmitting}
                onSubmit={onSubmit}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmitting}
                        text="Crear nuevo equipo"
                        loadingText="Creando nuevo equipo..."
                    />
                }
            />
        </div>
    )
}

export default NuevoEquipoPage