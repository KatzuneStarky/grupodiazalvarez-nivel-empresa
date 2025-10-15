"use client"

import { ClienteSchema, ClienteSchemaType } from "@/modules/logistica/clientes/schemas/client.schema"
import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import ClienteForm from "@/modules/logistica/clientes/components/clientes-form"
import { sendNotificationEmail } from "@/functions/send-notification-email"
import { writeNotification } from "@/modules/notificaciones/actions/write"
import { Clientes } from "@/modules/logistica/bdd/clientes/types/clientes"
import { WriteCliente } from "@/modules/logistica/clientes/actions/write"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const NuevoClientePage = () => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const { userBdd } = useAuth()
    const router = useRouter()

    const form = useForm<ClienteSchemaType>({
        resolver: zodResolver(ClienteSchema),
        defaultValues: {
            activo: true,
            contactos: [],
            curp: "",
            domicilio: {
                calle: "",
                celular: "",
                colonia: "",
                cp: "",
                estado: "",
                exterior: "",
                interior: "",
                localidad: "",
                municipio: "",
                pais: "",
                telefono: ""
            },
            correo: "",
            grupo: "",
            nombreCorto: "",
            nombreFiscal: "",
            rfc: "",
            tipoCliente: "nacional"
        }
    })

    const onSubmit = async (data: ClienteSchemaType) => {
        try {
            setIsSubmiting(true)

            const clientePromise = WriteCliente({
                activo: data.activo,
                contactos: data.contactos,
                curp: data.curp,
                domicilio: data.domicilio,
                nombreFiscal: data.nombreFiscal,
                rfc: data.rfc,
                tipoCliente: "nacional",
                correo: data.correo,
                grupo: data.grupo,
                nombreCorto: data.nombreCorto,
            })

            toast.promise(clientePromise, {
                loading: "Creando registro de cliente, favor de esperar...",
                success: (res) => res.message,
                error: (err) => err.message,
            });

            await writeNotification({
                title: "Nuevo cliente generado",
                message: `Se generó un nuevo registro de cliente con el nombre ${data.nombreFiscal}`,
                readBy: [],
                type: NotificationType.Cliente,
                createdBy: userBdd?.nombre ?? "Sistema",
                priority: "low",
                dialogData: JSON.stringify(data, null, 2)
            });

            {/**
                await sendNotificationEmail({
                to: `${userBdd?.email}`,
                createdAt: new Date(),
                createdBy: `${userBdd?.nombre}`,
                title: "Nuevo cliente generado",
                description: `Se genero un nuevo registro de cliente con el nombre ${data.nombreFiscal}`,
                type: NotificationType.Cliente,
                priority: "low",
                subject: "Nuevo cliente generado",
                systemGenerated: false,
                jsonData: JSON.stringify(data, null, 2)
            }) */}

            form.reset()
            router.back()
        } catch (error) {
            console.log(error);
            toast.error("Error al crear el cliente", {
                description: `${error}`
            })
            setIsSubmiting(false)
        } finally {
            setIsSubmiting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                description="Ingrese la información necesaria para generar el nuevo registro de un nuevo cliente."
                title="Nuevo registro de cliente"
                icon={<User className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <ClienteForm
                isSubmiting={isSubmiting}
                onSubmit={onSubmit}
                form={form}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmiting}
                        loadingText="Guardando cliente..."
                        text="Guardar cliente"
                    />
                }
            />
        </div >
    )
}

export default NuevoClientePage