"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface MechanicWorkloadProps {
    data: {
        name: string;
        active: number;
        completed: number;
    }[];
}

const MechanicWorkload = ({ data }: MechanicWorkloadProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Carga de Trabajo de Mecánicos</CardTitle>
                <CardDescription>Trabajos activos vs completados este mes</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                        No hay datos de carga de trabajo disponibles
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data}>
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--popover-foreground))'
                                    }}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                />
                                <Bar dataKey="active" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Activos" />
                                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completados" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
                                <span className="text-muted-foreground">Trabajos Activos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded" style={{ backgroundColor: '#10b981' }} />
                                <span className="text-muted-foreground">Completados</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default MechanicWorkload