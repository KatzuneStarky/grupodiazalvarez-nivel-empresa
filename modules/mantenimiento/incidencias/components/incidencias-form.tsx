"use client"

import { incidenciaCategoriaMap, incidenciaEstadoMap, incidenciaSeveridadMap, incidenciaTipoMap } from "../types/incidencias"
import { MapPin, Loader2, Gauge, Upload, FileImage, FileVideo, File as FileIcon, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { EvidenciaSchemaType } from "../../mantenimientos/schemas/mantenimiento.schema"
import React, { useEffect, useImperativeHandle, forwardRef, useState } from "react"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { IncidenciaSchemaType } from "../schema/incidencia.schema"
import { ScrollArea } from "@/components/ui/scroll-area"
import MapPicker from "@/components/custom/map-picker"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { storage } from "@/firebase/client"
import { toast } from "sonner"

interface IncidenciasFormProps {
    onSubmit: (data: IncidenciaSchemaType) => void
    form: UseFormReturn<IncidenciaSchemaType>
    submitButton: React.ReactNode
    incidenciaId?: string
    isSubmitting: boolean
    operadorId: string
    equipoId: string
}

export interface IncidenciasFormRef {
    uploadPendingFiles: () => Promise<EvidenciaSchemaType[]>
    hasPendingFiles: () => boolean
}

interface PendingFile {
    file: File
    preview: string
    id: string
}

const IncidenciasForm = forwardRef<IncidenciasFormRef, IncidenciasFormProps>(({
    incidenciaId,
    isSubmitting,
    submitButton,
    operadorId,
    onSubmit,
    equipoId,
    form,
}, ref) => {
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | undefined>(
        form.getValues("ubicacion") ? {
            lat: form.getValues("ubicacion")?.latitud!,
            lng: form.getValues("ubicacion")?.longitud!
        } : undefined
    )
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
    const [isUploading, setIsUploading] = useState(false)
    const { operadores } = useOperadores()
    const { equipos } = useEquipos()

    const numEconomico
        = equipos?.find((equipo) => equipo.id === equipoId)?.numEconomico

    const operador
        = operadores?.find((operador) => operador.id === operadorId)


    useEffect(() => {
        form.setValue("equipoId", equipoId)
        form.setValue("operadorId", operadorId)
    }, [equipoId, form, operadorId])

    const handleGetLocation = () => {
        setIsLoadingLocation(true)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords
                    setCurrentLocation({ lat: latitude, lng: longitude })

                    try {
                        // Reverse geocoding using Nominatim (OpenStreetMap)
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
                        // Fallback if reverse geocoding fails
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
            // Fallback
            form.setValue("ubicacion", {
                latitud: lat,
                longitud: lng,
                direccionAproximada: ""
            })
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])

        const newPendingFiles: PendingFile[] = files.map((file) => ({
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))

        setPendingFiles((prev) => [...prev, ...newPendingFiles])

        event.target.value = ""
    }

    const handleRemovePendingFile = (id: string) => {
        setPendingFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === id)
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview)
            }
            return prev.filter((f) => f.id !== id)
        })
        setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[id]
            return newProgress
        })
    }

    const uploadSingleFile = (pendingFile: PendingFile): Promise<EvidenciaSchemaType> => {
        return new Promise((resolve, reject) => {
            const path = `incidencias/${operadorId} - ${equipoId}`
            const fileRef = storageRef(storage, `${path}/${pendingFile.file.name}`)
            const uploadTask = uploadBytesResumable(fileRef, pendingFile.file)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadProgress((prev) => ({ ...prev, [pendingFile.id]: progress }))
                },
                (error) => {
                    console.error("Error uploading file:", error)
                    reject(error)
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref)
                    const evidencia: EvidenciaSchemaType = {
                        nombre: pendingFile.file.name,
                        ruta: url,
                        tipo: pendingFile.file.type,
                    }
                    resolve(evidencia)
                }
            )
        })
    }

    const uploadPendingFiles = async (): Promise<EvidenciaSchemaType[]> => {
        if (pendingFiles.length === 0) return []

        setIsUploading(true)
        const uploadedEvidencias: EvidenciaSchemaType[] = []

        try {
            for (const pendingFile of pendingFiles) {
                const evidencia = await uploadSingleFile(pendingFile)
                uploadedEvidencias.push(evidencia)
            }

            // Limpiar previews
            pendingFiles.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview)
            })
            setPendingFiles([])
            setUploadProgress({})

            toast.success(`${uploadedEvidencias.length} archivo(s) subido(s) correctamente`)
            return uploadedEvidencias
        } catch (error) {
            toast.error("Error al subir algunos archivos")
            throw error
        } finally {
            setIsUploading(false)
        }
    }

    useImperativeHandle(ref, () => ({
        uploadPendingFiles,
        hasPendingFiles: () => pendingFiles.length > 0
    }))

    useEffect(() => {
        return () => {
            pendingFiles.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview)
            })
        }
    }, [])

    const getFileTypeIcon = (tipo: string) => {
        if (tipo.startsWith("image/")) return <FileImage className="h-4 w-4 text-blue-500" />
        if (tipo.startsWith("video/")) return <FileVideo className="h-4 w-4 text-purple-500" />
        return <FileIcon className="h-4 w-4 text-gray-500" />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ScrollArea className="h-[750px] pr-4">
                        <div className="space-y-4 px-1">
                            <div className="flex items-center justify-end">
                                <DatePickerForm
                                    name="fecha"
                                    label="Fecha de la incidencia"
                                    startYear={new Date().getFullYear()}
                                    endYear={new Date().getFullYear() + 1}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <h3 className="text-xl text-muted-foreground mt-4">Datos generales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Número Económico del Equipo:</p>
                                    <p className="text-base font-semibold">{numEconomico || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Operador:</p>
                                    <p className="text-base font-semibold">
                                        {operador ? `${operador.nombres} ${operador.apellidos}` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-4" />
                            <h3 className="text-xl text-muted-foreground mt-4">Datos de la incidencia</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={field.value ? field.value : "Tipo de incidencia"}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999]">
                                                    {incidenciaTipoMap.map((estado, index) => (
                                                        <SelectItem
                                                            value={estado.value}
                                                            key={index}
                                                            className={`text-${estado.color}`}
                                                        >
                                                            <estado.icon className="ml-2" />
                                                            {estado.label}
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
                                    name="severidad"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Severidad</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={field.value ? field.value : "Saeveridad de la incidencia"}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999]">
                                                    {incidenciaSeveridadMap.map((estado, index) => (
                                                        <SelectItem
                                                            value={estado.value}
                                                            key={index}
                                                            className={`text-${estado.color}`}
                                                        >
                                                            <estado.icon className="ml-2" />
                                                            {estado.label}
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
                                    name="estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={field.value ? field.value : "Estado de la incidencia"}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999]">
                                                    {incidenciaEstadoMap.map((estado, index) => (
                                                        <SelectItem
                                                            value={estado.value}
                                                            key={index}
                                                            className={`text-${estado.color}`}
                                                        >
                                                            <estado.icon className="ml-2" />
                                                            {estado.label}
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
                                    name="categoria"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={field.value ? field.value : "Categoría de la incidencia"}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="z-[999]">
                                                    {incidenciaCategoriaMap.map((categoria, index) => (
                                                        <SelectItem
                                                            value={categoria.value}
                                                            key={index}
                                                            className={`text-${categoria.color}`}
                                                        >
                                                            <categoria.icon className="ml-2" />
                                                            {categoria.label}
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
                                    name="descripcion"
                                    render={({ field }) => (
                                        <FormItem className="w-full col-span-2">
                                            <FormLabel className="text-sm font-medium">
                                                Descripción
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="h-20 resize-none w-full"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="my-4" />
                            <h3 className="text-xl text-muted-foreground mt-4">Datos del Vehículo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="kmActual"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kilometraje Actual</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Gauge className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" placeholder="0" className="pl-8" {...field} />
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
                                            <FormLabel>Nivel de Combustible (%)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" max="100" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="velocidadAprox"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Velocidad Aprox. (km/h)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="operable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>¿Es Operable?</FormLabel>
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
                            <h3 className="text-xl text-muted-foreground mt-4">Evidencias</h3>
                            <p className="text-sm text-muted-foreground">
                                Los archivos se subirán cuando guardes la incidencia
                            </p>
                            <div className="mt-4">
                                <label className={`block border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center rounded-lg transition-colors ${isSubmitting || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"}`}>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isSubmitting || isUploading}
                                        accept="image/*,video/*,.pdf,.doc,.docx"
                                    />
                                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground font-medium">Arrastra o selecciona archivos</p>
                                    <p className="text-sm text-muted-foreground mt-1">Imágenes, videos o documentos</p>
                                </label>

                                {/* Lista de archivos pendientes */}
                                {pendingFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {pendingFiles.length} archivo(s) pendiente(s)
                                        </p>
                                        {pendingFiles.map((pendingFile) => {
                                            const progress = uploadProgress[pendingFile.id]

                                            return (
                                                <div
                                                    key={pendingFile.id}
                                                    className="flex items-center gap-3 border rounded-lg p-3"
                                                >
                                                    {/* Preview de imagen */}
                                                    {pendingFile.preview ? (
                                                        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={pendingFile.preview}
                                                                alt={pendingFile.file.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                                            {getFileTypeIcon(pendingFile.file.type)}
                                                        </div>
                                                    )}

                                                    {/* Info del archivo */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{pendingFile.file.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(pendingFile.file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                        {/* Barra de progreso durante la subida */}
                                                        {progress !== undefined && progress < 100 && (
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded overflow-hidden mt-1">
                                                                <div
                                                                    className="h-1.5 bg-blue-500 transition-all"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Estado y botón eliminar */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {progress !== undefined && progress < 100 && (
                                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                                        )}
                                                        {progress === 100 && (
                                                            <span className="text-xs text-green-500 font-medium">Listo</span>
                                                        )}
                                                        {progress === undefined && (
                                                            <span className="text-xs text-amber-500 font-medium">Pendiente</span>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemovePendingFile(pendingFile.id)}
                                                            disabled={isSubmitting || isUploading}
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl text-muted-foreground">Ubicación</h3>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGetLocation}
                                disabled={isLoadingLocation}
                            >
                                {isLoadingLocation ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <MapPin className="mr-2 h-4 w-4" />
                                )}
                                Usar mi ubicación actual
                            </Button>
                        </div>

                        <div className="relative border rounded-lg overflow-hidden h-[700px]">
                            {/* Overlay if no location */}
                            {!currentLocation && (
                                <div className="absolute inset-0 z-[1000] bg-background/80 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h4 className="text-lg font-semibold">Ubicación no disponible</h4>
                                    <p className="text-muted-foreground max-w-sm">
                                        Haz clic en "Usar mi ubicación actual" o habilita los permisos de ubicación en tu navegador para seleccionar un punto en el mapa.
                                    </p>
                                </div>
                            )}

                            {/* Address Display */}
                            {currentLocation && (
                                <div className="absolute top-4 left-4 right-4 z-[1000]">
                                    <div className="p-3 mx-12 shadow-lg rounded-lg bg-background/95 border backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                            Dirección aproximada
                                        </p>
                                        <p className="text-sm">
                                            {form.watch("ubicacion.direccionAproximada") || "Cargando dirección..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Always render map, default center if no location provided yet (or just keep it unavail in UI) */}
                            <div className="w-full h-full">
                                <MapPicker
                                    lat={currentLocation?.lat}
                                    lng={currentLocation?.lng}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />
                {submitButton}
            </form >
        </Form >
    )
})

IncidenciasForm.displayName = "IncidenciasForm"

export default IncidenciasForm