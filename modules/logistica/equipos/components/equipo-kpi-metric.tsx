"use client"

import { getMaintenanceUrgency } from "../../utils/get-maintenance-urgency"
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { getExpiryStatus } from "../../utils/documents-expiricy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/utils/format-number"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Wrench } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface KPIMetricsProps {
    fleetData: Equipo[]
}

const EquipoKpiMetrics = ({ fleetData }: KPIMetricsProps) => {
    const totalFleet = fleetData.length
    const operationalFleet = fleetData.filter((truck) => truck.activo && truck.estado === EstadoEquipos.DISPONIBLE).length
    const fleetAvailability = Math.round((operationalFleet / totalFleet) * 100)

    const overdueMaintenance = fleetData.filter((truck) => {
        const lastMaintenance = truck.mantenimiento[0]?.fecha
        return lastMaintenance ? getMaintenanceUrgency(lastMaintenance) === "overdue" : true
    }).length

    const maintenanceCompliance = Math.round(((totalFleet - overdueMaintenance) / totalFleet) * 100)
    const expiredDocs = fleetData.reduce((acc, truck) => {
        const allDocs = [...truck.Certificado, ...truck.ArchivosVencimiento]
        return acc + allDocs.filter((doc) => getExpiryStatus(doc.fecha) === "expired").length
    }, 0)
    const totalDocs = fleetData.reduce((acc, truck) => {
        return acc + truck.Certificado.length + truck.ArchivosVencimiento.length
    }, 0)    

    const documentCompliance = totalDocs > 0 ? Math.round(((totalDocs - expiredDocs) / totalDocs) * 100) : 0
    
    const kpiData = [
        {
            title: "Disponibilidad de Flota",
            value: fleetAvailability,
            unit: "%",
            target: 85,
            trend: "up",
            change: "+2.3%",
            icon: CheckCircle,
            color: fleetAvailability >= 85 ? "text-green-600" : fleetAvailability >= 70 ? "text-yellow-600" : "text-red-600",
            bgColor: fleetAvailability >= 85 ? "bg-green-900" : fleetAvailability >= 70 ? "bg-yellow-900" : "bg-red-900",
        },
        {
            title: "Cumplimiento Mantenimiento",
            value: maintenanceCompliance,
            unit: "%",
            target: 95,
            trend: maintenanceCompliance >= 95 ? "up" : "down",
            change: maintenanceCompliance >= 95 ? "+1.2%" : "-0.8%",
            icon: Wrench,
            color:
                maintenanceCompliance >= 95
                    ? "text-green-600"
                    : maintenanceCompliance >= 80
                        ? "text-yellow-600"
                        : "text-red-600",
            bgColor: maintenanceCompliance >= 95 ? "bg-green-900" : maintenanceCompliance >= 80 ? "bg-yellow-900" : "bg-red-900",
        },
        {
            title: "Cumplimiento Documentos",
            value: documentCompliance,
            unit: "%",
            target: 100,
            trend: documentCompliance >= 95 ? "up" : "down",
            change: documentCompliance >= 95 ? "+0.5%" : "-2.1%",
            icon: AlertTriangle,
            color:
                documentCompliance >= 95 ? "text-green-600" : documentCompliance >= 80 ? "text-yellow-600" : "text-red-600",
            bgColor: documentCompliance >= 95 ? "bg-green-900" : documentCompliance >= 80 ? "bg-yellow-900" : "bg-red-900",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kpiData.map((kpi, index) => {
                const progress = Math.min((kpi.value / kpi.target) * 100, 100)
                const Icon = kpi.icon

                return (
                    <Card key={index} className={kpi.bgColor}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <Icon className={`h-4 w-4`} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <div className={`text-2xl font-bold ${kpi.color}`}>
                                    {formatNumber(kpi.value)}
                                    {kpi.unit && <span className="text-sm font-normal ml-1">{kpi.unit}</span>}
                                </div>
                                <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="text-xs">
                                    {kpi.trend === "up" ? (
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                    )}
                                    {kpi.change}
                                </Badge>
                            </div>

                            <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                        Meta: {formatNumber(kpi.target)}
                                        {kpi.unit}
                                    </span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            {kpi.title === "Disponibilidad de Flota" && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {operationalFleet} de {totalFleet} unidades operativas
                                </div>
                            )}

                            {kpi.title === "Cumplimiento Mantenimiento" && overdueMaintenance > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {overdueMaintenance} unidad{overdueMaintenance > 1 ? "es" : ""} con mantenimiento vencido
                                </div>
                            )}

                            {kpi.title === "Cumplimiento Documentos" && expiredDocs > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {expiredDocs} documento{expiredDocs > 1 ? "s" : ""} vencido{expiredDocs > 1 ? "s" : ""}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default EquipoKpiMetrics