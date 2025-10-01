"use client"

import { ClienteSchema, ClienteSchemaType } from "@/modules/logistica/clientes/schemas/client.schema"
import { useClientes } from "@/modules/logistica/bdd/clientes/hooks/use-clientes"
import ClienteForm from "@/modules/logistica/clientes/components/clientes-form"
import { UpdateCliente } from "@/modules/logistica/clientes/actions/write"
import { useRouter, useSearchParams } from "next/navigation"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { User } from "lucide-react"
import { toast } from "sonner"

const EditarClientePage = () => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const { clientes } = useClientes()
    const router = useRouter()

    const clientId = searchParams.get("clienteId")
    const cliente = clientes?.find((cliente) => cliente.id === clientId)

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

            toast.promise(UpdateCliente({
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
            }, clientId || ""), {
                loading: "Actualizando cliente, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al actualizar el cliente.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el cliente", {
                description: `${error}`
            })
            setIsSubmiting(false)
        } finally {
            setIsSubmiting(false)
        }
    }

    useEffect(() => {
        if (!cliente) return;

        const currentValues = form.getValues();
        if (!currentValues.nombreFiscal && !currentValues.nombreCorto) {
            form.reset({
                nombreFiscal: cliente.nombreFiscal,
                nombreCorto: cliente.nombreCorto,
                contactos: cliente.contactos,
                domicilio: cliente.domicilio,
                correo: cliente.correo,
                activo: cliente.activo,
                grupo: cliente.grupo,
                curp: cliente.curp,
                rfc: cliente.rfc,
                tipoCliente: cliente.tipoCliente || "nacional",
            });
        }
    }, [cliente, form]);

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                title={`Editar cliente (${cliente?.nombreCorto})`}
                description={`Actualice la informacion necesaria del cliente actual (${cliente?.nombreFiscal})`}
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
                        loadingText="Actualizando cliente..."
                        text="Actualizar cliente"
                    />
                }
            />
        </div>
    )
}

export default EditarClientePage