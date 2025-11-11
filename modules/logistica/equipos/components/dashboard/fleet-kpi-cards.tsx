"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, TrendingUp, Truck } from "lucide-react"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import CountUp from "react-countup"

interface FleetKpiCardProps {
    equipos: Equipo[]
    operationalTrucks: number,
    avgAge: number
}

const FleetKpiCard = ({
    operationalTrucks,
    equipos,
    avgAge,
}: FleetKpiCardProps) => {

    const totalUnits = equipos.length
    const fleetAvailability = Math.round((operationalTrucks / totalUnits) * 100)

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">
                        Unidades totales
                    </CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">
                        <CountUp start={0} end={totalUnits} duration={5} />
                    </div>
                    <p className="text-xs text-muted-foreground">Totalidad de la flota</p>
                </CardContent>
            </Card>

            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">Unidades disponibles</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">
                        <CountUp start={0} end={operationalTrucks} duration={5} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-chart-2">{fleetAvailability}%</span> de la flota
                    </p>
                </CardContent>
            </Card>

            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">Edad promedio de la flota</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">{avgAge.toFixed(2)} Años</div>
                    <p className="text-xs text-muted-foreground">Edad promedio</p>
                </CardContent>
            </Card>

            <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">Alertas</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-card-foreground">0</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-destructive">Se requiere atencion</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default FleetKpiCard