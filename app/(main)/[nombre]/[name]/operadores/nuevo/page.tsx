"use client"

import { OperadoresSchema, OperadoresSchemaType } from "@/modules/logistica/operadores/schemas/operadores.schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TipoLicencia } from "@/modules/logistica/operadores/constants/tipo-licencia"
import { TipoSangre } from "@/modules/logistica/operadores/constants/tipo-sangre"
import { writeOperador } from "@/modules/logistica/operadores/actions/write"
import { Emisor } from "@/modules/logistica/operadores/constants/emisor"
import UploadImage from "@/components/custom/upload-image-firebase"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const NuevoOperadorPage = () => {
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [operadorId, setOperadorId] = useState<string>()
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
            tipoSangre: ""
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

    const nombres = form.watch("nombres")
    const apellidos = form.watch("apellidos")
    const nombreCompleto = `${nombres} ${apellidos}`

    return (
        <div className="container mx-auto py-8 px-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Nuevo Operador</h1>
                    <Separator />
                    <h3 className="text-xl text-muted-foreground mt-4">Datos personales</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6">
                            <UploadImage
                                path={`/empleados/${nombreCompleto.replace(/\s+/g, "")}`}
                                id={operadorId || uid}
                                image={imageUrl}
                                onImageUpload={handleImageUpload}
                                uploadText="Subir imagen"
                                uploadSubtext="JPG, PNG or WebP (max 5MB)"
                                maxFileSize={5 * 1024 * 1024}
                                showFileName={true}
                                showFileInfo={showFileInfo}
                                useCamera={useCamera}
                                showFileTypeIcon={true}
                            />

                            {imageUrl && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium dark:text-gray-800">Url de la imagen en base de datos:</p>
                                    <p className="text-xs text-gray-700 break-all mt-1">{imageUrl}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="grid grid-rows-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="nombres"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium">Nombre(s)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre(s)..." className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="apellidos"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium">Apellido(s)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apellido(s)..." className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 mt-4 w-full">
                        <div>
                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 w-full">
                                        <FormLabel className="text-sm font-medium">Teléfono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="(612) 123-4567" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" className="h-10" {...field} />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="nss"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">NSS</FormLabel>
                                        <FormControl>
                                            <Input placeholder="012345678901" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="curp"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">CURP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABCDEFGH1234567890" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="ine"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">INE</FormLabel>
                                        <FormControl>
                                            <Input placeholder="012345678901234567" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="place-self-end justify-self-start">
                            <FormField
                                control={form.control}
                                name="tipoSangre"
                                render={({ field }) => (
                                    <FormItem className="w-fit">
                                        <FormLabel>Tipo de sangre</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione tipo de sangre" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TipoSangre.map((item, index) => (
                                                    <SelectItem value={item.name} key={item.id}>
                                                        <div className='flex items-center'>
                                                            {item.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator className="mt-4" />
                    <h3 className="text-xl text-muted-foreground mt-4">Informacion de domicilio</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6 gap-8 w-full mt-4">
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="calle"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 w-full">
                                        <FormLabel className="text-sm font-medium">Calle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Calle..." className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="colonia"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 w-full">
                                        <FormLabel className="text-sm font-medium">Colonia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Colonia..." className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="externo"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 w-full">
                                        <FormLabel className="text-sm font-medium">Numero externo</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="123" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="cp"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 w-full">
                                        <FormLabel className="text-sm font-medium">Codigo postal</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345" type="number" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator className="mt-4" />
                    <h3 className="text-xl text-muted-foreground mt-4">Informacion de licencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8 w-full mt-4">
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="numLicencia"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 w-full">
                                        <FormLabel className="text-sm font-medium">Numero de licencia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567890" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="place-self-end justify-self-start">
                            <FormField
                                control={form.control}
                                name="tipoLicencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de licencia</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione tipo licencia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TipoLicencia.map((item, index) => (
                                                    <SelectItem value={item.name} key={item.id}>
                                                        <div className='flex items-center'>
                                                            {item.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="place-self-end justify-self-start">
                            <FormField
                                control={form.control}
                                name="emisor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Emisor</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un emisor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Emisor.map((item, index) => (
                                                    <SelectItem value={item.name} key={item.id}>
                                                        <div className='flex items-center'>
                                                            {item.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator className="mt-4" />
                    <div className="gap-4 pt-6">
                        <Button
                            type="submit"
                            className="h-12 text-base font-medium"
                            disabled={isSubmiting}
                        >
                            <Save />
                            {isSubmiting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Registrando operador...
                                </div>
                            ) : (
                                "Registrar nuevo operador"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevoOperadorPage