"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSignIcon, FuelIcon, TruckIcon } from "lucide-react"
import { TruckRanking } from "../types/ranking-equipos"

interface LowPerformanceProps {
    rankings: TruckRanking[]
}

const LowPerformanceTruckCard = ({
    rankings
}: LowPerformanceProps) => {
    const worstTruck = rankings.find((truck) => truck.isLeastEfficient)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Camion menos eficiente</CardTitle>
                <CardDescription>Camion con el valor mas alto de consumo</CardDescription>
            </CardHeader>
            <CardContent>
                <div key={worstTruck?.equipoId}>
                    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <TruckIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-base">{worstTruck?.equipoName}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="rounded-lg bg-primary/5 p-3 text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {worstTruck?.averageEfficiency.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-muted-foreground">km/L</div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <FuelIcon className="h-3.5 w-3.5" />
                                        <span>Carga total</span>
                                    </div>
                                    <span className="font-medium">
                                        {worstTruck?.totalFuelUsed.toLocaleString("es-MX", { maximumFractionDigits: 0 })} L
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <DollarSignIcon className="h-3.5 w-3.5" />
                                        <span>Costo total</span>
                                    </div>
                                    <span className="font-medium">
                                        ${worstTruck?.totalCost.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}

export default LowPerformanceTruckCard