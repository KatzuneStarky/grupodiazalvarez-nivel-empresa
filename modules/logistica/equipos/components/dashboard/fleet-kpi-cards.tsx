"use client"

import { AlertTriangle, Ban, Building, CheckCircle2, Timer, TrendingUp, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconExclamationCircle, IconTool } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import CountUp from "react-countup"

interface FleetKpiCardProps {
    convertedGroupSummary: { name: string, value: { total: number, activos: number } }[],
    availableWithIssues: number,
    outOfServiceTrucks: number,
    maintenanceTrucks: number,
    operationalTrucks: number,
    inactiveTrucks: number,
    enViajeTrucks: number,
    activeTrucks: number,
    totalTrucks: number,
    newTrucks: number,
    oldTrucks: number,
    avgAge: number,
}

const FleetKpiCard = ({
    convertedGroupSummary,
    availableWithIssues,
    outOfServiceTrucks,
    operationalTrucks,
    maintenanceTrucks,
    inactiveTrucks,
    enViajeTrucks,
    activeTrucks,
    totalTrucks,
    oldTrucks,
    newTrucks,
    avgAge,
}: FleetKpiCardProps) => {

    const fleetAvailability = Math.round((operationalTrucks / totalTrucks) * 100)

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
                        <CountUp start={0} end={totalTrucks} duration={5} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Totalidad de la flota
                        (<span className="text-emerald-500">Activos: {activeTrucks}</span> - <span className="text-red-500">Inactivos: {inactiveTrucks}</span>)
                    </p>
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

            <Card className="border-border bg-card col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-card-foreground">Estado de la flota</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-2xl font-bold text-card-foreground">
                                {availableWithIssues} Equipo{availableWithIssues === 0 || availableWithIssues > 1 ? "s" : ""}
                            </div>
                            <p className="flex gap-2 text-xs text-muted-foreground">
                                <IconExclamationCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Disponible con detalles</span>
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-card-foreground">
                                {maintenanceTrucks} Equipo{maintenanceTrucks === 0 || maintenanceTrucks > 1 ? "s" : ""}
                            </div>
                            <p className="flex gap-2 text-xs text-muted-foreground">
                                <IconTool className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">En mantenimiento</span>
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-card-foreground">
                                {outOfServiceTrucks} Equipo{outOfServiceTrucks === 0 || outOfServiceTrucks > 1 ? "s" : ""}
                            </div>
                            <p className="flex gap-2 text-xs text-muted-foreground">
                                <Ban className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Fuera de servicio</span>
                            </p>
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-card-foreground">
                                {enViajeTrucks} Equipo{enViajeTrucks === 0 || enViajeTrucks > 1 ? "s" : ""}
                            </div>
                            <p className="flex gap-2 text-xs text-muted-foreground">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">En viaje</span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6 sm:mb-8 col-span-2 h-full">
                <Card className="border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-card-foreground">Edad de la flota</CardTitle>
                        <Timer className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 mx-auto">
                                <div className="text-4xl font-bold text-card-foreground">{avgAge.toFixed(2)} Años</div>
                                <p className="text-sm text-muted-foreground">
                                    <span>Edad promedio</span>
                                </p>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-card-foreground">{newTrucks} Años</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-muted-foreground">Comiones mas nuevos</span>
                                </p>
                            </div>

                            <div>
                                <div className="text-2xl font-bold text-card-foreground">{oldTrucks} Años</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-muted-foreground">Camiones mas antiguos</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-card-foreground">Flota por grupo</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div>
                            {convertedGroupSummary.map((group, index) => (
                                <div key={group.name} className="mt-4">
                                    {index === 1 && <Separator className="mt-2" />}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="text-2xl font-bold text-card-foreground">{group.value.total} Equipos</div>
                                        <div className="text-2xl font-bold text-card-foreground">{group.value.activos} Activos</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className="text-muted-foreground">{group.name}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default FleetKpiCard