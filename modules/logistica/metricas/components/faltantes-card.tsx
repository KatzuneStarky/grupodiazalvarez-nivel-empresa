"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClienteViajes1 } from "../../reportes-viajes/hooks/use-faltantes-data"
import { getClientBorderColor } from "../constants/client-border-color"
import { getClientTextColor } from "../constants/client-text-color"
import { CustomFaltantesTooltip } from "./custom-faltantes-tooltip"

const FaltantesCard = ({
    searchDescripcion,
    clienteViajes,
}: {
    clienteViajes: ClienteViajes1,
    searchDescripcion: string,
}) => {
    const clienteColor = getClientTextColor(clienteViajes.Cliente);
    const clienteBorder = getClientBorderColor(clienteViajes.Cliente);

    return (
        <div className="space-y-4">
            <h2 className={`mb-6 text-4xl font-extrabold my-12 ${clienteColor}`}>{clienteViajes.Cliente}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {clienteViajes.DescripcionesDelViaje.map((descripcion, index) => {
                    const data = [
                        {
                            name: "A 20°",
                            value: descripcion.FALTANTESYOSOBRANTESA20,
                        },
                        {
                            name: "Al Natural",
                            value: descripcion.FALTANTESYOSOBRANTESALNATURAL,
                        },
                    ];

                    return (
                        <Card className={`mb-4 border-4 ${clienteBorder}`}>
                            <CardHeader>
                                <CardTitle>{descripcion.Descripcion}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width={"100%"} height={200}>
                                    <BarChart
                                        layout="vertical"
                                        data={data}
                                        margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                                    >
                                        <CartesianGrid />
                                        <XAxis
                                            type="number"
                                            tickFormatter={(value: number) => `${value.toFixed(2)} m³`}
                                        />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip content={<CustomFaltantesTooltip />} />
                                        <Bar dataKey="value" radius={5}>
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.value >= 0 ? "#35A408" : "#FF0000"}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default FaltantesCard