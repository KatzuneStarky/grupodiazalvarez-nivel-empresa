"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RutaSchema, RutaSchemaType } from "@/modules/logistica/rutas/schemas/ruta.schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RouteMapPage from "@/modules/logistica/rutas/components/route-map"
import { PuntoGeografico } from "@/modules/logistica/equipos/types/rutas"
import { writeRoute } from "@/modules/logistica/rutas/actions/write"
import { MapPin, Navigation, Route, User } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner"

const NuevaRutaPage = () => {
    const [selectionMode, setSelectionMode] = useState<"none" | "origin" | "destination">("none")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter()
    const newId = uuidv4()

    const form = useForm<RutaSchemaType>({
        resolver: zodResolver(RutaSchema),
        defaultValues: {
            activa: true,
            clasificacion: "material peligroso",
            descripcion: "",
            destino: {
                latitud: 0,
                longitud: 0,
                nombre: ""
            },
            idCliente: "",
            origen: {
                latitud: 0,
                longitud: 0,
                nombre: ""
            },
            tipoViaje: "local",
            trayecto: {
                activo: true,
                destino: {
                    latitud: 0,
                    longitud: 0,
                    nombre: ""
                },
                origen: {
                    latitud: 0,
                    longitud: 0,
                    nombre: ""
                },
                horas: 0,
                kilometros: 0,
                tipoTrayecto: "redondo"
            },
            viajeFacturable: true
        }
    })

    const onSubmit = async (data: RutaSchemaType) => {
        try {
            setIsSubmitting(true)

            toast.promise(writeRoute({
                activa: data.activa,
                clasificacion: data.clasificacion,
                descripcion: data.descripcion,
                destino: {
                    latitud: data.destino.latitud,
                    longitud: data.destino.longitud,
                    nombre: data.destino.nombre
                },
                idCliente: newId,
                origen: {
                    latitud: data.origen.latitud,
                    longitud: data.origen.longitud,
                    nombre: data.origen.nombre
                },
                tipoViaje: data.tipoViaje,
                trayecto: {
                    activo: data.activa,
                    destino: {
                        latitud: data.destino.latitud,
                        longitud: data.destino.longitud,
                        nombre: data.destino.nombre
                    },
                    horas: data.trayecto.horas,
                    id: newId,
                    kilometros: data.trayecto.kilometros,
                    origen: {
                        latitud: data.origen.latitud,
                        longitud: data.origen.longitud,
                        nombre: data.origen.nombre
                    },
                    tipoTrayecto: data.trayecto.tipoTrayecto
                },
                viajeFacturable: data.viajeFacturable,
            }), {
                loading: "Creando registro de la nueva ruta, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar la ruta.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            toast.error("Error al guardar el equipo")
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    const origen = form.watch("origen") ?? { latitud: 0, longitud: 0, nombre: "" }
    const destino = form.watch("destino") ?? { latitud: 0, longitud: 0, nombre: "" }

    useEffect(() => {
        if (origen && destino) {
            const latDiff = Math.abs(origen.latitud - destino.latitud)
            const lonDiff = Math.abs(origen.longitud - destino.longitud)
            const kilometros = Math.round((latDiff + lonDiff) * 111)
            const horas = Math.round((kilometros / 80) * 10) / 10

            form.setValue("trayecto.kilometros", kilometros, { shouldValidate: true })
            form.setValue("trayecto.horas", horas, { shouldValidate: true })
        }
    }, [origen, destino, form])

    const handleMapPointSelect = (point: PuntoGeografico) => {
        if (selectionMode === "origin") {
            form.setValue("origen", point, { shouldValidate: true, shouldDirty: true })
            setSelectionMode("none")
        } else if (selectionMode === "destination") {
            form.setValue("destino", point, { shouldValidate: true, shouldDirty: true })
            setSelectionMode("none")
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Nueva Ruta</h1>
                <p className="text-muted-foreground">
                    Crea una nueva ruta de transporte
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="shadow-lg border-2">
                            <CardHeader className="">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <User className="h-5 w-5 text-red-600" />
                                    Información General
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="descripcion"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Descripcion
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describa la ruta"
                                                        className="h-32 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="tipoViaje"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Tipo de viaje</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder={
                                                                        field.value
                                                                            ? field.value
                                                                            : "Tipo de viaje"
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="z-[999] w-full">
                                                            <SelectItem value="local">
                                                                Local
                                                            </SelectItem>
                                                            <SelectItem value="foráneo">
                                                                Foráneo
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="clasificacion"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Clasificacion de viaje</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder={
                                                                        field.value
                                                                            ? field.value
                                                                            : "Clasificacion de viaje"
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="z-[999] w-full">
                                                            <SelectItem value="material peligroso">
                                                                Material peligroso
                                                            </SelectItem>
                                                            <SelectItem value="grava de 3/4">
                                                                Grava de 3/4
                                                            </SelectItem>
                                                            <SelectItem value="cemento">
                                                                Cemento
                                                            </SelectItem>
                                                            <SelectItem value="arena">
                                                                Arena
                                                            </SelectItem>
                                                            <SelectItem value="agua">
                                                                Agua
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Route className="h-4 w-4" />
                                    Detalles del Trayecto
                                </Label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex items-center space-x-3">
                                        <FormField
                                            control={form.control}
                                            name="trayecto.kilometros"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium">
                                                        Kilometros
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Kilometros"
                                                            type="number"
                                                            className="h-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <FormField
                                            control={form.control}
                                            name="trayecto.horas"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium">
                                                        Horas
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Horas"
                                                            type="number"
                                                            className="h-10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <FormField
                                            control={form.control}
                                            name="trayecto.tipoTrayecto"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Tipo de trayecto</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue
                                                                    placeholder={
                                                                        field.value
                                                                            ? field.value
                                                                            : "Tipo de trayecto"
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="z-[999] w-full">
                                                            <SelectItem value="sencillo">
                                                                Sencillo
                                                            </SelectItem>
                                                            <SelectItem value="redondo">
                                                                Redondo
                                                            </SelectItem>
                                                            <SelectItem value="otro">
                                                                Otro
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex items-center space-x-3">
                                        <FormField
                                            control={form.control}
                                            name="activa"
                                            render={({ field }) => (
                                                <FormItem className="w-full col-span-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Ruta activa?</FormLabel>
                                                        <FormDescription>
                                                            Marcar esta opcion di la ruta actual se encuentra activa
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

                                    <div className="flex items-center space-x-3">
                                        <FormField
                                            control={form.control}
                                            name="viajeFacturable"
                                            render={({ field }) => (
                                                <FormItem className="w-full col-span-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Viaje facturable?</FormLabel>
                                                        <FormDescription>
                                                            Se marca esta opcion si los viajes en esta ruta son facturables
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
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-2">
                            <CardHeader className="">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Navigation className="h-5 w-5 text-green-600" />
                                    Ubicaciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="origen" className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            Punto de Origen
                                        </Label>
                                        <Button
                                            type="button"
                                            variant={selectionMode === "origin" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectionMode(selectionMode === "origin" ? "none" : "origin")}
                                            className="flex items-center gap-2"
                                        >
                                            <MapPin className="h-3 w-3" />
                                            {selectionMode === "origin" ? "Cancelar" : "Seleccionar en mapa"}
                                        </Button>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="origen.nombre"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Nombre punto origen
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej. Sede Combustibles baja sur" className="h-10" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {origen && (
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <div className="space-y-1">
                                                <FormField
                                                    control={form.control}
                                                    name="origen.latitud"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-sm font-medium">
                                                                Nombre punto origen
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Ej. Sede Combustibles baja sur" className="h-10 text-xs text-muted-foreground" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <FormField
                                                    control={form.control}
                                                    name="origen.longitud"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-sm font-medium">
                                                                Nombre punto origen
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Ej. Sede Combustibles baja sur" className="h-10 text-xs text-muted-foreground" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="destino" className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            Punto de Destino
                                        </Label>
                                        <Button
                                            type="button"
                                            variant={selectionMode === "destination" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectionMode(selectionMode === "destination" ? "none" : "destination")}
                                            className="flex items-center gap-2"
                                        >
                                            <MapPin className="h-3 w-3" />
                                            {selectionMode === "destination" ? "Cancelar" : "Seleccionar en mapa"}
                                        </Button>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="destino.nombre"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Nombre punto origen
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej. Sede Combustibles baja sur" className="h-10" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {origen && (
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <div className="space-y-1">
                                                <FormField
                                                    control={form.control}
                                                    name="destino.latitud"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-sm font-medium">
                                                                Nombre punto origen
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Ej. Sede Combustibles baja sur" className="h-10 text-xs text-muted-foreground" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <FormField
                                                    control={form.control}
                                                    name="destino.longitud"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-sm font-medium">
                                                                Nombre punto origen
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Ej. Sede Combustibles baja sur" className="h-10 text-xs text-muted-foreground" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-lg border-2">
                        <CardHeader className="">
                            <CardTitle className="flex items-center gap-2 text-3xl">
                                <MapPin className="h-12 w-12 text-red-600" />
                                Mapa de Ruta
                            </CardTitle>
                            {selectionMode !== "none" && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="animate-pulse">
                                        {selectionMode === "origin" ? "Seleccionando Origen" : "Seleccionando Destino"}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        {selectionMode === "origin"
                                            ? "Haz clic en el mapa para seleccionar el punto de origen"
                                            : "Haz clic en el mapa para seleccionar el punto de destino"}
                                    </p>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-6">
                            <RouteMapPage
                                origen={origen}
                                destino={destino}
                                onOriginSelect={(point) => handleMapPointSelect(point)}
                                onDestinationSelect={(point) => handleMapPointSelect(point)}
                                selectionMode={selectionMode}
                                editable
                                className="h-[800px] w-full rounded-lg border-2 border-border"
                            />
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                        <Button type="button" variant="outline" className="h-11 px-8 bg-transparent">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 px-8"
                        >
                            Crear Ruta
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevaRutaPage