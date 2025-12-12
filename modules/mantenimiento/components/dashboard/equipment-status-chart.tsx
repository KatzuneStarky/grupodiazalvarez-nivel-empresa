"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Truck } from "lucide-react"

interface EquipmentStatusChartProps {
    data: {
        status: string;
        count: number;
        color: string;
    }[];
}

const EquipmentStatusChart = ({ data }: EquipmentStatusChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Estado de Equipos
                </CardTitle>
                <CardDescription>Distribución por estado operativo</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                        No hay datos de equipos disponibles
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data} layout="vertical">
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                                <YAxis dataKey="status" type="category" tick={{ fontSize: 11, fill: '#d1d5db' }} stroke="#6b7280" width={100} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--popover-foreground))'
                                    }}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Equipos">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {data.map((item) => (
                                <div key={item.status} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                    <span className="text-xs font-medium">{item.status}</span>
                                    <span className="text-sm font-bold">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default EquipmentStatusChart
