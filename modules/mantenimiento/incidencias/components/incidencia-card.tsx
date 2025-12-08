"use client"

import { Calendar, AlertTriangle, MapPin, Gauge, Fuel, Activity, FileText, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Incidencia } from "../types/incidencias"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface IncidenciaCardProps {
    incidencia: Incidencia
}

const getSeverityColor = (severity: Incidencia['severidad']) => {
    switch (severity) {
        case 'Critica': return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        case 'Alta': return "bg-orange-500 text-white hover:bg-orange-600"
        case 'Media': return "bg-yellow-500 text-white hover:bg-yellow-600"
        case 'Baja': return "bg-green-500 text-white hover:bg-green-600"
        default: return "bg-secondary text-secondary-foreground"
    }
}

const getStatusColor = (estado: Incidencia['estado']) => {
    switch (estado) {
        case 'Reportada': return "border-blue-500 text-blue-500"
        case 'En Revisión': return "border-yellow-500 text-yellow-500"
        case 'En Proceso': return "border-orange-500 text-orange-500"
        case 'Resuelta': return "border-green-500 text-green-500"
        case 'Cancelada': return "border-gray-500 text-gray-500"
        default: return "border-border"
    }
}

export const IncidenciaCard = ({ incidencia }: IncidenciaCardProps) => {
    const fecha = parseFirebaseDate(incidencia.fecha)

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-semibold text-primary">
                                {incidencia.tipo}
                            </Badge>
                            {incidencia.categoria && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {incidencia.categoria}
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-base font-medium line-clamp-1">
                            {incidencia.descripcion}
                        </CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge className={cn("capitalize px-2 py-0.5 text-xs font-semibold shadow-none", getSeverityColor(incidencia.severidad))}>
                            {incidencia.severidad}
                        </Badge>
                        <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-xs border-2", getStatusColor(incidencia.estado))}>
                            {incidencia.estado}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3 text-sm space-y-4">
                {/* Location & Time Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{format(fecha, "PPP p", { locale: es })}</span>
                    </div>
                    {incidencia.ubicacion?.direccionAproximada && (
                        <div className="flex items-center gap-2" title={incidencia.ubicacion.direccionAproximada}>
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">{incidencia.ubicacion.direccionAproximada}</span>
                        </div>
                    )}
                </div>

                {/* Telemetry Data */}
                <div className="flex gap-4 p-2 bg-secondary/10 rounded-md border border-dashed flex-wrap">
                    {incidencia.kmActual && (
                        <div className="flex items-center gap-2 min-w-[100px]" title="Kilometraje">
                            <Gauge className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{incidencia.kmActual.toLocaleString()} km</span>
                        </div>
                    )}
                    {incidencia.nivelCombustible && (
                        <div className="flex items-center gap-2 min-w-[100px]" title="Combustible">
                            <Fuel className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{incidencia.nivelCombustible}%</span>
                        </div>
                    )}
                    {incidencia.velocidadAprox !== undefined && (
                        <div className="flex items-center gap-2 min-w-[100px]" title="Velocidad Aprox">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{incidencia.velocidadAprox} km/h</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className={cn(
                            "flex items-center gap-1.5 font-medium",
                            incidencia.operable ? "text-green-600" : "text-destructive"
                        )}>
                            {incidencia.operable ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                                <XCircle className="h-3.5 w-3.5" />
                            )}
                            {incidencia.operable ? "Operable" : "Inoperable"}
                        </span>
                    </div>
                    {incidencia.evidencias && incidencia.evidencias.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{incidencia.evidencias.length} evidencias</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Actualizado hace un momento</span>
                </div>
            </CardFooter>
        </Card>
    )
}
