"use client"

import { Activity, AlertCircle, Calendar, CheckCircle2, FileText, Fuel, Gauge, Info, Package, Shield, TrendingUp, Truck, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface GeneralTabProps {
    equipo: Equipo | null
    isExpiringSoon: (date: Date) => boolean
    isExpired: (date: Date) => boolean
}

const GeneralTab = ({
    equipo,
    isExpiringSoon,
    isExpired
}: GeneralTabProps) => {
    return (
        <TabsContent value="general" className="space-y-4 mt-6">
            <div className="space-y-4">
                {equipo?.rendimientoPromedioKmPorLitro && (
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Activity className="w-6 h-6 text-primary" />
                                Métricas de Rendimiento
                            </CardTitle>
                            <CardDescription>Estadísticas de consumo y eficiencia del vehículo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-5 h-5 text-primary" />
                                        <p className="text-sm font-medium text-muted-foreground">Rendimiento Promedio</p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-bold text-primary">
                                            {equipo?.rendimientoPromedioKmPorLitro.toFixed(2)}
                                        </p>
                                        <span className="text-lg text-muted-foreground">km/L</span>
                                    </div>
                                    <Progress value={65} className="h-2" />
                                    <p className="text-xs text-muted-foreground">65% de eficiencia óptima</p>
                                </div>

                                {equipo?.ultimoConsumo && (
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Fuel className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <p className="text-sm font-medium text-muted-foreground">Último Consumo</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Fecha:</span>
                                                    <span className="font-semibold">{format(parseFirebaseDate(equipo?.ultimoConsumo.fecha), "PPP", { locale: es })}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Litros:</span>
                                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                        {equipo?.ultimoConsumo.litros} L
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Odómetro:</span>
                                                    <span className="font-semibold">{equipo?.ultimoConsumo.odometro.toLocaleString()} km</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                <p className="text-sm font-medium text-muted-foreground">Proyección</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Km recorridos:</span>
                                                    <span className="font-semibold">{equipo?.ultimoConsumo.odometro.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Consumo estimado:</span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                        {(equipo?.ultimoConsumo.odometro / equipo?.rendimientoPromedioKmPorLitro).toFixed(0)} L
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Próximo servicio:</span>
                                                    <span className="font-semibold">
                                                        {/** daysUntilNextMaintenance !== null ? `${daysUntilNextMaintenance} días` : "N/A" */}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-2 gap-4">
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Truck className="w-6 h-6 text-primary" />
                                Información del Vehículo
                            </CardTitle>
                            <CardDescription>Especificaciones técnicas y características</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Identificación
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Package className="w-3.5 h-3.5" />
                                            Marca
                                        </p>
                                        <p className="font-semibold text-lg">{equipo?.marca}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Info className="w-3.5 h-3.5" />
                                            Modelo
                                        </p>
                                        <p className="font-semibold text-lg">{equipo?.modelo}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Año
                                        </p>
                                        <p className="font-semibold text-lg">{equipo?.year}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Truck className="w-3.5 h-3.5" />
                                            Tipo de Unidad
                                        </p>
                                        <Badge variant="secondary" className="font-semibold">
                                            {equipo?.tipoUnidad || "N/A"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Especificaciones Técnicas
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {equipo?.m3 && (
                                        <div className="space-y-1 p-3 rounded-lg bg-muted/50 border">
                                            <p className="text-xs text-muted-foreground">Capacidad</p>
                                            <p className="font-bold text-xl text-primary">{equipo?.m3} m³</p>
                                        </div>
                                    )}
                                    {equipo?.tipoTanque && (
                                        <div className="space-y-1 p-3 rounded-lg bg-muted/50 border">
                                            <p className="text-xs text-muted-foreground">Tipo de Tanque</p>
                                            <p className="font-semibold">{equipo?.tipoTanque}</p>
                                        </div>
                                    )}
                                    {equipo?.serie && (
                                        <div className="space-y-1 p-3 rounded-lg bg-muted/50 border col-span-2">
                                            <p className="text-xs text-muted-foreground">Número de Serie (VIN)</p>
                                            <p className="font-mono font-semibold text-sm">{equipo?.serie}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Registro y Clasificación
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Grupo de Unidad:</span>
                                        <Badge variant="outline" className="font-semibold">
                                            {equipo?.grupoUnidad}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Fecha de Registro:</span>
                                        <span className="font-semibold">{format(parseFirebaseDate(equipo?.createdAt), "PPP", { locale: es })}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Última Actualización:</span>
                                        <span className="font-semibold">{format(parseFirebaseDate(equipo?.updatedAt), "PPP", { locale: es })}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {equipo?.seguro && (
                            <Card className="border-2 border-green-500/20">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        Seguro del Vehículo
                                    </CardTitle>
                                    <CardDescription>Información de la póliza y cobertura</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="grid gap-4">
                                        <div className="flex items-start justify-between p-3 rounded-lg bg-muted/30">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Aseguradora</p>
                                                <p className="font-bold text-lg">{equipo?.seguro.aseguradora}</p>
                                            </div>
                                            <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                                                Activo
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 p-3 rounded-lg bg-muted/30">
                                            <p className="text-xs text-muted-foreground">Número de Póliza</p>
                                            <p className="font-mono font-semibold text-lg">{equipo?.seguro.numeroPoliza}</p>
                                        </div>

                                        {equipo?.seguro.tipoCobertura && (
                                            <div className="space-y-1 p-3 rounded-lg bg-muted/30">
                                                <p className="text-xs text-muted-foreground">Tipo de Cobertura</p>
                                                <Badge variant="secondary" className="font-semibold text-sm">
                                                    {equipo?.seguro.tipoCobertura}
                                                </Badge>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <p className="text-sm font-medium text-muted-foreground">Vigencia de la Póliza</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                                                <p className="text-sm text-muted-foreground mb-1">Válida hasta:</p>
                                                <p className="font-bold text-xl">{format(parseFirebaseDate(equipo?.seguro.vigenciaHasta), "PPP", { locale: es })}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    {isExpired(equipo?.seguro.vigenciaHasta) ? (
                                                        <Badge variant="destructive" className="text-sm">
                                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                                            Póliza Vencida
                                                        </Badge>
                                                    ) : isExpiringSoon(equipo?.seguro.vigenciaHasta) ? (
                                                        <Badge variant="outline" className="text-sm border-yellow-500 bg-yellow-500/10">
                                                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                                            Por vencer en{" "}
                                                            {Math.floor(
                                                                (new Date(equipo?.seguro.vigenciaHasta).getTime() - new Date().getTime()) /
                                                                (1000 * 60 * 60 * 24),
                                                            )}{" "}
                                                            días
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-sm border-green-500 bg-green-500/10">
                                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                            Vigente
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {equipo?.permisoSCT && (
                            <Card className="border-2 border-blue-500/20">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        Permiso SCT
                                    </CardTitle>
                                    <CardDescription>Autorización de transporte federal</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="grid gap-4">
                                        <div className="space-y-1 p-3 rounded-lg bg-muted/30">
                                            <p className="text-xs text-muted-foreground">Número de Permiso</p>
                                            <p className="font-mono font-semibold text-lg">{equipo?.permisoSCT.numero}</p>
                                        </div>

                                        <div className="space-y-1 p-3 rounded-lg bg-muted/30">
                                            <p className="text-xs text-muted-foreground">Tipo de Permiso</p>
                                            <Badge variant="secondary" className="font-semibold text-sm">
                                                {equipo?.permisoSCT.tipo}
                                            </Badge>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <p className="text-sm font-medium text-muted-foreground">Vigencia del Permiso</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                                                <p className="text-sm text-muted-foreground mb-1">Válido hasta:</p>
                                                <p className="font-bold text-xl">{(format(parseFirebaseDate(equipo?.permisoSCT.vigenciaHasta), "PPP", { locale: es }))}</p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    {isExpired(equipo?.permisoSCT.vigenciaHasta) ? (
                                                        <Badge variant="destructive" className="text-sm">
                                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                                            Permiso Vencido
                                                        </Badge>
                                                    ) : isExpiringSoon(equipo?.permisoSCT.vigenciaHasta) ? (
                                                        <Badge variant="outline" className="text-sm border-yellow-500 bg-yellow-500/10">
                                                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                                            Por vencer en{" "}
                                                            {Math.floor(
                                                                (new Date(equipo?.permisoSCT.vigenciaHasta).getTime() - new Date().getTime()) /
                                                                (1000 * 60 * 60 * 24),
                                                            )}{" "}
                                                            días
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-sm border-blue-500 bg-blue-500/10">
                                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                            Vigente
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </TabsContent>
    )
}

export default GeneralTab