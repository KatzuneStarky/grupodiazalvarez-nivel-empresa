"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface ServiceTypeChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
}

const ServiceTypeChart = ({ data }: ServiceTypeChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tipos de mantenimiento</CardTitle>
                <CardDescription>Porcentaje de cada tipo de mantenimiento</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-muted-foreground">{item.name}</span>
                            <span className="ml-auto text-xs font-semibold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ServiceTypeChart