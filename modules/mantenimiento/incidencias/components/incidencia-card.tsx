"use client"

import { Calendar, MapPin, AlertCircle, Wrench, Zap, Settings, User, Truck, Tag, ArrowRight, Gauge, Fuel, CheckCircle, XCircle, FileImage, FileVideo, ZoomIn } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Incidencia } from "../types/incidencias"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MapPicker from "@/components/custom/map-picker"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface IncidenciaCardProps {
    incidencia: Incidencia
    numEconomico: string
    nombre: string
}

const severityConfig = {
    Baja: { color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20", icon: "●" },
    Media: { color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20", icon: "●" },
    Alta: { color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20", icon: "●" },
    Critica: { color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20", icon: "●" },
}

const estadoConfig = {
    Reportada: { color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
    "En Revisión": { color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
    "En Proceso": { color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" },
    Resuelta: { color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
    Cancelada: { color: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
}

const tipoIcons: Record<string, React.ReactNode> = {
    Mecanica: <Wrench className="h-4 w-4" />,
    Electrica: <Zap className="h-4 w-4" />,
    Frenos: <AlertCircle className="h-4 w-4" />,
    Motor: <Settings className="h-4 w-4" />,
    default: <Settings className="h-4 w-4" />,
}

export const IncidenciaCard = ({ incidencia, numEconomico, nombre }: IncidenciaCardProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const tipoIcon = tipoIcons[incidencia.tipo] || tipoIcons.default
    const fecha = parseFirebaseDate(incidencia.fecha)

    return (
        <>
            <Dialog>
                <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 rounded-lg bg-muted flex-shrink-0">{tipoIcon}</div>
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-lg leading-tight truncate">{incidencia.tipo}</h3>
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs font-medium border", severityConfig[incidencia.severidad].color)}
                                        >
                                            <span className="mr-1">{severityConfig[incidencia.severidad].icon}</span>
                                            {incidencia.severidad}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn("text-xs font-medium border flex-shrink-0", estadoConfig[incidencia.estado].color)}
                            >
                                {incidencia.estado}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground w-full truncate mt-1">ID: {incidencia.id.slice(0, 8)}...</p>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1">
                        <p className="text-sm text-foreground line-clamp-2 leading-relaxed h-[40px]">{incidencia.descripcion}</p>

                        <div className="flex flex-col items-start gap-2 text-sm bg-muted/30 p-3 rounded-md">
                            <div className="flex items-center gap-2 text-muted-foreground w-full">
                                <User className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate text-xs">
                                    <span className="font-medium text-foreground">Op:</span> {nombre}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground w-full">
                                <Truck className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate text-xs">
                                    <span className="font-medium text-foreground">Eq:</span> {numEconomico}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground w-full">
                                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate text-xs">{format(fecha, "PPP", { locale: es })}</span>
                            </div>
                        </div>

                        {incidencia.ubicacion && (
                            <div className="rounded-lg border overflow-hidden h-32 relative group">
                                <div className="absolute inset-0 z-10 bg-transparent hover:bg-black/5 transition-colors" />
                                <MapPicker
                                    lat={incidencia.ubicacion.latitud}
                                    lng={incidencia.ubicacion.longitud}
                                    className="h-full w-full pointer-events-none"
                                />
                                <div className="absolute bottom-1 right-1 z-20 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border shadow-sm flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {incidencia.ubicacion.latitud.toFixed(4)}, {incidencia.ubicacion.longitud.toFixed(4)}
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="pt-3 border-t bg-muted/30 mt-auto">
                        <DialogTrigger asChild>
                            <Button variant="default" className="w-full group">
                                Ver detalles completos
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </DialogTrigger>
                    </CardFooter>
                </Card>

                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b bg-muted/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={cn("text-xs font-medium border", severityConfig[incidencia.severidad].color)}>
                                {incidencia.severidad}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs font-medium border", estadoConfig[incidencia.estado].color)}>
                                {incidencia.estado}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                                {format(fecha, "PPP p", { locale: es })}
                            </span>
                        </div>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {tipoIcon}
                            {incidencia.tipo} - {incidencia.categoria}
                        </DialogTitle>
                        <p className="text-muted-foreground text-sm">ID: {incidencia.id}</p>
                    </DialogHeader>

                    <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Details */}
                            <div className="space-y-6">
                                <section>
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-primary" />
                                        Descripción
                                    </h4>
                                    <div className="p-4 bg-muted/30 rounded-lg border text-sm leading-relaxed">
                                        {incidencia.descripcion}
                                    </div>
                                </section>

                                <Separator />

                                <section>
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-primary" />
                                        Información del Equipo
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-card rounded-lg border shadow-sm">
                                            <p className="text-xs text-muted-foreground mb-1">Operador</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {nombre}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-card rounded-lg border shadow-sm">
                                            <p className="text-xs text-muted-foreground mb-1">No. Económico</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-muted-foreground" />
                                                {numEconomico}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-card rounded-lg border shadow-sm">
                                            <p className="text-xs text-muted-foreground mb-1">Kilometraje</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <Gauge className="h-4 w-4 text-muted-foreground" />
                                                {incidencia.kmActual ?? "N/A"} km
                                            </p>
                                        </div>
                                        <div className="p-3 bg-card rounded-lg border shadow-sm">
                                            <p className="text-xs text-muted-foreground mb-1">Combustible</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <Fuel className="h-4 w-4 text-muted-foreground" />
                                                {incidencia.nivelCombustible ?? "N/A"} %
                                            </p>
                                        </div>
                                        <div className="p-3 bg-card rounded-lg border shadow-sm col-span-2 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Estado Operativo</p>
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-sm font-medium",
                                                    incidencia.operable
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                )}>
                                                    {incidencia.operable ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                    {incidencia.operable ? "Unidad Operable" : "Unidad No Operable"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Visuals */}
                            <div className="space-y-6">
                                {incidencia.ubicacion && (
                                    <section>
                                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Ubicación
                                        </h4>
                                        <div className="rounded-lg border overflow-hidden shadow-sm">
                                            <MapPicker
                                                lat={incidencia.ubicacion.latitud}
                                                lng={incidencia.ubicacion.longitud}
                                                className="h-[250px]"
                                            />
                                            <div className="p-3 bg-muted/50 border-t flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                {incidencia.ubicacion.direccionAproximada || "Ubicación sin dirección registrada"}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                <section>
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <FileImage className="h-5 w-5 text-primary" />
                                        Evidencia ({incidencia.evidencias?.length || 0})
                                    </h4>
                                    {incidencia.evidencias && incidencia.evidencias.length > 0 ? (
                                        <Carousel className="w-full max-w-full">
                                            <CarouselContent>
                                                {incidencia.evidencias.map((evidencia) => (
                                                    <CarouselItem key={evidencia.id}>
                                                        <div className="p-1">
                                                            <Card
                                                                className="border-0 shadow-none cursor-pointer"
                                                                onClick={() => !evidencia.tipo?.startsWith("video") && setSelectedImage(evidencia.ruta)}
                                                            >
                                                                <CardContent className="flex aspect-video items-center justify-center p-0 rounded-lg overflow-hidden bg-black/5 relative group">
                                                                    {evidencia.tipo?.startsWith("video") ? (
                                                                        <video
                                                                            src={evidencia.ruta}
                                                                            controls
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <img
                                                                                src={evidencia.ruta}
                                                                                alt={evidencia.nombre}
                                                                                className="w-full h-full object-contain"
                                                                            />
                                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-lg transition-opacity" />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <p className="text-xs truncate">{evidencia.nombre}</p>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <div className="flex justify-center gap-2 mt-4">
                                                <CarouselPrevious className="static translate-y-0" />
                                                <CarouselNext className="static translate-y-0" />
                                            </div>
                                        </Carousel>
                                    ) : (
                                        <div className="h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                            <FileImage className="h-10 w-10 mb-2 opacity-50" />
                                            <p>No hay evidencia adjunta</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-[95vw] h-[95vh] p-0 border-none bg-black/95 flex items-center justify-center">
                    <DialogTitle className="sr-only">Imagen Completas</DialogTitle>
                    {selectedImage && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={selectedImage}
                                alt="Evidencia Fullscreen"
                                className="max-w-full max-h-full object-contain"
                            />
                            <Button
                                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
                                size="icon"
                                onClick={() => setSelectedImage(null)}
                            >
                                <XCircle className="h-6 w-6" />
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
