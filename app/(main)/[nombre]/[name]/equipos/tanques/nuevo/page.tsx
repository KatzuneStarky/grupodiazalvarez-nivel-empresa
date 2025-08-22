"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TanquesSchema, TanquesSchemaType } from "@/modules/logistica/tanques/schemas/tanques.schema"
import { AlertCircle, Check, CheckCircle, ChevronsUpDown, ShieldAlert, XCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"
import { useState } from "react"

const NuevoTanquePage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const [tanqueId, setTanqueId] = useState<string>()
    const { equipos } = useEquipos()
    const router = useRouter()
    const uid = uuidv4()

    const form = useForm<TanquesSchemaType>({
        resolver: zodResolver(TanquesSchema),
        defaultValues: {
            marca: "",
            modelo: "",
            year: 0,
            serie: "",
            placas: "",
            equipoId: "",
            capacidadLitros: 0,
            tipoCombustible: "Diesel",
            numeroTanque: "",
            ubicacion: "Izquierdo",
            activo: true,
            estadoFisico: "Bueno",
            seguro: {
                numeroPoliza: "",
                aseguradora: "",
                vigenciaHasta: new Date(),
                tipoCobertura: "",
            },
            permisoSCT: {
                numero: "",
                tipo: "",
                vigenciaHasta: new Date(),
            },
        }
    })

    const onSubmit = async (data: TanquesSchemaType) => {

    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon iconName="mdi:train-car-tank" className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Nuevo registro de tanque</h1>
                            <p className="text-muted-foreground">
                                Ingrese la información necesaria para generar el nuevo registro de un nuevo tanque.
                            </p>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-muted-foreground mb-2">
                                *Seleccione el equipo al que pertenece el tanque.
                            </p>
                            <div className="w-52">
                                <FormField
                                    control={form.control}
                                    name="equipoId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col w-full col-span-4">
                                            <FormLabel>Equipo</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            {field.value ?
                                                                `${equipos.find((o) => o.id === field.value)?.numEconomico}`
                                                                : "Seleccionar equipo"}
                                                            <ChevronsUpDown className="ml-2 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Buscar equipo..." />
                                                        <CommandList>
                                                            <CommandEmpty>No se encontro equipo.</CommandEmpty>
                                                            <CommandGroup>
                                                                {equipos.map((equipo) => {
                                                                    return (
                                                                        <CommandItem
                                                                            key={equipo.id}
                                                                            onSelect={() => field.onChange(equipo.id)}
                                                                        >
                                                                            {equipo.numEconomico}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    field.value === equipo.id ? "opacity-100" : "opacity-0"
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

                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="w-96 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Tanque activo?</FormLabel>
                                        <FormDescription>
                                            Marque esta opcion si el tanque se encuentra activo.
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

                    <Separator className="my-4" />
                    <div className="p-6 border rounded-lg">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                    <FormItem className="w-full">
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
                                    <FormItem className="w-full">
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
                                name="placas"
                                render={({ field }) => (
                                    <FormItem className="w-full">
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
                                    <FormItem className="w-full">
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
                    <div className="grid grid-cols-3 gap-4 my-4">
                        <div className="p-6 border rounded-lg">
                            <div className="grid grid-cols-4 gap-6">
                                <FormField
                                    control={form.control}
                                    name="numeroTanque"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                No. tanque
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. 1"
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
                                    name="capacidadLitros"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Capacidad(Lts)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. 1"
                                                    className="h-10"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipoCombustible"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-2'>
                                            <FormLabel>Tipo combustible</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={
                                                                field.value
                                                                    ? field.value
                                                                    : "Tipo de combustible"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999] w-full">
                                                    <SelectItem value="Diesel">
                                                        Diesel
                                                    </SelectItem>
                                                    <SelectItem value="Gasolina">
                                                        Gasolina
                                                    </SelectItem>
                                                    <SelectItem value="Otro">
                                                        Otro
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ubicacion"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-2'>
                                            <FormLabel>Ubicacion tanque</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={
                                                                field.value
                                                                    ? field.value
                                                                    : "Ubicacion"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999] w-full">
                                                    <SelectItem value="Izquierdo">
                                                        Izquierdo
                                                    </SelectItem>
                                                    <SelectItem value="Derecho">
                                                        Derecho
                                                    </SelectItem>
                                                    <SelectItem value="Superior">
                                                        Superior
                                                    </SelectItem>
                                                    <SelectItem value="Trasero">
                                                        Trasero
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="estadoFisico"
                                    render={({ field }) => (
                                        <FormItem className='w-full col-span-2'>
                                            <FormLabel>Estado fisico</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={
                                                                field.value
                                                                    ? field.value
                                                                    : "Estado fisico"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999] w-full">
                                                    <SelectItem value="Bueno">
                                                        <CheckCircle className="text-green-500" />
                                                        Bueno
                                                    </SelectItem>
                                                    <SelectItem value="Regular">
                                                        <ShieldAlert className="text-yellow-500" />
                                                        Regular
                                                    </SelectItem>
                                                    <SelectItem value="Malo">
                                                        <XCircle className="text-red-500" />
                                                        Malo
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="p-6 border rounded-lg">
                            <h1 className="text-muted-foreground">Poliza de seguro</h1>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4">
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

                                <DatePickerForm<TanquesSchemaType>
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

                        <div className="p-6 border rounded-lg">
                            <h1 className="text-muted-foreground">Permiso de SCT</h1>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4">
                                <DatePickerForm<TanquesSchemaType>
                                    label="Vigencia SCT"
                                    name="permisoSCT.vigenciaHasta"
                                    disabled={isSubmitting}
                                    className="w-full"
                                />

                                <FormField
                                    control={form.control}
                                    name="permisoSCT.tipo"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
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
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevoTanquePage