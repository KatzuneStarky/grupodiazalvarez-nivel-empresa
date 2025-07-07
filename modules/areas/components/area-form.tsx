"use client"

import { AreaSchema, AreaSchemaType } from "../schemas/area.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"

const AreaForm = ({
    empresaId
}: {
    empresaId: string
}) => {
    const form = useForm<AreaSchemaType>({
        resolver: zodResolver(AreaSchema),
        defaultValues: {
            correoContacto: "",
            descripcion: "",
            empresaId,
            nombre: "",
            responsableId: ""
        }
    })

    const onSubmit = async(data: AreaSchemaType) => {

    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={() => form.handleSubmit(onSubmit)}>

                </form>
            </Form>
        </div>
    )
}

export default AreaForm