"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMantenimientoDashboardData } from "../hooks/use-mantenimiento-dashboard-data"
import MaintenanceTrendChart from "./dashboard/maintenance-trend-chart"
import EquipmentStatusChart from "./dashboard/equipment-status-chart"
import MaintenanceSchedule from "./dashboard/maintenance-schedule"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import ServiceTypeChart from "./dashboard/service-type-chart"
import MechanicWorkload from "./dashboard/mechanic-workload"
import { ClipboardList, Users, Wrench } from "lucide-react"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import TopOperators from "./dashboard/top-operators"
import { Badge } from "@/components/ui/badge"
import KpiCards from "./dashboard/kpi-cards"

const MainDashboardMantenimiento = () => {
    const {
        tipoMantenimientoData,
        maintenanceTrendData,
        mechanicWorkloadData,
        equipmentStatusData,
        recentMaintenance,
        recentIncidencias,
        equipmentStats,
        mantenimientos,
        operatorStats,
        mechanicStats,
        incidencias,
        trendStats,
        operadores,
        mecanicos,
        ordenes,
        equipos,
        stats,
    } = useMantenimientoDashboardData()

    return (
        <div className="container mx-auto py-6 px-8 space-y-8">
            <PageTitle
                title="Panel de Mantenimiento"
                description="Visión general de operaciones, recursos e incidencias"
                icon={
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Wrench className="w-8 h-8 text-primary" />
                    </div>
                }
            />
            <Separator />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <KpiCards
                    totalEquipos={equipmentStats.total}
                    equiposEnIncidencias={equipmentStats.enIncidencias}
                    equiposEnMantenimiento={equipmentStats.enMantenimiento}
                    equiposEnOrdenes={equipmentStats.enOrdenes}
                    totalMecanicos={mechanicStats.total}
                    mecanicosOcupados={mechanicStats.busy}
                    totalIncidencias={incidencias.filter(i => i.estado !== 'Resuelta').length}
                    totalOrdenesMantenimiento={mantenimientos.filter(m => m.estado === 'Pendiente').length}
                    totalMantenimientos={mantenimientos.length}
                    cambioIncidencias={trendStats.cambioIncidencias}
                    cambioOrdenes={trendStats.cambioOrdenes}
                    cambioMantenimientos={trendStats.cambioMantenimientos}
                    cambioEquiposDisponibles={trendStats.cambioEquiposDisponibles}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <MaintenanceSchedule
                        maintenanceRecords={recentMaintenance}
                        incidencias={incidencias}
                        operadores={operadores}
                        mecanicos={mecanicos}
                        equipos={equipos}
                        ordenes={ordenes}
                    />
                    <MaintenanceTrendChart data={maintenanceTrendData} />

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <ClipboardList className="h-4 w-4" />
                                    Incidencias Recientes
                                </CardTitle>
                                <CardDescription>Pendientes de atención</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentIncidencias.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-4">No hay incidencias pendientes</div>
                                ) : (
                                    recentIncidencias.map(inc => (
                                        <div key={inc.id} className="flex items-start justify-between border-b last:border-0 pb-3 last:pb-0">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none capitalize">{inc.tipo}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {parseFirebaseDate(inc.creadtedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant={inc.severidad === 'Alta' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                {inc.severidad || "Normal"}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                        <MechanicWorkload data={mechanicWorkloadData} />
                    </div>
                </div>

                <div className="space-y-6">
                    <ServiceTypeChart data={tipoMantenimientoData} />

                    <EquipmentStatusChart data={equipmentStatusData} />

                    <TopOperators operadores={operadores} equipos={equipos} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Resumen de Recursos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Equipos Totales</span>
                                <span className="text-lg font-bold">{equipos.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">En Mantenimiento</span>
                                <span className="text-lg font-bold text-orange-500">{stats.enProgreso}</span>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Operadores Activos</span>
                                <Badge variant="outline">{operatorStats.active}/{operatorStats.total}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Mecánicos Disponibles</span>
                                <Badge variant={mechanicStats.available > 0 ? "default" : "destructive"}>
                                    {mechanicStats.available}/{mechanicStats.available + mechanicStats.busy}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Incidencias Activas</span>
                                <Badge variant={recentIncidencias.length > 0 ? "destructive" : "default"}>
                                    {recentIncidencias.length}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default MainDashboardMantenimiento