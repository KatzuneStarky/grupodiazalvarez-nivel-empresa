"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AreaSchema, AreaSchemaType } from "../schemas/area.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateArea } from "../actions/write"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { AreaInput } from "@/types/area"
import { toast } from "sonner"

const EditAreaModal = ({
    empresaId,
    area,
    children
}: {
    empresaId: string,
    area: AreaInput,
    children: React.ReactNode
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const form = useForm<AreaSchemaType>({
        resolver: zodResolver(AreaSchema),
        defaultValues: {
            correoContacto: area.correoContacto,
            descripcion: area.descripcion,
            empresaId: empresaId,
            nombre: area.nombre,
            responsableId: ""
        }
    })

    const fetchData = () => {
        form.setValue("correoContacto", area.correoContacto || "")
        form.setValue("descripcion", area.descripcion)
        form.setValue("empresaId", empresaId)
        form.setValue("nombre", area.nombre)
        form.setValue("responsableId", "")
    }

    useEffect(() => {
        fetchData()
    }, [area])

    const onSubmit = async (data: AreaSchemaType) => {
        try {
            setIsLoading(true)

            console.log(data);

            toast.promise(
                updateArea(empresaId, data), {
                loading: "Actualizando el area, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return `Area actualizada satisfactoriamente.`;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al actualizar el area.";
                },
            })

            form.reset()
            router.refresh()
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el area", {
                description: `${error}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Editar area
                    </DialogTitle>
                    <DialogDescription className="flex">
                        Actualizar la informacion del area {area.nombre}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 cursor-not-allowed">
                                            <FormLabel className="text-sm font-medium">
                                                Nombre del area
                                                <span className="text-destructive ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="correoContacto"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 cursor-not-allowed">
                                            <FormLabel className="text-sm font-medium">
                                                Correo de contacto
                                                <span className="text-destructive ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. ejemplo@correo.com"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="descripcion"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 cursor-not-allowed">
                                        <FormLabel className="text-sm font-medium">
                                            Descripcion del area
                                            <span className="text-destructive ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-[120px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-end w-full">
                            <Button type="submit">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Actualizar Area
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditAreaModal