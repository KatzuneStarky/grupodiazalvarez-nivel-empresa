"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { TrendingUp } from "lucide-react"

interface MaintenanceTrendChartProps {
    data: {
        month: string;
        completados: number;
        pendientes: number;
    }[];
}

const MaintenanceTrendChart = ({ data }: MaintenanceTrendChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Tendencia de Mantenimientos
                </CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                        No hay datos históricos disponibles
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCompletados" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--popover-foreground))'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completados"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCompletados)"
                                    name="Completados"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pendientes"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPendientes)"
                                    name="Pendientes"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded" style={{ backgroundColor: '#10b981' }} />
                                <span className="text-muted-foreground">Completados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
                                <span className="text-muted-foreground">Pendientes</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default MaintenanceTrendChart
