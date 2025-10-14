"use client"

import { EstacionDeServicioSchema, EstacionDeServicioType } from "@/modules/logistica/estaciones/schemas/estacion-servicio.schema"
import EstacionesForm from "@/modules/logistica/estaciones/components/estaciones-form"
import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion"
import { writeEstacion } from "@/modules/logistica/estaciones/actions/write"
import { sendNotificationEmail } from "@/functions/send-notification-email"
import { writeNotification } from "@/modules/notificaciones/actions/write"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconGasStation } from "@tabler/icons-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

const NuevaEstacionPage = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [data, setData] = useState<EstacionServicio>()
    const { userBdd } = useAuth()
    const router = useRouter()

    const form = useForm<EstacionDeServicioType>({
        resolver: zodResolver(EstacionDeServicioSchema),
        defaultValues: {
            activo: true,
            contacto: [{
                email: "",
                responsable: "",
                telefono: ""
            }],
            direccion: {
                calle: "",
                colonia: "",
                estado: "",
                pais: "",
                ciudad: "",
                codigoPostal: "",
                numeroExterior: "",
                numeroInterior: ""
            },
            fechaRegistro: new Date(),
            horarios: "",
            nombre: "",
            numeroPermisoCRE: "",
            productos: [],
            razonSocial: "",
            rfc: "",
            tanques: [],
            ubicacion: {
                lat: 0,
                lng: 0
            }
        }
    })

    const onSubmit = async (data: EstacionDeServicioType) => {
        try {
            setIsSubmitting(true)
            toast.promise(writeEstacion({
                activo: data.activo,
                contacto: data.contacto.map(contacto => ({
                    email: contacto.email,
                    responsable: contacto.responsable,
                    telefono: contacto.telefono,
                    cargo: contacto.cargo
                })),
                direccion: {
                    calle: data.direccion.calle,
                    colonia: data.direccion.colonia,
                    estado: data.direccion.estado,
                    pais: data.direccion.pais,
                    ciudad: data.direccion.ciudad,
                    codigoPostal: data.direccion.codigoPostal,
                    numeroExterior: data.direccion.numeroExterior,
                    numeroInterior: data.direccion.numeroInterior || "",
                },
                fechaRegistro: data.fechaRegistro,
                nombre: data.nombre,
                tanques: data.tanques.map(tanque => ({
                    capacidadActual: tanque.capacidadActual,
                    capacidadTotal: tanque.capacidadTotal,
                    tipoCombustible: tanque.tipoCombustible,
                    fechaUltimaRecarga: tanque.fechaUltimaRecarga,
                    numeroTanque: tanque.numeroTanque
                })),
                horarios: data.horarios,
                numeroPermisoCRE: data.numeroPermisoCRE,
                productos: data.tanques.map((tanque) => tanque.tipoCombustible),
                razonSocial: data.razonSocial,
                rfc: data.rfc,
                ubicacion: {
                    lat: data.ubicacion?.lat || 0,
                    lng: data.ubicacion?.lng || 0
                }
            }), {
                loading: "Creando registro de estacion de servicio, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        setData(result.data)
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar la estacion de servicio.";
                },
                finally: () => {
                    setIsSubmitting(false)
                }
            })

            await writeNotification({
                title: "Nueva estacion generada",
                message: `Se genero un nuevo registro de estacion con el nombre ${data.razonSocial}`,
                readBy: [],
                type: NotificationType.Estacion,
                createdBy: `${userBdd?.uidFirebase || ""}`,
                priority: "low",                
            })

            await sendNotificationEmail({
                to: `${userBdd?.email}`,
                createdAt: new Date(),
                createdBy: `${userBdd?.nombre}`,
                title: "Nueva estacion generada",
                description: `Se genero un nuevo registro de estacion con el nombre ${data.razonSocial}`,
                type: NotificationType.Estacion,
                priority: "low",
                subject: "Nuevo registro de estacion",
                systemGenerated: false,
                jsonData: JSON.stringify(data)
            })

            form.reset()
            router.back()
        } catch (error) {
            console.log(error)
            toast.error("Error al guardar la estación")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description="Ingrese la información necesaria para generar el nuevo registro de una nueva estación."
                title="Nuevo registro de estación"
                icon={<IconGasStation className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <EstacionesForm
                form={form}
                isSubmiting={isSubmitting}
                onSubmit={onSubmit}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmitting}
                        text="Crear nueva estacion"
                        loadingText="Creando nueva estacion..."
                    />
                }
            />
        </div>
    )
}

export default NuevaEstacionPage