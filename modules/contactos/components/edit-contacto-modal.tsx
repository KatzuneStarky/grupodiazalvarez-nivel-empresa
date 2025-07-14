"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactInfo, ContactInfoSchema } from "@/modules/empresas/schema/empresas/contactos.step"
import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas"
import { ContactInfoInput } from "@/modules/empresas/types/contactos"
import { CheckCircle2, Edit, Star } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateContacto } from "../actions/write"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface EditContactModalProps {
    contacto: ContactInfoInput,
    empresaId: string,
    children: React.ReactNode
}

const EditContactModal = ({
    contacto,
    empresaId,
    children
}: EditContactModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { empresas } = useAllEmpreas()
    const router = useRouter()

    const form = useForm<ContactInfo>({
        mode: "onChange",
        resolver: zodResolver(ContactInfoSchema),
        defaultValues: {
            cargo: "",
            email: "",
            nombre: "",
            principal: false,
            telefono: "",
            empresaId: empresaId ? empresaId : "",
        }
    })

    const fetchData = () => {
        form.setValue("principal", contacto.principal)
        form.setValue("telefono", contacto.telefono)
        form.setValue("nombre", contacto.nombre)
        form.setValue("cargo", contacto.cargo)
        form.setValue("email", contacto.email)
        form.setValue("empresaId", empresaId)
    }

    useEffect(() => {
        fetchData()
    }, [contacto, empresaId])

    const onSubmit = async (data: ContactInfo) => {
        try {
            setIsLoading(true)

            toast.promise(
                updateContacto(empresaId, data), {
                loading: "Actualizando el contacto, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return `Contacto actualizado satisfactoriamente.`;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el contacto.";
                },
            }
            )

            form.reset()
            router.refresh()
        } catch (error) {

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
                        Editar contacto
                    </DialogTitle>
                    <DialogDescription className="flex">
                        Actualizar la informacion del contacto {contacto.nombre}
                        {contacto.principal ? <Star className="w-3 h-3 ml-1 text-yellow-400 fill-yellow-300" /> : null}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="nombre"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                <FormLabel className="text-sm font-medium">
                                                    Nombre del contacto
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
                                        name="cargo"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                <FormLabel className="text-sm font-medium">
                                                    Cargo
                                                    <span className="text-destructive ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ej. Administrador"
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                <FormLabel className="text-sm font-medium">
                                                    Email del contacto
                                                    <span className="text-destructive ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ejemplo@correo.com"
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
                                        name="telefono"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2 cursor-not-allowed">
                                                <FormLabel className="text-sm font-medium">
                                                    Telefono
                                                    <span className="text-destructive ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="6121234567"
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
                                                            <SelectValue />
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

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="principal"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Es principal?</FormLabel>
                                                <FormDescription>
                                                    Indica si el contacto es el principal de la empresa
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
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
                                            Actualizar Contacto
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditContactModal