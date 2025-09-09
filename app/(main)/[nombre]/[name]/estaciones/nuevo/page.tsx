"use client"

import { EstacionDeServicioSchema, EstacionDeServicioType } from "@/modules/logistica/estaciones/schemas/estacion-servicio.schema"
import { MunicipiosEstado } from "@/types/municipios-estado"
import { zodResolver } from "@hookform/resolvers/zod"
import { EstadoPais } from "@/types/estado-pais"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { getEstadosApi } from "@/utils/get-estados-api"
import { getMunicipiosEstados } from "@/utils/get-municipios-estados"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { IconGasStation } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/global/icon"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Plus, Trash2 } from "lucide-react"

const NuevaEstacionPage = () => {
    const [selectedEstadoId, setSelectedEstadoId] = useState<string>("1")
    const [municipios, setMunicipios] = useState<MunicipiosEstado[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [estados, setEstados] = useState<EstadoPais[]>([])
    const router = useRouter()

    const form = useForm<EstacionDeServicioType>({
        resolver: zodResolver(EstacionDeServicioSchema),
        defaultValues: {
            activo: true,
            contacto: {
                email: "",
                responsable: "",
                telefono: ""
            },
            direccion: {
                calle: "",
                colonia: "",
                estado: "",
                pais: "",
                ciudad: "",
                codigoPostal: "",
                numeroExterior: "",
                numeroInterior: ""
            },
            fechaRegistro: new Date(),
            horarios: "",
            nombre: "",
            numeroPermisoCRE: "",
            productos: [],
            razonSocial: "",
            rfc: "",
            tanques: [],
            ubicacion: {
                lat: "0",
                lng: "0"
            }
        }
    })

    const onSubmit = async (data: EstacionDeServicioType) => {

    }

    const { append, fields, remove } = useFieldArray({
        control: form.control,
        name: "tanques",
        rules: {
            required: "Debe agregar al menos un tanque"
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            const estadosData = await getEstadosApi()
            setEstados(estadosData)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const fetchMunicipios = async () => {
            const data = await getMunicipiosEstados(selectedEstadoId)
            setMunicipios(data)
        }

        fetchMunicipios()
    }, [estados, selectedEstadoId])

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <IconGasStation className="h-12 w-12 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Nuevo registro de estación</h1>
                                <p className="text-muted-foreground">
                                    Ingrese la información necesaria para generar el nuevo registro de una nueva estación.
                                </p>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="w-96 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Estación activa?</FormLabel>
                                        <FormDescription>
                                            Marque esta opcion si la estación se encuentra activa.
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
                    <Separator className="mt-4" />
                    <h3 className="text-xl text-muted-foreground mt-4">Datos generales</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-4">
                        <FormField
                            control={form.control}
                            name="razonSocial"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-2">
                                    <FormLabel className="text-sm font-medium">
                                        Razón social
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

                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Nombre corto
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

                        <FormField
                            control={form.control}
                            name="rfc"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        RFC
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

                        <FormField
                            control={form.control}
                            name="numeroPermisoCRE"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Número de permiso CRE
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

                        <DatePickerForm<EstacionDeServicioType>
                            label="Fecha de registro"
                            name="fechaRegistro"
                            disabled={isSubmitting}
                        />

                        <div className="col-span-3">
                            <FormField
                                control={form.control}
                                name="horarios"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">
                                            Horario
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="h-32 resize-none"
                                                placeholder="Ej. Lunes a Viernes: 8:00 AM - 6:00 PM (separa con coma cada dia)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Separator className="mt-8" />
                    <div className="flex items-center justify-between mt-4">
                        <h3 className="text-xl text-muted-foreground">Informacion de tanques</h3>
                        <Button
                            onClick={() => append({
                                capacidadActual: 0,
                                capacidadTotal: 0,
                                fechaUltimaRecarga: new Date(),
                                numeroTanque: "",
                                tipoCombustible: "Magna"
                            })}
                            type="button"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo tanque
                        </Button>
                    </div>
                    {fields.length === 0 ? (
                        <div className="space-y-2">
                            <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                                <Icon iconName="mdi:storage-tank" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No hay tanques agregados</p>
                                <p className="text-sm">Haga clic en "Nuevo Tanque" para comenzar</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-4 space-y-4">
                            {fields.map((field, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon iconName="mdi:storage-tank" className="h-4 w-4" />
                                                Tanque ({index + 1})
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-5 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`tanques.${index}.capacidadActual`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium">
                                                        Capacidad Actual
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
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
                                            name={`tanques.${index}.capacidadTotal`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium">
                                                        Capacidad Total
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
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
                                            name={`tanques.${index}.numeroTanque`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium">
                                                        Numero de Tanque
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="h-10"
                                                            placeholder="Ej. 1 o Numero de serie"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <DatePickerForm<EstacionDeServicioType>
                                            label="Fecha de ultima recarga"
                                            name={`tanques.${index}.fechaUltimaRecarga`}
                                            disabled={isSubmitting}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    <Separator className="mt-8" />
                    <h3 className="text-xl text-muted-foreground mt-4">Informacion de direccion</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4 place-items-end">
                        <FormField
                            control={form.control}
                            name="direccion.pais"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Pais
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

                        <FormField
                            control={form.control}
                            name="direccion.estado"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Estado</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            const estadoSeleccionado = estados.find((e) => e.name === value)
                                            if (estadoSeleccionado) {
                                                setSelectedEstadoId(estadoSeleccionado.id)
                                            }
                                        }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={"Selecciona un estado"}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[999]">
                                            {estados.map((estado, index) => (
                                                <SelectItem
                                                    value={estado.name}
                                                    key={estado.id}
                                                >
                                                    {estado.name}
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
                            name="direccion.ciudad"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Municipio</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={"Selecciona un municipio"}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[999]">
                                            {municipios.map((municipio, index) => (
                                                <SelectItem
                                                    value={municipio.name}
                                                    key={municipio.id}
                                                >
                                                    {municipio.name}
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
                            name="direccion.calle"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Calle
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

                        <FormField
                            control={form.control}
                            name="direccion.colonia"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Colonia
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="direccion.numeroInterior"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">
                                            No. Exterior
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

                            <FormField
                                control={form.control}
                                name="direccion.numeroInterior"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">
                                            No. Interior
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

                        <FormField
                            control={form.control}
                            name="direccion.codigoPostal"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Codigo Postal
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
                    <Separator className="mt-8" />
                    <h3 className="text-xl text-muted-foreground mt-4">Informacion de ubicacion</h3>
                    <div className="grid grid-cols-6 gap-4 mt-4">
                        <div className="col-span-1 grid grid-rows-2 gap-5">
                            <FormField
                                control={form.control}
                                name="ubicacion.lat"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">
                                            Latitud
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-10"
                                                disabled
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ubicacion.lng"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">
                                            Longitud
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-10"
                                                disabled
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mapa</CardTitle>
                                    <CardDescription>
                                        Selecciona la ubicacion de la estacion en el mapa
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                    <Separator className="mt-8 mb-4" />
                    <div className="flex items-center justify-end w-full">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando estacion...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Guardar estacion
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevaEstacionPage