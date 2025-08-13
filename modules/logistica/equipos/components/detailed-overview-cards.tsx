"use client"

import { getMaintenanceUrgency } from "../../utils/get-maintenance-urgency"
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { getDaysUntilExpiry } from "../../utils/documents-expiricy"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, DollarSign, Fuel, Truck, Wrench } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const DetailedOverviewCards = ({
    equipos
}: {
    equipos: Equipo[]
}) => {
    const activeTrucks = equipos.filter((truck) => truck.activo).length
    const inactiveTrucks = equipos.filter((truck) => !truck.activo).length
    const operationalTrucks = equipos.filter((truck) => truck.estado === EstadoEquipos.DISPONIBLE).length
    const maintenanceTrucks = equipos.filter((truck) => truck.estado === EstadoEquipos.EN_TALLER).length
    const outOfServiceTrucks = equipos.filter((truck) => truck.estado === EstadoEquipos.FUERA_DE_SERVICIO).length

    const getSafeMaintenanceDate = (truck: Equipo) => {
        return truck.mantenimiento?.[0]?.fecha || null;
    };

    const getSafeDocuments = (truck: Equipo) => {
        return [
            ...(truck.Certificado || []),
            ...(truck.ArchivosVencimiento || []),
            ...(truck.archivos || [])
        ];
    };

    const overdueMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) === "overdue" :
            true;
    }).length;

    const dueMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) === "due" :
            false;
    }).length;

    const upcomingMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) === "upcoming" :
            false;
    }).length;

    const allDocs = equipos.flatMap(truck => getSafeDocuments(truck));
    const expiredDocs = allDocs.filter(doc => doc?.createAt && getDaysUntilExpiry(doc.createAt) < 0);
    const criticalDocs = allDocs.filter(doc => {
        if (!doc?.createAt) return false;
        const days = getDaysUntilExpiry(doc.createAt);
        return days >= 0 && days <= 7;
    });
    const warningDocs = allDocs.filter(doc => {
        if (!doc?.createAt) return false;
        const days = getDaysUntilExpiry(doc.createAt);
        return days > 7 && days <= 30;
    });

    const totalCapacity = equipos.reduce((sum, truck) => sum + (truck.m3 || 0), 0)
    const avgCapacity = totalCapacity / equipos.length
    const operationalCapacity = equipos
        .filter((truck) => truck.estado === EstadoEquipos.DISPONIBLE)
        .reduce((sum, truck) => sum + (truck.m3 || 0), 0)

    const currentYear = new Date().getFullYear()
    const avgAge = equipos.reduce((sum, truck) => sum + (currentYear - truck.year), 0) / equipos.length
    const newTrucks = equipos.filter((truck) => currentYear - truck.year <= 2).length
    const oldTrucks = equipos.filter((truck) => currentYear - truck.year > 10).length

    const compliancePercentage = Math.round(((allDocs.length - expiredDocs.length) / allDocs.length) * 100)
    const maintenanceCompliance = Math.round(((equipos.length - overdueMaintenance) / equipos.length) * 100)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Estado General de la Flota
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Operativo</span>
                                <span className="font-medium text-green-600">{operationalTrucks}</span>
                            </div>
                            <Progress value={(operationalTrucks / equipos.length) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Mantenimiento</span>
                                <span className="font-medium text-yellow-600">{maintenanceTrucks}</span>
                            </div>
                            <Progress value={(maintenanceTrucks / equipos.length) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Fuera de Servicio</span>
                                <span className="font-medium text-red-600">{outOfServiceTrucks}</span>
                            </div>
                            <Progress value={(outOfServiceTrucks / equipos.length) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Inactivo</span>
                                <span className="font-medium text-gray-600">{inactiveTrucks}</span>
                            </div>
                            <Progress value={(inactiveTrucks / equipos.length) * 100} className="h-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{equipos.length}</div>
                            <div className="text-xs text-muted-foreground">Total Unidades</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {Math.round((operationalTrucks / equipos.length) * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Disponibilidad</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{avgAge.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">Edad Promedio</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Mantenimiento Detallado
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Vencido</span>
                            <Badge variant="destructive" className="text-xs">
                                {overdueMaintenance}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Próximo (7 días)</span>
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                {dueMaintenance}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Programado</span>
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                                {upcomingMaintenance}
                            </Badge>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Cumplimiento</span>
                            <span className={`text-lg font-bold ${maintenanceCompliance >= 80 ? "text-green-600" : "text-red-600"}`}>
                                {maintenanceCompliance}%
                            </span>
                        </div>
                        <Progress value={maintenanceCompliance} className="h-2 mt-1" />
                    </div>
                    <div className="text-xs text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Cumplimiento Documental
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Vencidos</span>
                            <Badge variant="destructive" className="text-xs">
                                {expiredDocs.length}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Críticos (7 días)</span>
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                {criticalDocs.length}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Advertencia (30 días)</span>
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                                {warningDocs.length}
                            </Badge>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Cumplimiento</span>
                            <span className={`text-lg font-bold ${compliancePercentage >= 90 ? "text-green-600" : "text-red-600"}`}>
                                {0}%
                            </span>
                        </div>
                        <Progress value={compliancePercentage} className="h-2 mt-1" />
                    </div>
                    <div className="text-xs text-muted-foreground">Total documentos: {allDocs.length}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Fuel className="h-5 w-5" />
                        Análisis de Capacidad
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <div className="text-muted-foreground">Capacidad Total</div>
                            <div className="font-bold text-blue-600">{(totalCapacity / 1000).toFixed(0)}K L</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Promedio</div>
                            <div className="font-bold text-green-600">{(avgCapacity / 1000).toFixed(1)}K L</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Operativa</div>
                            <div className="font-bold text-purple-600">{(operationalCapacity / 1000).toFixed(0)}K L</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Utilización</div>
                            <div className="font-bold text-orange-600">
                                {Math.round((operationalCapacity / totalCapacity) * 100)}%
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <Progress value={(operationalCapacity / totalCapacity) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">Capacidad operativa vs total</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Distribución por Edad
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <div className="text-muted-foreground">Nuevos (&lt;=2 años)</div>
                            <div className="font-bold text-green-600">{newTrucks}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Antiguos (&gt;10 años)</div>
                            <div className="font-bold text-red-600">{oldTrucks}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span>Flota Nueva</span>
                            <span>{Math.round((newTrucks / equipos.length) * 100)}%</span>
                        </div>
                        <Progress value={(newTrucks / equipos.length) * 100} className="h-2" />
                    </div>
                    <div className="text-center pt-2 border-t">
                        <div className="text-lg font-bold text-blue-600">{avgAge.toFixed(1)} años</div>
                        <div className="text-xs text-muted-foreground">Edad promedio de la flota</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Resumen de Costos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Mantenimiento Mensual</span>
                            <span className="font-bold text-blue-600">$285,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Costo por Unidad</span>
                            <span className="font-bold text-green-600">$71,250</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Costo por km</span>
                            <span className="font-bold text-purple-600">$2.45</span>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Eficiencia vs Meta</span>
                            <Badge variant="outline" className="text-green-600">
                                +5.2%
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Reducción de costos este mes</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Métricas de Seguridad
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">45</div>
                        <div className="text-sm text-muted-foreground">Días sin incidentes</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <div className="text-muted-foreground">Incidentes YTD</div>
                            <div className="font-bold text-yellow-600">3</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Meta Anual</div>
                            <div className="font-bold text-blue-600">≤5</div>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Cumplimiento Seguridad</span>
                            <span className="text-lg font-bold text-green-600">98%</span>
                        </div>
                        <Progress value={98} className="h-2 mt-1" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DetailedOverviewCards