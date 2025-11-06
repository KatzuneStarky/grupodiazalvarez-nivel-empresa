"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardLogisticaChartData } from "../hooks/use-dashboard-logistica-chart-data";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format-currency";
import { formatNumber } from "@/utils/format-number";

const chartConfig: ChartConfig = {
    totalFlete: {
        label: "Flete Total",
        color: "#2563eb",
    },
}

const chartConfig2: ChartConfig = {
    Total: {
        label: "M3 Total",
        color: "#2563eb",
    },
};

const MainCharts = ({
    year
}: {
    year: number
}) => {
    const currentYear = new Date().getFullYear();
    const { chartDataM3, chartDataFlete } = useDashboardLogisticaChartData(year, currentYear);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Resumen de los datos de ganancias y metros cubicos transportados</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="cubic-meters">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cubic-meters">Metros cubicos</TabsTrigger>
                        <TabsTrigger value="revenue">Ganancias</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cubic-meters">
                        <ChartContainer
                            config={chartConfig2}
                            className="h-[300px] w-full"
                        >
                            <LineChart
                                data={chartDataM3}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="Mes"
                                    tickLine={false}
                                    tickMargin={10}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    axisLine={false} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} />
                                <Tooltip
                                    cursor={false}
                                    content={({ payload }) => {
                                        if (payload && payload.length) {
                                            const { Mes, Total } = payload[0].payload;
                                            return (
                                                <div className="p-4 bg-white border text-black">
                                                    <p><strong>Mes:</strong> {Mes}</p>
                                                    <p><strong>Total M³:</strong> {formatNumber(Total)}M³</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    dataKey="Total"
                                    type="bump"
                                    strokeWidth={2}
                                    dot={true}
                                    fill={chartConfig.totalFlete.color}
                                />
                            </LineChart>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="revenue" className="pt-4 w-full">
                        <ChartContainer
                            config={chartConfig}
                            className="h-[300px] w-full"
                        >
                            <LineChart
                                data={chartDataFlete}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="Mes"
                                    tickLine={true}
                                    axisLine={true}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                                <Tooltip
                                    cursor={true}
                                    content={({ payload }) => {
                                        if (payload && payload.length) {
                                            const { Mes, Total } = payload[0].payload;
                                            return (
                                                <div className="p-4 bg-white border">
                                                    <div className="flex">
                                                        <div className="w-4 h-4 bg-[var(--color-totalFlete)] mr-1" />
                                                        <p className="text-black">
                                                            <span className="font-extrabold">Mes: </span>
                                                            {Mes}
                                                        </p>
                                                    </div>
                                                    <div className="flex mt-1">
                                                        <div className="w-4 h-4 bg-[var(--color-totalFlete)] mr-1" />
                                                        <p className="text-black">
                                                            <span className="font-extrabold">Total Flete: </span>
                                                            {formatCurrency(Total)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Total"
                                    stroke="var(--color-totalFlete)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default MainCharts