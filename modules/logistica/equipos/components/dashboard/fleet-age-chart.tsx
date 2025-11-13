"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos";

interface GrupoPorYear {
    rango: string;
    equipos: Equipo[];
}

interface FleetAgeChartProps {
    data: GrupoPorYear[]
}

const FleetAgeChart = ({
    data
}: FleetAgeChartProps) => {
    const chartData = data.map((grupo) => {
        return {
            year: grupo.rango,
            count: grupo.equipos.length
        }
    })


    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-card-foreground">Distribucion de la flota por año</CardTitle>
                <CardDescription>Cantidad de equipos divididos por años</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        count: { label: "Equipos", color: "var(--color-chart-2)" },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={12} />
                            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default FleetAgeChart