"use client"

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { ConsumoData } from "../../types/consumo-data"

interface EfficiencyLineChartProps {
    data: ConsumoData[]
}

const EfficencyLineChart = ({
    data
}: EfficiencyLineChartProps) => {
    const chartData = data
        .filter((item) => item.rendimientoKmL && item.rendimientoKmL > 0)
        .sort((a, b) => {
            const dateA = parseFirebaseDate(a.fecha)
            const dateB = parseFirebaseDate(b.fecha)
            return dateA.getTime() - dateB.getTime()
        })
        .map((item) => ({
            date:
                parseFirebaseDate(item.fecha).toLocaleDateString("es-MX", { month: "short", day: "numeric" }),
            efficiency: Number.parseFloat((item.rendimientoKmL || 0).toFixed(2)),
            truck: item.equipo?.numEconomico || item.equipoId,
        }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Eficiencia de consumo</CardTitle>
                <CardDescription>Grafica de eficiencia por consumo (km/L)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(0, 0%, 100%)" }} />
                        <YAxis tick={{ fill: "hsl(0, 0%, 100%)" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(0, 0%, 0%)",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                            labelStyle={{ color: "hsl(0, 0%, 100%)" }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="efficiency"
                            stroke="hsl(0, 0%, 100%)"
                            strokeWidth={2}
                            name="Eficiencia (km/L)"
                            dot={{ fill: "hsl(0, 100%, 50%)", r: 6 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default EfficencyLineChart