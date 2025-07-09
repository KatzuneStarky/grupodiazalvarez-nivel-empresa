"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AreaSchema, AreaSchemaType } from "@/modules/areas/schemas/area.schema"
import { useEmpresaById } from "@/modules/empresas/hooks/use-empresa-by-id"
import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { writeArea } from "@/modules/areas/actions/write"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

const NuevaAreaPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const searchParams = useSearchParams()
    const empresaId = searchParams.get("empresaId")
    const router = useRouter()

    const { empresas } = useAllEmpreas()
    const { empresa } = useEmpresaById(empresaId || "")

    const form = useForm<AreaSchemaType>({
        resolver: zodResolver(AreaSchema),
        defaultValues: {
            empresaId: empresaId || "" || empresa?.id || "",
            correoContacto: "",
            descripcion: "",
            nombre: "",
            responsableId: ""
        }
    })

    const onSubmit = async (data: AreaSchemaType) => {
        try {
            setIsLoading(true)

            toast.promise(
                writeArea(empresaId ? empresaId : data.empresaId, data),
                {
                    loading: "Creando nueva area, favor de esperar...",
                    success: (result) => {
                        if (result.success) {
                            return `Area registrada para la empresa ${empresa?.nombre}.`;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => {
                        return error.message || "Error al registrar la empresa.";
                    },
                })

            console.log(data);

            form.reset()
            router.push("/administracion/areas")
        } catch (error) {
            console.log(error);
            toast.error("Error al registrar el area", {
                description: `${error}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-[85vh] flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl w-full">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                        placeholder="Ej. Logistica"
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
                                                        placeholder="logistica@empresa.com"
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    {!empresaId ? (
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="empresaId"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col space-y-2 cursor-not-allowed w-full">
                                                        <FormLabel className="text-sm font-medium mb-1">
                                                            Relacion con la empresa:
                                                            <span className="text-destructive ml-1">*</span>
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Seleccione una empresa" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {empresas.map((empresa) => (
                                                                    <SelectItem key={empresa.id} value={empresa.id}>
                                                                        {empresa.nombre}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
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
                                                    placeholder="Describa detalladamente como funciona el area a generar"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Guardar Area
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

export default NuevaAreaPage