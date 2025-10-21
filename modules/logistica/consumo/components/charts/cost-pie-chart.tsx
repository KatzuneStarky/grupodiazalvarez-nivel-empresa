"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ConsumoData } from "../../types/consumo-data"

interface CostPieChartProps {
    data: ConsumoData[]
}

const COLORS = [
    "hsl(220, 80%, 70%)",
    "hsl(340, 75%, 70%)",
    "hsl(50, 90%, 65%)",
    "hsl(160, 70%, 60%)",
    "hsl(30, 85%, 70%)"
]

const CostPieChart = ({
    data
}: CostPieChartProps) => {
    const truckMap = new Map<string, number>()
    data.forEach((item) => {
        const truckKey = item.equipo?.numEconomico || item.equipoId
        const current = truckMap.get(truckKey) || 0
        truckMap.set(truckKey, current + (item.costoTotal || 0))
    })

    const chartData = Array.from(truckMap.entries())
        .map(([truck, cost]) => ({
            name: truck,
            value: Number.parseFloat(cost.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Costo total por equipo</CardTitle>
                <CardDescription>Top 5 de camiones y su costo total en consumo</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(0, 0%, 100%)",
                                border: "1px solid hsl(210, 15%, 30%)",
                                borderRadius: "0.375rem",
                                color: "hsl(0, 0%, 100%)",
                                padding: "0.5rem 0.75rem",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                            }}
                            labelStyle={{ color: "hsl(0, 0%, 100%)" }}
                            cursor={{ stroke: "hsl(200, 50%, 50%)", strokeWidth: 2 }}
                            formatter={(value: number) => `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default CostPieChart