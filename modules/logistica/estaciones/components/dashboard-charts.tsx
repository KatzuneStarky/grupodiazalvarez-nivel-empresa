"use client"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChartIcon } from "lucide-react"
import { EstacionServicio } from "../types/estacion"
import React from "react"

const fuelsConfig = {
    Magna: { actual: "rgb(0,165,81)", restante: "rgb(50 227 135)" },
    Premium: { actual: "rgb(213,43,30)", restante: "rgb(247 82 69)" },
    Diesel: { actual: "rgb(55,55,53)", restante: "rgb(94 94 92)" },
} as const;

type FuelName = keyof typeof fuelsConfig;

type FuelKeys =
    | `${FuelName}_actual`
    | `${FuelName}_restante`;

type CapacityDataItem = {
    estacion: string;
} & {
        [K in FuelKeys]: number;
    };

const productConfig = {
    Magna: { color: "rgb(0,165,81)" },
    Premium: { color: "rgb(213,43,30)" },
    Diesel: { color: "rgb(55,55,53)" },
} as const;

const fuelsConfig2 = {
    Magna: { color: "rgb(0,165,81)" },
    Premium: { color: "rgb(213,43,30)" },
    Diesel: { color: "rgb(55,55,53)" },
} as const;

type ProductName = keyof typeof productConfig;

const DashboardCharts = ({ estaciones }: { estaciones: EstacionServicio[] }) => {
    const buildCapacityData = (estaciones: EstacionServicio[]): CapacityDataItem[] => {
        return estaciones.map((estacion) => {
            const data = {
                estacion: estacion.nombre,
                Magna_actual: 0,
                Magna_restante: 0,
                Premium_actual: 0,
                Premium_restante: 0,
                Diesel_actual: 0,
                Diesel_restante: 0,
            } satisfies CapacityDataItem;

            (Object.keys(fuelsConfig) as FuelName[]).forEach((fuel) => {
                const tanquesFuel = estacion.tanques.filter(
                    (t) => t.tipoCombustible === fuel
                );

                const totalActual = tanquesFuel.reduce((sum, t) => sum + t.capacidadActual, 0);
                const totalCapacidad = tanquesFuel.reduce((sum, t) => sum + t.capacidadTotal, 0);

                if (totalCapacidad > 0) {
                    const keyActual = `${fuel}_actual` as FuelKeys;
                    const keyRestante = `${fuel}_restante` as FuelKeys;

                    data[keyActual] = totalActual;
                    data[keyRestante] = totalCapacidad - totalActual;
                }
            });

            return data;
        });
    };

    const chartConfig: ChartConfig = Object.entries(fuelsConfig).reduce(
        (acc, [fuel, colors]) => {
            acc[`${fuel}_actual`] = {
                label: `${fuel} (Actual)`,
                color: colors.actual,
            };
            acc[`${fuel}_restante`] = {
                label: `${fuel} (Restante)`,
                color: colors.restante,
            };
            return acc;
        },
        {} as ChartConfig
    );

    const buildPieData = (estaciones: EstacionServicio[]) => {
        // Inicializamos contadores en 0
        const counts = { Magna: 0, Premium: 0, Diesel: 0 } as Record<FuelName, number>;

        // Sumamos capacidadActual por tipo de combustible
        estaciones.forEach((station) => {
            station.tanques.forEach((tanque) => {
                const fuel = tanque.tipoCombustible as FuelName;
                if (fuel in counts) {
                    counts[fuel] += tanque.capacidadActual;
                }
            });
        });

        const total = Object.values(counts).reduce((sum, v) => sum + v, 0);

        return (Object.entries(counts) as [FuelName, number][]).map(([name, value]) => ({
            name,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0,
            color: fuelsConfig[name].actual,
        }));
    };

    const capacityData = buildCapacityData(estaciones);
    const pieData = buildPieData(estaciones);
    console.log(pieData);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Capacidad de Tanques por Estación
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ChartContainer config={chartConfig}>
                            <BarChart data={capacityData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="estacion"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent className="w-52 h-fit py-4 px-2" />} />
                                <ChartLegend content={<ChartLegendContent />} className="mt-4" />

                                <Bar dataKey="Magna_actual" stackId="Magna" fill="var(--color-Magna_actual)" />
                                <Bar dataKey="Magna_restante" stackId="Magna" fill="var(--color-Magna_restante)" />

                                <Bar dataKey="Premium_actual" stackId="Premium" fill="var(--color-Premium_actual)" />
                                <Bar dataKey="Premium_restante" stackId="Premium" fill="var(--color-Premium_restante)" />

                                <Bar dataKey="Diesel_actual" stackId="Diesel" fill="var(--color-Diesel_actual)" />
                                <Bar dataKey="Diesel_restante" stackId="Diesel" fill="var(--color-Diesel_restante)" />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5" />
                        Distribución de Productos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value} L`, "Capacidad actual total"]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-center gap-6 mt-4">
                        {pieData.map(({ name, value, color }) => (
                            <div key={name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-sm text-muted-foreground">
                                    {name}: {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default DashboardCharts