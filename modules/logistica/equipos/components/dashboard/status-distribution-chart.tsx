"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

interface StatusDistributionChartProps {
    disponibleNum: number
    disponibleConDetallesNum: number
    enTallerNum: number
    enViajeNum: number
    fueraDeServicioNum: number
}

const StatusDistributionChart = ({
    disponibleNum,
    disponibleConDetallesNum,
    enTallerNum,
    enViajeNum,
    fueraDeServicioNum,
}: StatusDistributionChartProps) => {
    const data = [
        { name: EstadoEquipos.DISPONIBLE, value: disponibleNum, color: "var(--color-chart-2)" },
        { name: EstadoEquipos.DISPONIBLE_CON_DETALLES, value: disponibleConDetallesNum, color: "var(--color-chart-1)" },
        { name: EstadoEquipos.EN_TALLER, value: enTallerNum, color: "var(--color-chart-4)" },
        { name: EstadoEquipos.EN_VIAJE, value: enViajeNum, color: "var(--color-chart-3)" },
        { name: EstadoEquipos.FUERA_DE_SERVICIO, value: fueraDeServicioNum, color: "var(--color-destructive)" },
    ]

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-card-foreground">Grafica de distribucion de flota por estado</CardTitle>
                <CardDescription>Se divide la cantidad de equipos por estado actual</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        disponible: { label: EstadoEquipos.DISPONIBLE, color: "var(--color-chart-2)" },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default StatusDistributionChart