"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EquiposSchema, EquiposSchemaType } from "@/modules/logistica/equipos/schemas/equipo.schema"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { tipoUnidad } from "@/modules/logistica/equipos/constants/tipo-unidad"
import { tipoTanque } from "@/modules/logistica/equipos/constants/tipo-tanque"
import { writeEquipo } from "@/modules/logistica/equipos/actions/write"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import UploadImage from "@/components/custom/upload-image-firebase"
import { Check, ChevronsUpDown, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"

const NuevoEquipoPage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const [showFileInfo, setShowFileInfo] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [equipoId, setEquipoId] = useState<string>()
    const [useCamera, setUseCamera] = useState(false)
    const { operadores } = useOperadores()
    const router = useRouter()
    const uid = uuidv4()

    const form = useForm<EquiposSchemaType>({
        resolver: zodResolver(EquiposSchema),
        defaultValues: {
            activo: true,
            estado: EstadoEquipos.DISPONIBLE,
            gpsActivo: false,
            idOperador: "",
            m3: 0,
            marca: "",
            modelo: "",
            numEconomico: "",
            permisoSCT: {
                numero: "",
                tipo: "",
                vigenciaHasta: new Date()
            },
            placas: "",
            rendimientoPromedioKmPorLitro: 0,
            seguro: {
                aseguradora: "",
                numeroPoliza: "",
                tipoCobertura: "",
                vigenciaHasta: new Date()
            },
            serie: "",
            tipoTanque: "",
            tipoUnidad: "",
            ultimaUbicacion: {
                direccionAproximada: "",
                fecha: new Date(),
                latitud: 0,
                longitud: 0
            },
            ultimoConsumo: {
                fecha: new Date(),
                litros: 0,
                odometro: 0
            },
            year: 0
        }
    })

    const onSubmit = async (data: EquiposSchemaType) => {
        try {
            setIsSubmiting(true)

            toast.promise(writeEquipo(data), {
                loading: "Creando registro de equipo, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el equipo.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al guardar el equipo")
            console.log(error);
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleImageUpload = (url: string) => {
        console.log("Image uploaded:", url)
        setImageUrl(url)
    }

    const numEcconomico = form.watch("numEconomico")

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Nuevo registro de equipo</h1>
                            <p className="text-muted-foreground">
                                Ingrese la información necesaria para generar el nuevo registro de un nuevo equipo.
                            </p>
                        </div>
                    </div>
                    <Separator className="mt-4" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        <div className="p-6 border rounded-lg">
                            <UploadImage
                                path={`/equipos/${numEcconomico.replace(/\s+/g, "")}`}
                                id={equipoId || uid}
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

                            <p className="text-sm font-light text-muted-foreground mt-2">
                                *Se recomienda ingresar el numero economico antes de subir la imagen
                            </p>

                            {imageUrl && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium dark:text-gray-800">Url de la imagen en base de datos:</p>
                                    <p className="text-xs text-gray-700 break-all mt-1">{imageUrl}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="numEconomico"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Numero economico</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. FZ0-0001" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="marca"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Marca</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. Freightliner" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="modelo"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Modelo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. CASCADIA 125" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">Año</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ej. 2025" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="m3"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">M³</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ej. 10000" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="placas"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Placas</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. XXXXXX" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serie"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Serie</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej. 3WKDD40X5FF861812" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tipoUnidad"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-2'>
                                            <FormLabel>Tipo unidad</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                equipoId
                                                                    ? field.value
                                                                    : "Tipo de unidad"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999]">
                                                    {tipoUnidad.map((unidad) => (
                                                        <SelectItem value={unidad.nombre} key={unidad.id}>
                                                            {unidad.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipoTanque"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-2'>
                                            <FormLabel>Tipo tanque</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                equipoId
                                                                    ? field.value
                                                                    : "Tipo de tanque"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999]">
                                                    {tipoTanque.map((tanque) => (
                                                        <SelectItem value={tanque.nombre} key={tanque.id}>
                                                            {tanque.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="activo"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Equipo activo?</FormLabel>
                                                <FormDescription>
                                                    Se marca activo si el equipo se encuentra en uso y en funcionamiento total.
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

                                <FormField
                                    control={form.control}
                                    name="gpsActivo"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>GPS activo?</FormLabel>
                                                <FormDescription>
                                                    Se marca activo si el equipo cuenta con un GPS.
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
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h1 className="text-muted-foreground">Ultima ubicacion</h1>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="ultimaUbicacion.latitud"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">Latitud</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="XXXX"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ultimaUbicacion.longitud"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">Longitud</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="XXXX"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DatePickerForm<EquiposSchemaType>
                                    label="Fecha ultima ubicación"
                                    name="ultimaUbicacion.fecha"
                                    disabled={isSubmitting}
                                    className="w-full col-span-2"
                                />

                                <FormField
                                    control={form.control}
                                    name="ultimaUbicacion.direccionAproximada"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Direccion aproximada</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Calle X # Y - Z"
                                                    className="h-20 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h1 className="text-muted-foreground">Ultimo consumo</h1>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-4 gap-4">
                                <DatePickerForm<EquiposSchemaType>
                                    label="Fecha ultimo consumo"
                                    name="ultimoConsumo.fecha"
                                    disabled={isSubmitting}
                                    className="w-full col-span-4"
                                />

                                <FormField
                                    control={form.control}
                                    name="ultimoConsumo.litros"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Litros</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="X Litros"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ultimoConsumo.odometro"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">Odometro</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="X Km"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator className="my-2 col-span-4" />

                                <FormField
                                    control={form.control}
                                    name="estado"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-3 place-self-end'>
                                            <FormLabel>Tipo unidad</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seleccione un estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(EstadoEquipos).map((estado) => (
                                                        <SelectItem key={estado} value={estado}>
                                                            {estado.replace(/_/g, ' ')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="rendimientoPromedioKmPorLitro"
                                    render={({ field }) => (
                                        <FormItem className="w-full place-self-end">
                                            <FormLabel className="text-sm font-medium">Rendimiento promedio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="X Litros"
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
                        <div className="p-6 border rounded-lg">
                            <h1 className="text-muted-foreground">Permiso de SCT</h1>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="permisoSCT.numero"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">
                                                Numero permiso SCT
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. 123456789"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="permisoSCT.tipo"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">
                                                Tipo permiso SCT
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. TPAF03"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DatePickerForm<EquiposSchemaType>
                                    label="Vigencia SCT"
                                    name="permisoSCT.vigenciaHasta"
                                    disabled={isSubmitting}
                                    className="w-full col-span-4"
                                />

                                <Separator className="my-1 col-span-4" />

                                <FormField
                                    control={form.control}
                                    name="grupoUnidad"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-4'>
                                            <FormLabel>Grupo de la unidad</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={
                                                                field.value
                                                                    ? field.value
                                                                    : "Grupo de la unidad"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999] w-full">
                                                    <SelectItem value="GRUPO DIAZ ALVAREZ">
                                                        GRUPO DIAZ ALVAREZ
                                                    </SelectItem>
                                                    <SelectItem value="FELIX DIAZ ALVAREZ">
                                                        FELIX DIAZ ALVAREZ
                                                    </SelectItem>
                                                    <SelectItem value="GENERAL">
                                                        GENERAL
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="idOperador"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col w-full col-span-4">
                                            <FormLabel>Operador</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            {field.value ?
                                                                `${operadores.find((o) => o.id === field.value)?.nombres}
                                                                ${operadores.find((o) => o.id === field.value)?.apellidos}`
                                                                : "Seleccionar operador"}
                                                            <ChevronsUpDown className="ml-2 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Buscar operador..." />
                                                        <CommandList>
                                                            <CommandEmpty>No se encontro operador.</CommandEmpty>
                                                            <CommandGroup>
                                                                {operadores.map((operador) => {
                                                                    return (
                                                                        <CommandItem
                                                                            key={operador.id}
                                                                            onSelect={() => field.onChange(operador.id)}
                                                                        >
                                                                            {operador.nombres} {operador.apellidos}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    field.value === operador.id ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="p-6 border rounded-lg col-span-3">
                            <h1 className="text-muted-foreground">Poliza de seguro</h1>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="seguro.numeroPoliza"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Numero de poliza
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. 123456789"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="seguro.aseguradora"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Aseguradora
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. ANA Seguros"
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DatePickerForm<EquiposSchemaType>
                                    label="Vigencia hasta"
                                    name="seguro.vigenciaHasta"
                                    disabled={isSubmitting}
                                    className="w-full"
                                />

                                <FormField
                                    control={form.control}
                                    name="seguro.tipoCobertura"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Tipo de cobertura
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. Daños materiales"
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
                    </div>
                    <Separator className="mt-4" />
                    <div className="flex items-center justify-end w-full">
                        <Button
                            type="submit"
                            className="mt-5 tracking-wide font-semibold"
                            disabled={isSubmitting}
                        >
                            <Truck />
                            {equipoId ? "Actualizar equipo" : "Crear nuevo equipo"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevoEquipoPage