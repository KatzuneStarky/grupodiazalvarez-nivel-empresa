"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MecanicoSchema, MecanicoSchemaType } from "../schemas/mecanico.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import MechanicForm from "./mechanic-form"
import SubmitButton from "@/components/global/submit-button"

interface NewMechanicDialogProps {
    open: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const NewMechanicDialog = ({ open, setOpenDialog }: NewMechanicDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const form = useForm<MecanicoSchemaType>({
        resolver: zodResolver(MecanicoSchema),
        defaultValues: {
            nombre: "",
            apellido: "",
            telefono: "",
            email: "",
            activo: true,
            estado: "DISPONIBLE"
        }
    })

    const onSubmit = (data: MecanicoSchemaType) => {
        try {
            setIsSubmitting(true)

        } catch (error) {
            console.log(error)
            toast.error("Error al crear el mecanico")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Nuevo registro de mecanico</DialogTitle>
                </DialogHeader>

                <MechanicForm
                    form={form}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    submitButton={
                        <SubmitButton
                            isSubmiting={isSubmitting}
                            text="Guardar"
                            loadingText="Guardando..."
                        />
                    }
                />
            </DialogContent>
        </Dialog>
    )
}

export default NewMechanicDialog