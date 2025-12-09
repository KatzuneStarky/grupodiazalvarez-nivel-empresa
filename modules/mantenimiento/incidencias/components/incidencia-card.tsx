"use client"

import { Calendar, MapPin, AlertCircle, Wrench, Zap, Settings, User, Truck, Tag, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Incidencia } from "../types/incidencias"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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
    const tipoIcon = tipoIcons[incidencia.tipo] || tipoIcons.default
    const fecha = parseFirebaseDate(incidencia.fecha)

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-muted flex-shrink-0">{tipoIcon}</div>
                        <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg leading-tight">{incidencia.tipo}</h3>
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
                <p className="text-sm text-muted-foreground w-full truncate">ID: {incidencia.id}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{incidencia.descripcion}</p>

                <div className="flex flex-col items-start gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                            <span className="font-medium text-foreground">Operador:</span> {nombre}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                            <span className="font-medium text-foreground">Equipo:</span> {numEconomico}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{format(fecha, "PPP", { locale: es })}</span>
                    </div>
                </div>

                {incidencia.categoria && (
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                            {incidencia.categoria}
                        </Badge>
                    </div>
                )}

                {incidencia.ubicacion && (
                    <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Ubicación</span>
                        </div>
                        {incidencia.ubicacion.direccionAproximada ? (
                            <p className="text-sm text-muted-foreground pl-6">{incidencia.ubicacion.direccionAproximada}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground pl-6">
                                {incidencia.ubicacion.latitud.toFixed(4)}, {incidencia.ubicacion.longitud.toFixed(4)}
                            </p>
                        )}
                        <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center border">
                            <div className="text-center text-muted-foreground">
                                <MapPin className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-xs">Vista previa del mapa</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                    <div
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md",
                            incidencia.operable
                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                : "bg-red-500/10 text-red-700 dark:text-red-400",
                        )}
                    >
                        <div className={cn("h-2 w-2 rounded-full", incidencia.operable ? "bg-green-500" : "bg-red-500")} />
                        <span className="font-medium">{incidencia.operable ? "Operable" : "No Operable"}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t bg-muted/30">
                <Button variant="default" className="w-full group">
                    Ver incidencia
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </CardFooter>
        </Card>
    )
}
