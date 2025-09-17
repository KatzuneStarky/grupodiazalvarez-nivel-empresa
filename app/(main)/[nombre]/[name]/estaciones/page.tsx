"use client"

import DashboardCharts from "@/modules/logistica/estaciones/components/dashboard-charts"
import DashboardStats from "@/modules/logistica/estaciones/components/dashboard-stats"
import { useEstaciones } from "@/modules/logistica/estaciones/hooks/use-estaciones"
import { Separator } from "@/components/ui/separator"

const EstacionesPage = () => {
    const { estaciones } = useEstaciones()

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-foreground text-balance">Dashboard de Estaciones de Servicio</h1>
                <p className="text-muted-foreground text-pretty">
                    Gestión y monitoreo de estaciones de combustible en tiempo real
                </p>
            </div>
            <Separator />
            <DashboardStats estaciones={estaciones} />
            <DashboardCharts estaciones={estaciones} />
        </div>
    )
}

export default EstacionesPage