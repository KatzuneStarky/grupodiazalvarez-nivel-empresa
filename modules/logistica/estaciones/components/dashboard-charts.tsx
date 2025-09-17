"use client"

import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChartIcon } from "lucide-react"
import { EstacionServicio } from "../types/estacion"
import React from "react"

type CapacityDataItem = {
    estacion: string;
    Magna_actual?: number;
    Magna_restante?: number;
    Premium_actual?: number;
    Premium_restante?: number;
    Diesel_actual?: number;
    Diesel_restante?: number;
};

type FuelKeys = "Magna_actual" | "Magna_restante" | "Premium_actual" | "Premium_restante" | "Diesel_actual" | "Diesel_restante";

const DashboardCharts = ({ estaciones }: { estaciones: EstacionServicio[] }) => {
    const fuels = ["Magna", "Premium", "Diesel"] as const;

    const buildCapacityData = (estaciones: EstacionServicio[]): CapacityDataItem[] => {
        return estaciones.map((estacion) => {
            const data: CapacityDataItem = {
                estacion: estacion.nombre,
                Magna_actual: 0,
                Magna_restante: 0,
                Premium_actual: 0,
                Premium_restante: 0,
                Diesel_actual: 0,
                Diesel_restante: 0,
            };

            fuels.forEach((fuel) => {
                const tanquesFuel = estacion.tanques.filter(
                    (t) => t.tipoCombustible === fuel
                );

                const totalActual = tanquesFuel.reduce(
                    (sum, t) => sum + t.capacidadActual,
                    0
                );
                const totalCapacidad = tanquesFuel.reduce(
                    (sum, t) => sum + t.capacidadTotal,
                    0
                );

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

    const fuelColors: Record<string, { actual: string; restante: string }> = {
        Magna: { actual: "#4CAF50", restante: "#A5D6A7" },
        Premium: { actual: "#F44336", restante: "#EF9A9A" },
        Diesel: { actual: "#2196F3", restante: "#90CAF9" },
    };

    const productCounts = {
        Magna: 0,
        Premium: 0,
        Diesel: 0,
    }

    estaciones.forEach((station) => {
        station.productos?.forEach((product) => {
            if (product in productCounts) {
                productCounts[product as keyof typeof productCounts]++
            }
        })
    })

    const pieData = Object.entries(productCounts).map(([name, value]) => ({
        name,
        value,
        percentage: estaciones.length > 0 ? (value / estaciones.length) * 100 : 0,
    }))

    const COLORS = {
        Magna: "rgb(0,165,81)",
        Premium: "rgb(213,43,30)",
        Diesel: "rgb(55,55,53)",
    }

    const capacityData = buildCapacityData(estaciones);
    console.log(capacityData);

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
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={capacityData} margin={{ bottom: 80 }}>
                                <XAxis
                                    dataKey="estacion"
                                    fontSize={12}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip />
                                <Legend />

                                {fuels.map((fuel) => (
                                    <React.Fragment key={fuel}>
                                        {/* Capacidad actual */}
                                        <Bar
                                            dataKey={`${fuel}_actual`}
                                            stackId={fuel} // 👈 cada combustible tiene su propio stack
                                            name={`${fuel} (Actual)`}
                                        >
                                            {capacityData.map((_, idx) => (
                                                <Cell
                                                    key={`cell-${fuel}-actual-${idx}`}
                                                    fill={fuelColors[fuel].actual}
                                                />
                                            ))}
                                        </Bar>

                                        {/* Capacidad restante */}
                                        <Bar
                                            dataKey={`${fuel}_restante`}
                                            stackId={fuel} // 👈 se apila junto al actual del mismo combustible
                                            name={`${fuel} (Disponible)`}
                                        >
                                            {capacityData.map((_, idx) => (
                                                <Cell
                                                    key={`cell-${fuel}-restante-${idx}`}
                                                    fill={fuelColors[fuel].restante}
                                                />
                                            ))}
                                        </Bar>
                                    </React.Fragment>
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value} estaciones`, "Cantidad"]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {Object.entries(productCounts).map(([product, count]) => (
                            <div key={product} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[product as keyof typeof COLORS] }}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {product}: {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardCharts