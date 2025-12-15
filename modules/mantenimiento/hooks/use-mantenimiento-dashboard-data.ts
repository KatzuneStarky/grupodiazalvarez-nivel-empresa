import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { useAllIncidencias } from "../incidencias/hooks/use-all-incidencias"
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import { useOrdenesMantenimiento } from "./use-ordenes-mantenimiento"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useMecanicos } from "../mecanicos/hooks/use-mecanicos"
import { es } from "date-fns/locale"
import { useMemo } from "react"

export const useMantenimientoDashboardData = () => {
    const { ordenes: ordenesMantenimiento } = useOrdenesMantenimiento()
    const { incidencias } = useAllIncidencias()
    const { operadores } = useOperadores()
    const { mecanicos } = useMecanicos()
    const { equipos } = useEquipos()

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

    const recentMaintenance = mantenimientos.slice(0, 5)

    const stats = useMemo(() => {
        const now = new Date()
        const oneWeekFromNow = new Date()
        oneWeekFromNow.setDate(now.getDate() + 7)
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        let vencidos = 0
        let proximos = 0
        let completadosMes = 0
        let totalMes = 0
        let enProgreso = 0

        mantenimientos.forEach(m => {
            const fechaMantenimiento = m.fecha ? parseFirebaseDate(m.fecha) : new Date()

            if (m.estado === 'Completado' && fechaMantenimiento >= currentMonthStart) {
                completadosMes++
            }
            if (fechaMantenimiento >= currentMonthStart) {
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

        return { vencidos, proximos, completadosMes, porcentaje, enProgreso, currentMonthStart, lastMonthStart, lastMonthEnd }
    }, [mantenimientos])

    const mechanicStats = useMemo(() => {
        const available = mecanicos.filter(m => m.estado === 'DISPONIBLE').length
        const busy = mecanicos.filter(m => m.estado === 'OCUPADO').length
        return { available, busy, total: mecanicos.length }
    }, [mecanicos])

    const operatorStats = useMemo(() => {
        const active = operadores.filter(op => !!op.idEquipo).length
        const total = operadores.length
        return { active, total }
    }, [operadores])

    const equipmentStats = useMemo(() => {
        const equiposConIncidencias = new Set(
            incidencias
                .filter(i => i.estado !== 'Resuelta')
                .map(i => i.equipoId)
        )

        const equiposEnMantenimiento = new Set(
            mantenimientos
                .filter(m => m.estado === 'En Progreso')
                .map(m => m.equipo?.id)
                .filter(Boolean)
        )

        const equiposEnOrdenes = new Set(
            mantenimientos
                .filter(m => m.estado === 'Pendiente')
                .map(m => m.equipo?.id)
                .filter(Boolean)
        )

        return {
            total: equipos.length,
            enIncidencias: equiposConIncidencias.size,
            enMantenimiento: equiposEnMantenimiento.size,
            enOrdenes: equiposEnOrdenes.size
        }
    }, [equipos, incidencias, mantenimientos])

    const trendStats = useMemo(() => {
        const { currentMonthStart, lastMonthStart, lastMonthEnd } = stats

        const incidenciasThisMonth = incidencias.filter(i => {
            const fecha = parseFirebaseDate(i.creadtedAt)
            return fecha >= currentMonthStart
        }).length

        const incidenciasLastMonth = incidencias.filter(i => {
            const fecha = parseFirebaseDate(i.creadtedAt)
            return fecha >= lastMonthStart && fecha <= lastMonthEnd
        }).length

        const cambioIncidencias = incidenciasLastMonth > 0
            ? Math.round(((incidenciasThisMonth - incidenciasLastMonth) / incidenciasLastMonth) * 100)
            : 0

        const mantenimientosThisMonth = mantenimientos.filter(m => {
            const fecha = m.fecha ? parseFirebaseDate(m.fecha) : new Date()
            return fecha >= currentMonthStart
        }).length

        const mantenimientosLastMonth = mantenimientos.filter(m => {
            const fecha = m.fecha ? parseFirebaseDate(m.fecha) : new Date()
            return fecha >= lastMonthStart && fecha <= lastMonthEnd
        }).length

        const cambioMantenimientos = mantenimientosLastMonth > 0
            ? Math.round(((mantenimientosThisMonth - mantenimientosLastMonth) / mantenimientosLastMonth) * 100)
            : 0

        const ordenesThisMonth = mantenimientos.filter(m => {
            const fecha = m.fecha ? parseFirebaseDate(m.fecha) : new Date()
            return fecha >= currentMonthStart && m.estado === 'Pendiente'
        }).length

        const ordenesLastMonth = mantenimientos.filter(m => {
            const fecha = m.fecha ? parseFirebaseDate(m.fecha) : new Date()
            return fecha >= lastMonthStart && fecha <= lastMonthEnd && m.estado === 'Pendiente'
        }).length

        const cambioOrdenes = ordenesLastMonth > 0
            ? Math.round(((ordenesThisMonth - ordenesLastMonth) / ordenesLastMonth) * 100)
            : 0

        return {
            cambioIncidencias,
            cambioMantenimientos,
            cambioOrdenes,
            cambioEquiposDisponibles: 0
        }
    }, [stats, incidencias, mantenimientos])

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

        const colorPalette = [
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#8b5cf6',
            '#ec4899',
            '#06b6d4',
            '#f97316',
            '#14b8a6',
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

    const equipmentStatusData = useMemo(() => {
        const statusCounts = equipos.reduce((acc, equipo) => {
            const status = equipo.estado || 'DESCONOCIDO'
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const getColorForStatus = (status: string) => {
            const statusColors: Record<string, string> = {
                'DISPONIBLE': '#10b981',
                'EN_SERVICIO': '#3b82f6',
                'MANTENIMIENTO': '#f59e0b',
                'FUERA_SERVICIO': '#ef4444',
                'REPARACION': '#f97316',
                'DESCONOCIDO': '#6b7280',
            }
            return statusColors[status] || '#8b5cf6'
        }

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            color: getColorForStatus(status)
        }))
    }, [equipos])

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

    return {
        ordenes: ordenesMantenimiento,
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
        equipos,
        stats,
    }
}