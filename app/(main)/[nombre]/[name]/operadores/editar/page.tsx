"use client"

import { OperadoresSchema, OperadoresSchemaType } from "@/modules/logistica/operadores/schemas/operadores.schema"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import OperadorForm from "@/modules/logistica/operadores/components/operador-form"
import { updateOperador } from "@/modules/logistica/operadores/actions/write"
import { useRouter, useSearchParams } from "next/navigation"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { User } from "lucide-react"
import { toast } from "sonner"

const EditarOperadorPage = () => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [useCamera, setUseCamera] = useState(false)
    const searchParams = useSearchParams()
    const { operadores } = useOperadores()
    const router = useRouter()
    const uid = uuidv4()

    const operadorId = searchParams.get("operadorId")
    const operador = operadores?.find((operador) => operador.id === operadorId)

    const form = useForm<OperadoresSchemaType>({
        resolver: zodResolver(OperadoresSchema),
        defaultValues: {
            apellidos: "",
            calle: "",
            colonia: "",
            cp: 0,
            email: "",
            curp: "",
            emisor: "",
            externo: 0,
            idEquipo: "",
            image: "",
            ine: "",
            nombres: "",
            nss: "",
            numLicencia: "",
            telefono: "",
            tipoLicencia: "",
            tipoSangre: ""
        }
    })

    const onSubmit = async (values: OperadoresSchemaType) => {
        try {
            setIsSubmiting(true)

            toast.promise(updateOperador(values, operador?.id || ""), {
                loading: "Actualizando registro de operador, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al actualizar al operador.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al actualizar el operador")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    useEffect(() => {
        if (!operador) return

        const currentValues = form.getValues();
        if (!currentValues.nombres && !currentValues.apellidos) {
            form.setValue("nombres", operador.nombres)
            form.setValue("apellidos", operador.apellidos)
            form.setValue("telefono", operador.telefono)
            form.setValue("email", operador.email)
            form.setValue("nss", operador.nss)
            form.setValue("curp", operador.curp)
            form.setValue("ine", operador.ine)
            form.setValue("colonia", operador.colonia)
            form.setValue("calle", operador.calle)
            form.setValue("externo", operador.externo)
            form.setValue("cp", operador.cp)
            form.setValue("tipoSangre", operador.tipoSangre)
            form.setValue("numLicencia", operador.numLicencia)
            form.setValue("tipoLicencia", operador.tipoLicencia)
            form.setValue("emisor", operador.emisor)
            form.setValue("idEquipo", operador.idEquipo)
            form.setValue("image", operador.image)
            form.setValue("contactosEmergencia", operador.contactosEmergencia || [])
        }
    }, [form, operador])

    return (
        <div className="container mx-auto py-8 px-4">
            <PageTitle
                title={`Editar operador (${operador?.nombres})`}
                description={`Actualice la informacion necesaria del operador actual (${operador?.nombres} ${operador?.apellidos})`}
                icon={<User className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <OperadorForm 
                form={form}
                handleImageUpload={handleImageUpload}
                showFileInfo={showFileInfo}
                operadorId={operador?.id}
                isSubmiting={isSubmiting}
                useCamera={useCamera}
                imageUrl={imageUrl}
                onSubmit={onSubmit}
                photoUid={uid}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmiting}
                        loadingText="Actualizando operador..."
                        text="Actualizar operador"
                    />
                }
            />
        </div>
    )
}

export default EditarOperadorPage