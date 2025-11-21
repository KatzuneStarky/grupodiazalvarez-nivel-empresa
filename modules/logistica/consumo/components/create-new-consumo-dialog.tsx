"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import { useReporteViajes } from "../../reportes-viajes/hooks/use-reporte-viajes"
import { ConsumoSchemaType, consumoSchema } from "../schema/consumo.schema"
import { writeNotification } from "@/modules/notificaciones/actions/write"
import { useOperadores } from "../../bdd/operadores/hooks/use-estaciones"
import { useEquipos } from "../../bdd/equipos/hooks/use-equipos"
import SubmitButton from "@/components/global/submit-button"
import { useDirectLink } from "@/hooks/use-direct-link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/context/auth-context"
import { writeConsumo } from "../actions/write"
import { useForm } from "react-hook-form"
import ConsumoForm from "./consumo-form"
import { useState } from "react"
import { toast } from "sonner"

interface CreateNewConsumoDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    consumoDate: Date | null
}

const CreateNewConsumoDialog = ({
    open,
    setOpen,
    consumoDate
}: CreateNewConsumoDialogProps) => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const { directLink } = useDirectLink("consumo/registros")
    const { reporteViajes } = useReporteViajes()
    const { operadores } = useOperadores()
    const { equipos } = useEquipos()
    const { userBdd } = useAuth()

    const form = useForm<ConsumoSchemaType>({
        resolver: zodResolver(consumoSchema),
        defaultValues: {
            costoLitro: 0,
            costoTotal: 0,
            fecha: consumoDate ?? undefined,
            kmFinal: 0,
            kmInicial: 0,
            kmRecorridos: 0,
            litrosCargados: 0,
            observaciones: "",
            operadorId: "",
            rendimientoKmL: 0,
            viajeId: "",
            equipoId: "",
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
            window.location.reload()
        } catch (error) {
            toast.error("Error al generar el consumo")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Crear nuevo consumo
                    </DialogTitle>
                </DialogHeader>
                <ConsumoForm
                    form={form}
                    onSubmit={onSubmit}
                    equipos={equipos}
                    operadores={operadores}
                    viajes={reporteViajes}
                    isSubmiting={isSubmiting}
                    submitButton={
                        <SubmitButton
                            isSubmiting={isSubmiting}
                            text="Crear nuevo consumo"
                            loadingText="Creando nuevo consumo..."
                        />
                    }
                    isInDialog={true}
                    calendarDateConsumo={consumoDate}
                    openDialog={open}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewConsumoDialog