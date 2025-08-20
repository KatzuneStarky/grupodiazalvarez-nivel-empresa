"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDahboardLogisticaPerformanceChartData } from "../hooks/use-dashboard-logistica-performance-chart-data"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis } from "recharts"
import { formatCurrency } from "@/utils/format-currency"
import ChartDatePicker from "@/components/custom/chart-date-picker"
import { formatNumber } from "@/utils/format-number"

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
                    {startDate && endDate && (
                        <strong>Fecha seleccionada: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}</strong>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <ChartDatePicker
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                        />
                    </div>
                    <div className="border-2 border-solid border-gray-700 rounded-lg p-4">
                        <ChartContainer
                            config={chartConfig}
                            className="w-full h-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{ top: 20 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="Cliente"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 10)}
                                />
                                <Tooltip
                                    cursor={true}
                                    content={({ payload }) => {
                                        if (payload && payload.length) {
                                            const { Cliente, Flete } = payload[0].payload;
                                            return (
                                                <div style={{ padding: "10px", backgroundColor: "#FFF", color: "#000" }}>
                                                    <strong>Cliente: {Cliente}</strong><br />
                                                    <strong>Total Flete: {formatCurrency(Flete)}</strong>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="Flete"
                                    radius={8}
                                >
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                    <div className="border-2 border-solid border-gray-700 rounded-lg p-4">
                        <ChartContainer config={chartConfig2} className="h-full w-full">
                            <BarChart
                                accessibilityLayer
                                data={chartData2}
                                margin={{
                                    top: 20,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="Cliente"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 10)}
                                />
                                <Tooltip
                                    cursor={true}
                                    content={({ payload }) => {
                                        if (payload && payload.length) {
                                            const { Cliente, M3 } = payload[0].payload;
                                            return (
                                                <div style={{ padding: "10px", backgroundColor: "#FFF", color: "#000" }}>
                                                    <strong>Cliente: {Cliente}</strong><br />
                                                    <strong>Total M3: {formatNumber(M3)}</strong>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="M3"
                                    radius={8}
                                >
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                        formatter={(value: number) => formatNumber(value)}
                                    />
                                    {chartData2.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}

                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MainChartPerformance