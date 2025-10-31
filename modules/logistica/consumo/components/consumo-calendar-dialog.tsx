"use client"

import { Calendar, DollarSign, FileText, Fuel, Gauge, MapPin, TrendingDown, TrendingUp, Truck, User } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { SelectedEvent } from "../types/consumo"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface ConsumoDetailDialogProps {
    consumo: SelectedEvent | null
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    equipoNombre: string
    operadorNombre: string
    viajeNombre: string
}

const ConsumoCalendarDialog = ({
    consumo,
    open,
    onOpenChange,
    equipoNombre,
    operadorNombre,
    viajeNombre
}: ConsumoDetailDialogProps) => {
    if (!consumo) return null

    const kmInicial = consumo.kmInicial ?? 0
    const kmFinal = consumo.kmFinal ?? 0
    const kmRecorridos = consumo.kmRecorridos ?? 0
    const litrosCargados = consumo.litrosCargados ?? 0
    const rendimientoKmL = consumo.rendimientoKmL ?? 0
    const costoLitro = consumo.costoLitro ?? 0
    const costoTotal = consumo.costoTotal ?? 0

    const isEfficient = rendimientoKmL >= 2.2
    const isInefficient = rendimientoKmL < 1

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <Fuel className="h-6 w-6" />
                                Consumo de combustible
                            </DialogTitle>
                            <DialogDescription>Informe completo del consumo por viaje</DialogDescription>
                        </div>
                        <Badge variant={isEfficient ? "default" : isInefficient ? "destructive" : "secondary"} className="text-sm">
                            {isEfficient ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : isInefficient ? (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            ) : null}
                            {isEfficient ? "Eficiente" : isInefficient ? "Poco eficiente" : "Normal"}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                        <Gauge className="h-12 w-12 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Eficiencia</p>
                            <p className="text-3xl font-bold">{rendimientoKmL.toFixed(2)} km/L</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Informacion basica
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                <Truck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Equipo</p>
                                    <p className="font-semibold">{equipoNombre || "Desconocido"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                <User className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Operador</p>
                                    <p className="font-semibold">{operadorNombre || "Desconocido"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Fecha</p>
                                    <p className="font-semibold">{format(parseFirebaseDate(consumo.fecha), "MMMM dd, yyyy")}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Viaje</p>
                                    <p className="font-semibold">{viajeNombre || "No asignado"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Informacion de kilometraje
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">KM Iniciales</p>
                                <p className="text-xl font-bold">{kmInicial.toFixed(0)} KM</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">KM Finales</p>
                                <p className="text-xl font-bold">{kmFinal.toFixed(0)} KM</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">KM Recorridos</p>
                                <p className="text-xl font-bold text-primary">{kmRecorridos.toFixed(0)} KM</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Fuel className="h-5 w-5" />
                            Informacion del combustible
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Combustible usado</p>
                                <p className="text-xl font-bold">{litrosCargados.toFixed(2)} L</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Rendimiento</p>
                                <p className="text-xl font-bold text-primary">{rendimientoKmL.toFixed(2)} km/L</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Informacion de costo
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Costo por litro</p>
                                <p className="text-xl font-bold flex items-center">
                                    <DollarSign className="h-4 w-4" />
                                    {costoLitro.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Costo total</p>
                                <p className="text-xl font-bold flex items-center text-primary">
                                    <DollarSign className="h-4 w-4" />
                                    {costoTotal.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Costo por KM</p>
                                <p className="text-xl font-bold flex items-center">
                                    <DollarSign className="h-4 w-4" />
                                    {(costoTotal / kmRecorridos || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {consumo.observaciones && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Observaciones</h3>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm">{consumo.observaciones}</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                        <p>Id del consumo: {consumo.id}</p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Creado el: {format(parseFirebaseDate(consumo.createdAt), "MMM dd, yyyy HH:mm", { locale: es })}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Actualizado el: {format(parseFirebaseDate(consumo.updatedAt), "MMM dd, yyyy HH:mm", { locale: es })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ConsumoCalendarDialog