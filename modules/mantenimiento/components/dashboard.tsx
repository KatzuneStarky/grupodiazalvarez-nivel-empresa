"use client"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import MaintenanceSchedule from "./dashboard/maintenance-schedule"
import ServiceTypeChart from "./dashboard/service-type-chart"
import EquipmentStatusChart from "./dashboard/equipment-status-chart"
import MaintenanceTrendChart from "./dashboard/maintenance-trend-chart"
import TopOperators from "./dashboard/top-operators"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import KpiCards from "./dashboard/kpi-cards"
import { ClipboardList, Users, Wrench } from "lucide-react"
import { useMemo } from "react"
import MechanicWorkload from "./dashboard/mechanic-workload"
import { useMecanicos } from "@/modules/mantenimiento/mecanicos/hooks/use-mecanicos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useAllIncidencias } from "@/modules/mantenimiento/incidencias/hooks/use-all-incidencias"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

const MainDashboardMantenimiento = () => {
    const { equipos } = useEquipos()
    const { mecanicos } = useMecanicos()
    const { incidencias } = useAllIncidencias()
    const { operadores } = useOperadores()

    const mantenimientos = useMemo(() => {
        if (!equipos || equipos.length === 0) return []

        return equipos.flatMap((equipo) => {
            if (!equipo.mantenimiento || equipo.mantenimiento.length === 0) return []

            return equipo.mantenimiento.map(m => ({
                ...m,
                mantenimientoData: m.mantenimientoData ?? [],
                evidencias: m.Evidencia ?? [],
                equipo: equipo
            }))
        }).sort((a, b) => {
            const dateA = a.fecha ? parseFirebaseDate(a.fecha).getTime() : 0
            const dateB = b.fecha ? parseFirebaseDate(b.fecha).getTime() : 0
            return dateB - dateA
        })
    }, [equipos])

    const stats = useMemo(() => {
        const now = new Date()
        const oneWeekFromNow = new Date()
        oneWeekFromNow.setDate(now.getDate() + 7)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        let vencidos = 0
        let proximos = 0
        let completadosMes = 0
        let totalMes = 0
        let enProgreso = 0

        mantenimientos.forEach(m => {
            const fechaMantenimiento = m.fecha ? parseFirebaseDate(m.fecha) : new Date()

            if (m.estado === 'Completado' && fechaMantenimiento >= startOfMonth) {
                completadosMes++
            }
            if (fechaMantenimiento >= startOfMonth) {
                totalMes++
            }
            if (m.estado === 'En Progreso') {
                enProgreso++
            }
            if (m.estado !== 'Completado') {
                if (fechaMantenimiento < now) {
                    vencidos++
                } else if (fechaMantenimiento <= oneWeekFromNow) {
                    proximos++
                }
            }
        })

        const porcentaje = totalMes > 0 ? Math.round((completadosMes / totalMes) * 100) : 0

        return { vencidos, proximos, completadosMes, porcentaje, enProgreso }
    }, [mantenimientos])

    const mechanicStats = useMemo(() => {
        const available = mecanicos.filter(m => m.estado === 'DISPONIBLE').length
        const busy = mecanicos.filter(m => m.estado === 'OCUPADO').length
        return { available, busy }
    }, [mecanicos])

    const operatorStats = useMemo(() => {
        const active = operadores.filter(op => !!op.idEquipo).length
        const total = operadores.length
        return { active, total }
    }, [operadores])

    const recentMaintenance = mantenimientos.slice(0, 5)

    // Recent Incidences (Pending or In Progress first)
    const recentIncidencias = useMemo(() => {
        return [...incidencias]
            .filter(i => i.estado !== 'Resuelta')
            .sort((a, b) => parseFirebaseDate(b.creadtedAt).getTime() - parseFirebaseDate(a.creadtedAt).getTime())
            .slice(0, 5)
    }, [incidencias])

    const tipoMantenimientoData = useMemo(() => {
        const counts = mantenimientos.reduce((acc, m) => {
            const type = m.tipoMantenimiento || "Desconocido"
            acc[type] = (acc[type] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        // Colores vibrantes adaptados para tema oscuro
        const colorPalette = [
            '#10b981', // Emerald-500 - Verde vibrante
            '#3b82f6', // Blue-500 - Azul brillante
            '#f59e0b', // Amber-500 - Naranja/Amarillo
            '#8b5cf6', // Violet-500 - Púrpura
            '#ec4899', // Pink-500 - Rosa
            '#06b6d4', // Cyan-500 - Cian
            '#f97316', // Orange-500 - Naranja
            '#14b8a6', // Teal-500 - Verde azulado
        ]

        return Object.entries(counts).map(([name, value], index) => ({
            name,
            value,
            color: colorPalette[index % colorPalette.length]
        }))
    }, [mantenimientos])

    const mechanicWorkloadData = useMemo(() => {
        const workload = mecanicos.map(mecanico => {
            const assigned = mantenimientos.filter(m => m.mecanicoId === mecanico.id)
            const active = assigned.filter(m => m.estado !== 'Completado').length
            const completed = assigned.filter(m => m.estado === 'Completado').length

            if (active === 0 && completed === 0) return null

            return {
                name: `${mecanico.nombre} ${mecanico.apellidos.charAt(0)}.`,
                active,
                completed
            }
        }).filter(Boolean) as { name: string, active: number, completed: number }[]

        return workload.sort((a, b) => b.active - a.active).slice(0, 10)
    }, [mecanicos, mantenimientos])

    // Equipment Status Data
    const equipmentStatusData = useMemo(() => {
        const statusCounts = equipos.reduce((acc, equipo) => {
            const status = equipo.estado || 'DESCONOCIDO'
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        // Colores específicos por estado
        const getColorForStatus = (status: string) => {
            const statusColors: Record<string, string> = {
                'DISPONIBLE': '#10b981',      // Verde - Disponible
                'EN_SERVICIO': '#3b82f6',     // Azul - En servicio
                'MANTENIMIENTO': '#f59e0b',   // Ámbar - Mantenimiento
                'FUERA_SERVICIO': '#ef4444',  // Rojo - Fuera de servicio
                'REPARACION': '#f97316',      // Naranja - Reparación
                'DESCONOCIDO': '#6b7280',     // Gris - Desconocido
            }
            return statusColors[status] || '#8b5cf6' // Púrpura por defecto
        }

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            color: getColorForStatus(status)
        }))
    }, [equipos])

    // Maintenance Trend Data (last 6 months)
    const maintenanceTrendData = useMemo(() => {
        const months = []
        const now = new Date()

        for (let i = 5; i >= 0; i--) {
            const monthDate = subMonths(now, i)
            const monthStart = startOfMonth(monthDate)
            const monthEnd = endOfMonth(monthDate)

            const monthMaintenances = mantenimientos.filter(m => {
                const mDate = m.fecha ? parseFirebaseDate(m.fecha) : new Date()
                return mDate >= monthStart && mDate <= monthEnd
            })

            months.push({
                month: format(monthDate, 'MMM', { locale: es }),
                completados: monthMaintenances.filter(m => m.estado === 'Completado').length,
                pendientes: monthMaintenances.filter(m => m.estado !== 'Completado').length
            })
        }

        return months
    }, [mantenimientos])

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

            {/* Debug Info - Remove after testing */}
            <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-2">
                <p><strong>Debug Info:</strong></p>
                <p>Equipos: {equipos.length}</p>
                <p>Mantenimientos: {mantenimientos.length}</p>
                <p>Mecánicos: {mecanicos.length}</p>
                <p>Incidencias: {incidencias.length}</p>
                <p>Operadores: {operadores.length}</p>
                <p>Equipos con mantenimiento: {equipos.filter(e => e.mantenimiento && e.mantenimiento.length > 0).length}</p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <KpiCards
                    mantenimientosCompletados={stats.completadosMes}
                    mantenimientosProximos={stats.proximos}
                    mantenimientosVencidos={stats.vencidos}
                    porcentajeCompletados={stats.porcentaje}
                    operadoresDisponibles={operatorStats.active}
                    mecanicosDisponibles={mechanicStats.available}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Maintenance & Trends */}
                <div className="lg:col-span-2 space-y-6">
                    <MaintenanceSchedule maintenanceRecords={recentMaintenance} />

                    {/* Trend Chart */}
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

                {/* Right Column: Charts & Summaries */}
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