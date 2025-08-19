"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDahboardLogisticaPerformanceChartData } from "../hooks/use-dashboard-logistica-performance-chart-data"
import { ChartConfig } from "@/components/ui/chart"

const chartConfig: ChartConfig = {
    M3: {
        label: "Flete",
        color: "hsl(var(--chart-1))",
    },
}

const chartConfig2: ChartConfig = {
    M3: {
        label: "M3",
        color: "hsl(var(--chart-2))",
    },
}

const MainChartPerformance = () => {
    const {
        chartData,
        chartData2,
        colors,
        endDate,
        setEndDate,
        setStartDate,
        startDate
    } = useDahboardLogisticaPerformanceChartData()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Desempeño de estaciones</CardTitle>
                <CardDescription>
                    Se grafica el total de flete obtenido o M³
                    transportados en un rango de fechas seleccionado.
                    <br />
                    <strong>Fecha seleccionada: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}</strong>
                </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    )
}

export default MainChartPerformance