"use client"

import { AlertTriangle, Calendar, CheckCircle2, Clock, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KpiCardsProps {
    mantenimientosVencidos: number
    mantenimientosProximos: number
    mantenimientosCompletados: number
    mecanicosDisponibles: number
    porcentajeCompletados: number
    operadoresDisponibles: number
}

const KpiCards = ({
    mantenimientosVencidos,
    mantenimientosProximos,
    mantenimientosCompletados,
    mecanicosDisponibles,
    porcentajeCompletados,
    operadoresDisponibles
}: KpiCardsProps) => {
    return (
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-destructive">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Mantenimientos vencidos</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{mantenimientosVencidos}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <Badge variant="destructive" className="text-xs">
                            Critico
                        </Badge>
                        <span className="text-muted-foreground">Requieren atención inmediata</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Vencen en esta semana</CardTitle>
                    <Calendar className="h-5 w-5 text-warning" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{mantenimientosProximos}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                            Próximos
                        </Badge>
                        <span className="text-muted-foreground">Próximos 7 días</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Mantenimientos completados en este mes</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{mantenimientosCompletados}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-success font-medium">{porcentajeCompletados}%</span>
                        <span className="text-muted-foreground">vs último mes</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium">Mecánicos disponibles</CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{mecanicosDisponibles}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{operadoresDisponibles} disponibles</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default KpiCards