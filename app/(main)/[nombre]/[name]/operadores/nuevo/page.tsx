"use client"

import { OperadoresSchema, OperadoresSchemaType } from "@/modules/logistica/operadores/schemas/operadores.schema"
import OperadorForm from "@/modules/logistica/operadores/components/operador-form"
import { writeOperador } from "@/modules/logistica/operadores/actions/write"
import SubmitButton from "@/components/global/submit-button"
import PageTitle from "@/components/custom/page-title"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Save, User } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import { toast } from "sonner"

const NuevoOperadorPage = () => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [useCamera, setUseCamera] = useState(false)
    const router = useRouter()
    const uid = uuidv4()

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
            tipoSangre: "",
            contactosEmergencia: []
        }
    })

    const onSubmit = async (values: OperadoresSchemaType) => {
        try {
            setIsSubmiting(true)

            toast.promise(writeOperador(values), {
                loading: "Creando registro de operador, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el operador.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al guardar el operador")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <PageTitle
                title={`Crear registro de operador`}
                description={`Genere un nuevo registro con los datos solicitados sobre el nuevo operador`}
                icon={<User className="h-12 w-12 text-primary" />}
            />
            <Separator className="mt-4" />
            <OperadorForm
                form={form}
                handleImageUpload={handleImageUpload}
                showFileInfo={showFileInfo}
                isSubmiting={isSubmiting}
                useCamera={useCamera}
                imageUrl={imageUrl}
                onSubmit={onSubmit}
                photoUid={uid}
                submitButton={
                    <SubmitButton
                        isSubmiting={isSubmiting}
                        loadingText="Creando operador..."
                        text="Crear nuevo operador"
                    />
                }
            />
        </div>
    )
}

export default NuevoOperadorPage