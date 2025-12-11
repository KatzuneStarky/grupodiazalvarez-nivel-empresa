"use client"

import { MapPin, Loader2, Gauge, Upload, FileImage, FileVideo, File as FileIcon, X, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { IncidenciaSchemaType } from "../schema/incidencia.schema"
import { incidenciaTipoMap } from "../types/incidencias"
import { ScrollArea } from "@/components/ui/scroll-area"
import MapPicker from "@/components/custom/map-picker"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import React, { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface PendingFile {
    file: File
    preview: string
    id: string
}

interface IncidenciasFormProps {
    onSubmit: (data: IncidenciaSchemaType) => void
    form: UseFormReturn<IncidenciaSchemaType>
    submitButton: React.ReactNode
    incidenciaId?: string
    isSubmitting: boolean
    operadorId: string
    equipoId: string
    pendingFiles?: PendingFile[]
    handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleRemovePendingFile?: (id: string) => void
    uploadProgress?: Record<string, number>
}

// Rules for auto-calculating fields based on Incidencia Tipo
const incidentRules: Record<string, { severidad: string, categoria: string, operable: boolean }> = {
    'Mecanica': { severidad: 'Media', categoria: 'Mantenimiento', operable: true },
    'Electrica': { severidad: 'Media', categoria: 'Mantenimiento', operable: true },
    'Frenos': { severidad: 'Alta', categoria: 'Seguridad', operable: false },
    'Motor': { severidad: 'Alta', categoria: 'Mantenimiento', operable: false },
    'Neumaticos': { severidad: 'Media', categoria: 'Mantenimiento', operable: true },
    'Transmision': { severidad: 'Alta', categoria: 'Mantenimiento', operable: false },
    'Fuga': { severidad: 'Media', categoria: 'Mantenimiento', operable: true },
    'Tanque': { severidad: 'Alta', categoria: 'Combustible', operable: true },
    'GPS': { severidad: 'Baja', categoria: 'Operativa', operable: true },
    'Documentacion': { severidad: 'Baja', categoria: 'Documentos', operable: true },
    'Accidente': { severidad: 'Critica', categoria: 'Seguridad', operable: false },
    'Otro': { severidad: 'Baja', categoria: 'Operativa', operable: true },
}

const IncidenciasForm = ({
    incidenciaId,
    isSubmitting,
    submitButton,
    operadorId,
    onSubmit,
    equipoId,
    form,
    pendingFiles = [],
    handleFileChange,
    handleRemovePendingFile,
    uploadProgress = {}
}: IncidenciasFormProps) => {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | undefined>(
        form.getValues("ubicacion") ? {
            lat: form.getValues("ubicacion")?.latitud!,
            lng: form.getValues("ubicacion")?.longitud!
        } : undefined
    )
    const { operadores } = useOperadores()
    const { equipos } = useEquipos()

    const numEconomico = equipos?.find((equipo) => equipo.id === equipoId)?.numEconomico
    const operador = operadores?.find((operador) => operador.id === operadorId)

    // Watch for changes in Tipo to auto-calculate fields
    const selectedTipo = form.watch("tipo")

    useEffect(() => {
        if (selectedTipo && incidentRules[selectedTipo]) {
            const rule = incidentRules[selectedTipo]

            // We use standard values that match the schema types
            // Explicitly casting or ensuring they match the expected enum strings
            form.setValue("severidad", rule.severidad as any)
            form.setValue("categoria", rule.categoria as any)
            form.setValue("operable", rule.operable)
        }
    }, [selectedTipo, form])

    useEffect(() => {
        form.setValue("equipoId", equipoId)
        form.setValue("operadorId", operadorId)
        // Ensure default state is set if not present
        if (!form.getValues("estado")) {
            form.setValue("estado", "Reportada")
        }
    }, [equipoId, form, operadorId])

    const handleGetLocation = () => {
        setIsLoadingLocation(true)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords
                    setCurrentLocation({ lat: latitude, lng: longitude })

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        )
                        const data = await response.json()
                        const address = data.display_name

                        form.setValue("ubicacion", {
                            latitud: latitude,
                            longitud: longitude,
                            direccionAproximada: address
                        })
                    } catch (error) {
                        console.error("Error fetching address:", error)
                        form.setValue("ubicacion", {
                            latitud: latitude,
                            longitud: longitude,
                            direccionAproximada: ""
                        })
                        toast.success("Ubicación obtenida", {
                            description: "No se pudo obtener la dirección exacta, pero las coordenadas se guardaron",
                        })
                    }

                    setIsLoadingLocation(false)
                },
                (error) => {
                    console.error("Error getting location:", error)
                    setIsLoadingLocation(false)
                    toast.error("Error", {
                        description: "No se pudo obtener tu ubicación. Por favor verifica los permisos del navegador.",
                    })
                }
            )
        } else {
            setIsLoadingLocation(false)
            toast.error("Error", {
                description: "La geolocalización no está soportada en este navegador.",
            })
        }
    }

    const handleLocationSelect = async (lat: number, lng: number) => {
        setCurrentLocation({ lat, lng })
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
            const data = await response.json()
            const address = data.display_name

            form.setValue("ubicacion", {
                latitud: lat,
                longitud: lng,
                direccionAproximada: address
            })
        } catch (error) {
            form.setValue("ubicacion", {
                latitud: lat,
                longitud: lng,
                direccionAproximada: ""
            })
        }
    }

    useEffect(() => {
        return () => {
            pendingFiles.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview)
            })
        }
    }, [pendingFiles])

    const getFileTypeIcon = (tipo: string) => {
        if (tipo.startsWith("image/")) return <FileImage className="h-4 w-4 text-blue-500" />
        if (tipo.startsWith("video/")) return <FileVideo className="h-4 w-4 text-purple-500" />
        return <FileIcon className="h-4 w-4 text-gray-500" />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 h-full">
                    <ScrollArea className="order-2 lg:order-1 lg:col-span-5 flex-1 lg:h-full min-h-0 rounded-md border p-4 bg-card/50">
                        <div className="space-y-6 pr-4 pb-20">
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Información General
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Detalles del reporte</p>
                                </div>
                                <div className="text-right">
                                    <DatePickerForm
                                        name="fecha"
                                        label=""
                                        startYear={new Date().getFullYear()}
                                        endYear={new Date().getFullYear() + 1}
                                        disabled={isSubmitting}
                                        defaultToNow={true}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-lg border">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Equipo</p>
                                    <p className="font-semibold">{numEconomico || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Operador</p>
                                    <p className="font-semibold truncate">
                                        {operador ? `${operador.nombres} ${operador.apellidos}` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Incidencia</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full h-11">
                                                        <SelectValue placeholder="Seleccionar tipo..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999] max-h-[300px]">
                                                    {incidenciaTipoMap.map((tipo, index) => (
                                                        <SelectItem
                                                            value={tipo.value}
                                                            key={index}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <tipo.icon className={`h-4 w-4 text-${tipo.color}`} />
                                                                {tipo.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="severidad"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground">Severidad (Auto)</FormLabel>
                                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 text-sm font-medium">
                                                    {field.value || "-"}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="categoria"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground">Categoría (Auto)</FormLabel>
                                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 text-sm font-medium">
                                                    {field.value || "-"}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="descripcion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción detallada</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe el problema, ruidos extraños, o circunstancias..."
                                                    className="h-24 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            {/* Vehicle Status */}
                            <div>
                                <h4 className="text-sm font-semibold mb-3">Estado del Vehículo</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="kmActual"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Kilometraje</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Gauge className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input type="number" placeholder="0" className="pl-9 h-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nivelCombustible"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Combustible %</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" max="100" placeholder="0" className="h-9" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                    <span className="text-sm font-medium">¿Unidad Operable?</span>
                                    <FormField
                                        control={form.control}
                                        name="operable"
                                        render={({ field }) => (
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-xs font-medium px-2 py-1 rounded", field.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                                    {field.value ? "OPERABLE" : "NO OPERABLE"}
                                                </span>
                                                {/* Hidden Switch just for state binding if needed, or visual only since its read-only */}
                                                <Switch
                                                    checked={field.value}
                                                    disabled
                                                    className="opacity-50"
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* File Upload Section */}
                            <div>
                                <h4 className="text-sm font-semibold mb-3">Evidencias</h4>
                                <label className={`block border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors p-6 text-center rounded-lg cursor-pointer bg-muted/5`}>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isSubmitting}
                                        accept="image/*,video/*,.pdf,.doc,.docx"
                                    />
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium text-foreground">Click para subir archivos</p>
                                    <p className="text-xs text-muted-foreground mt-1">Imágenes o videos del incidente</p>
                                </label>

                                {pendingFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {pendingFiles.map((pendingFile) => {
                                            const progress = uploadProgress[pendingFile.id]
                                            return (
                                                <div key={pendingFile.id} className="flex items-center gap-3 border rounded-md p-2 bg-background/50 text-sm">
                                                    {pendingFile.preview ? (
                                                        <img src={pendingFile.preview} className="h-10 w-10 object-cover rounded bg-muted" alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                                            {getFileTypeIcon(pendingFile.file.type)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate font-medium">{pendingFile.file.name}</p>
                                                        {progress !== undefined && progress < 100 && (
                                                            <div className="h-1 w-full bg-muted rounded-full mt-1 overflow-hidden">
                                                                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleRemovePendingFile?.(pendingFile.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t sticky bottom-0 bg-background/95 backdrop-blur p-2 -mx-2 -mb-2 mt-4 z-10">
                                {submitButton}
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="order-1 lg:order-2 lg:col-span-7 h-[250px] lg:h-full flex flex-col rounded-md border overflow-hidden relative shrink-0">
                        <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
                            <div className="bg-background/90 backdrop-blur-md border shadow-lg rounded-lg p-3 max-w-sm pointer-events-auto">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Ubicación Seleccionada
                                </p>
                                <p className="text-sm font-medium leading-tight">
                                    {form.watch("ubicacion.direccionAproximada") || "Selecciona un punto en el mapa..."}
                                </p>
                                {currentLocation && (
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                                        {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={handleGetLocation}
                                disabled={isLoadingLocation}
                                className="pointer-events-auto shadow-lg"
                            >
                                {isLoadingLocation ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <MapPin className="mr-2 h-4 w-4" />
                                )}
                                <span className="hidden sm:inline ml-1">Mi Ubicación</span>
                            </Button>
                        </div>

                        <div className="flex-1 w-full relative bg-muted/20">
                            <MapPicker
                                lat={currentLocation?.lat}
                                lng={currentLocation?.lng}
                                onLocationSelect={handleLocationSelect}
                                className="h-full w-full"
                            />
                        </div>
                    </div>
                </div>
            </form >
        </Form >
    )
}

IncidenciasForm.displayName = "IncidenciasForm"

export default IncidenciasForm