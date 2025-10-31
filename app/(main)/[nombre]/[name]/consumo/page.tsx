"use client"

import LowPerformanceTruckCard from "@/modules/logistica/consumo/components/low-performance-truck-card"
import { detectEfficiencyDrops } from "@/modules/logistica/consumo/functions/detect-efficiency-drops"
import { calculateTruckRanking } from "@/modules/logistica/consumo/functions/calculate-truck-ranking"
import EfficencyLineChart from "@/modules/logistica/consumo/components/charts/efficency-line-chart"
import ConsumoAlertsDialog from "@/modules/logistica/consumo/components/consumo-alerts-dialog"
import PerformanceRanking from "@/modules/logistica/consumo/components/performance-ranking"
import CostPieChart from "@/modules/logistica/consumo/components/charts/cost-pie-chart"
import { ConsumoData } from "@/modules/logistica/consumo/types/consumo-data"
import MetricCard from "@/modules/logistica/consumo/components/metric-card"
import { useConsumo } from "@/modules/logistica/consumo/hooks/use-consumo"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { calculateTrend } from "@/functions/calculate-trend"
import SelectMes from "@/components/global/select-mes"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import Icon from "@/components/global/icon"
import { useMemo, useState } from "react"

const ConsumoPage = () => {
    const currentMont = getCurrentMonthCapitalized()
    const { consumo } = useConsumo()

    const [mes, setMes] = useState<string>(currentMont)
    
    const filterConsumo = (consumo: ConsumoData[], mes: string) => {
        return consumo.filter((item) => {
            const fecha = parseFirebaseDate(item.fecha);
            const nombreMes = fecha.toLocaleString("es-MX", { month: "long" });
            const capitalized = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
            return capitalized === mes;
        });
    };
    
    const consumoFiltrado = filterConsumo(consumo ?? [], mes);
    const rankings = useMemo(() => calculateTruckRanking(consumoFiltrado), [consumoFiltrado])
    const alerts = useMemo(() => detectEfficiencyDrops(consumoFiltrado), [consumoFiltrado])
    const consumoTotal = consumoFiltrado?.reduce((acc, curr) => acc + curr.litrosCargados, 0)
    const distanciaTotal = consumoFiltrado?.reduce((acc, curr) => acc + (curr?.kmRecorridos ?? 0), 0)
    const eficienciaMedia = consumoFiltrado?.reduce((acc, curr) => acc + (curr.rendimientoKmL ?? 0), 0) / consumoFiltrado?.length
    const costoTotalCombustible = consumoFiltrado?.reduce((acc, curr) => acc + (curr.costoTotal ?? 0), 0)
    const consumoPromedio = consumoFiltrado?.reduce((acc, curr) => acc + (curr.litrosCargados ?? 0), 0) / consumoFiltrado?.length

    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Consumo"
                description="Gestine y administre el consumo de la flota"
                icon={
                    <Icon iconName="picon:fuel" className="w-12 h-12" />
                }
                hasActions={true}
                actions={
                    <div className="flex items-center gap-2">
                        <SelectMes value={mes} onChange={setMes} />
                        <ConsumoAlertsDialog alerts={alerts} />
                    </div>
                }
            />

            <Separator className="my-4" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    title={`Total consumo (${mes})`}
                    value={consumoTotal ?? 0}
                    icon="picon:fuel"
                    format="decimal"
                    trend={calculateTrend(0, 0)}
                    valueType="L"
                />

                <MetricCard
                    title="Distancia total"
                    value={distanciaTotal ?? 0}
                    icon="mdi:map-marker-distance"
                    format="number"
                    trend={calculateTrend(0, 0)}
                    valueType="KM"
                />

                <MetricCard
                    title="Eficiencia media de combustible"
                    value={eficienciaMedia}
                    icon="file-icons:fuelux"
                    trend={calculateTrend(0, 0)}
                    valueType="KM/L"
                />

                <MetricCard
                    title={`Costo total de combustible (${mes})`}
                    value={costoTotalCombustible}
                    icon="tdesign:money"
                    format="currency"
                    trend={calculateTrend(0, 0)}
                />
                <MetricCard
                    title="Costo por kilometro"
                    value={26.99}
                    icon="solar:hand-money-linear"
                    format="currency"
                    trend={calculateTrend(0, 0)}
                />

                <MetricCard
                    title="Consumo promedio de flota"
                    value={consumoPromedio}
                    icon="mdi:speedometer-slow"
                    format="decimal"
                    trend={calculateTrend(0, 0)}
                    valueType="L"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3 mt-4">
                <PerformanceRanking rankings={rankings} />
                <LowPerformanceTruckCard rankings={rankings} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-4">
                <CostPieChart data={consumoFiltrado || []} />
                <EfficencyLineChart data={consumoFiltrado || []} />
            </div>
        </div>
    )
}

export default ConsumoPage