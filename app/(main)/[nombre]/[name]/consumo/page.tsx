"use client"

import { calculateTruckRanking } from "@/modules/logistica/consumo/functions/calculate-truck-ranking"
import PerformanceRanking from "@/modules/logistica/consumo/components/performance-ranking"
import MetricCard from "@/modules/logistica/consumo/components/metric-card"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { calculateTrend } from "@/functions/calculate-trend"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import Icon from "@/components/global/icon"
import { useMemo, useState } from "react"

const ConsumoPage = () => {
    const currentMont = getCurrentMonthCapitalized()
    
    const [mes, setMes] = useState<string>(currentMont)
    const rankings = useMemo(() => calculateTruckRanking([]), [])
    
    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Consumo"
                description="Gestine y administre el consumo de la flota"
                icon={
                    <Icon iconName="picon:fuel" className="w-12 h-12" />
                }
            />

            <Separator className="my-4" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    title={`Total combustible cargado (${mes})`}
                    value={3500}
                    icon="picon:fuel"
                    format="decimal"
                    trend={calculateTrend(3500, 5000)}
                    valueType="L"
                />

                <MetricCard
                    title="Distancia total"
                    value={10000}
                    icon="mdi:map-marker-distance"
                    format="number"
                    trend={calculateTrend(0, 0)}
                    valueType="KM/L"
                />

                <MetricCard
                    title="Eficiencia media de combustible"
                    value={150}
                    icon="file-icons:fuelux"
                    trend={calculateTrend(0, 0)}
                />

                <MetricCard
                    title={`Costo total de combustible (${mes})`}
                    value={5000}
                    icon="tdesign:money"
                    format="currency"
                    trend={calculateTrend(0, 0)}
                />
                <MetricCard
                    title="Costo por kilometro"
                    value={100}
                    icon="solar:hand-money-linear"
                    format="currency"
                    trend={calculateTrend(100, 95)}
                />

                <MetricCard
                    title="Consumo promedio de flota"
                    value={100}
                    icon="mdi:speedometer-slow"
                    format="decimal"
                    trend={calculateTrend(0, 0)}
                    valueType="L"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3 mt-4">
                <PerformanceRanking rankings={rankings} />
            </div>
        </div>
    )
}

export default ConsumoPage