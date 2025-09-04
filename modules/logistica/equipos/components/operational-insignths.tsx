"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { estadoColores } from "../constants/colores-estado"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { Activity, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OperationalInsightsProps {
    fleetData: Equipo[]
}

const chartConfig = {
    estado: {
        label: "Estado",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card py-2 px-4 rounded-2xl shadow-xl">
                <p className="uppercase font-extrabold">{`${label}`}</p>
                <div className="flex items-center">
                    <div className={`w-4 h-4 mr-1`} style={{ background: estadoColores[label as EstadoEquipos] }} />
                    <p className="font-bold uppercase">Cantidad de equipos: </p>
                    <p className="ml-1">{`${payload[0].value}`}</p>
                </div>
            </div>
        );
    }
    return null;
}

const OperationalInsights = ({ fleetData }: OperationalInsightsProps) => {
    const estadoChartData = [
        { estado: EstadoEquipos.DISPONIBLE, cantidad: fleetData.filter((e) => e.estado === EstadoEquipos.DISPONIBLE).length },
        { estado: EstadoEquipos.DISPONIBLE_CON_DETALLES, cantidad: fleetData.filter((e) => e.estado === EstadoEquipos.DISPONIBLE_CON_DETALLES).length },
        { estado: EstadoEquipos.EN_VIAJE, cantidad: fleetData.filter((e) => e.estado === EstadoEquipos.EN_VIAJE).length },
        { estado: EstadoEquipos.EN_TALLER, cantidad: fleetData.filter((e) => e.estado === EstadoEquipos.EN_TALLER).length },
        { estado: EstadoEquipos.FUERA_DE_SERVICIO, cantidad: fleetData.filter((e) => e.estado === EstadoEquipos.FUERA_DE_SERVICIO).length },
    ];

    const alerts = [
        {
            id: 1,
            type: "maintenance",
            message: "GT-002 requiere mantenimiento preventivo",
            priority: "medium",
            time: "hace 15 min",
        },
        { id: 2, type: "route", message: "Congestión detectada en Ruta Este-Oeste", priority: "low", time: "hace 32 min" },
        { id: 3, type: "fuel", message: "GT-007 combustible bajo (15%)", priority: "high", time: "hace 45 min" },
        {
            id: 4,
            type: "delivery",
            message: "Entrega completada - Cliente satisfecho",
            priority: "info",
            time: "hace 1 hora",
        },
        { id: 5, type: "weather", message: "Alerta meteorológica - Zona Sur", priority: "medium", time: "hace 2 horas" },
    ]

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-700 border-red-200"
            case "medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "low":
                return "bg-blue-100 text-blue-700 border-blue-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "maintenance":
                return "🔧"
            case "route":
                return "🛣️"
            case "fuel":
                return "⛽"
            case "delivery":
                return "📦"
            case "weather":
                return "🌤️"
            default:
                return "ℹ️"
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Actividad en Tiempo Real
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={estadoChartData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="estado" type="category" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="cantidad" name="Cantidad de equipos">
                                    {estadoChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={estadoColores[entry.estado]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                            <div className={`text-2xl font-bold text-[#28a745]`}>
                                {estadoChartData[0].cantidad}
                            </div>
                            <div className="text-xs text-muted-foreground">Activos Ahora</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#ffc107]">
                                {estadoChartData[3].cantidad}
                            </div>
                            <div className="text-xs text-muted-foreground">En Mantenimiento</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#dc3545]">
                                {estadoChartData[4].cantidad}
                            </div>
                            <div className="text-xs text-muted-foreground">Inactivos</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Alertas en Vivo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex flex-col items-center justify-between w-full h-full">
                    <div className="h-full overflow-y-auto space-y-2 w-full">
                        {alerts.map((alert) => (
                            <div key={alert.id} className={`p-2 rounded-lg border text-xs ${getPriorityColor(alert.priority)}`}>
                                <div className="flex items-start gap-2">
                                    <span className="text-sm">{getAlertIcon(alert.type)}</span>
                                    <div className="flex-1">
                                        <div className="font-medium">{alert.message}</div>
                                        <div className="text-xs opacity-70 mt-1">{alert.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-2 border-t text-center w-full">
                        <Badge variant="outline" className="text-xs">
                            5 alertas activas
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OperationalInsights