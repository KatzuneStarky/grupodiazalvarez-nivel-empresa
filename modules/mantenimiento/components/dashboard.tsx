"use client"

import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import MaintenanceSchedule from "./dashboard/maintenance-schedule"
import ServiceTypeChart from "./dashboard/service-type-chart"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import KpiCards from "./dashboard/kpi-cards"
import { Wrench } from "lucide-react"
import { useMemo } from "react"
import MechanicWorkload from "./dashboard/mechanic-workload"

const MainDashboardMantenimiento = () => {
    const { equipos } = useEquipos()

    const mantenimientos = useMemo(() => {
        return equipos.flatMap((equipo) => {
            return (equipo.mantenimiento || []).map(m => ({
                ...m,
                mantenimientoData: m.mantenimientoData ?? [],
                evidencias: m.Evidencia ?? [],
                equipo: equipo ?? null
            }))
        }).sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        })
    }, [equipos])

    const cincoMantenimientos = mantenimientos.slice(0, 5)

    const tipoMantenimiento = useMemo(() => {
        return mantenimientos.reduce((acc, m) => {
            acc[m.tipoMantenimiento || ""] = (acc[m.tipoMantenimiento || ""] || 0) + 1
            return acc
        }, {} as Record<string, number>)
    }, [equipos])


    return (
        <div className="container mx-auto py-6 px-8">
            <PageTitle
                title="Mantenimiento"
                description="Gestion de mantenimientos"
                icon={
                    <Wrench className="w-12 h-12 text-primary" />
                }
            />
            <Separator className="my-4" />

            <KpiCards
                mantenimientosCompletados={0}
                mantenimientosProximos={0}
                mantenimientosVencidos={0}
                porcentajeCompletados={0}
                operadoresDisponibles={0}
                mecanicosDisponibles={0}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <MaintenanceSchedule maintenanceRecords={cincoMantenimientos} />
                    <div className="grid gap-6 md:grid-cols-2">
                        {/**
                         * <ServiceTypeChart data={
                            Object.entries(tipoMantenimiento).map(([name, value]) => ({
                                name,
                                value,
                                color: "hsl(var(--primary))"
                            }))
                        }
                        />
                         */}
                        <MechanicWorkload />
                    </div>
                    {/**
                     * <MaintenanceCostTrends />
                    <RecentMaintenanceActivity />
                     */}
                </div>
            </div>
        </div>
    )
}

export default MainDashboardMantenimiento