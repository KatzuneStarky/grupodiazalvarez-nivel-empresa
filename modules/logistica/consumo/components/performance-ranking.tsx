import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSignIcon, FuelIcon, TrophyIcon, TruckIcon } from 'lucide-react'
import { TruckRanking } from '../types/ranking-equipos'
import { Badge } from '@/components/ui/badge'
import React from 'react'

interface PerformanceRankingProps {
  rankings: TruckRanking[]
}

const PerformanceRanking = ({ rankings }: PerformanceRankingProps) => {
    const topTrucks = rankings.slice(0, 5)

    return (
        <Card className='col-span-2'>
            <CardHeader>
                <CardTitle>Top 5 camiones mas eficientes</CardTitle>
                <CardDescription>La mejor eficioncia en base a los camiones de la flota</CardDescription>
            </CardHeader>
            <CardContent>
                {topTrucks.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No hay datos disponibles</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {topTrucks.map((ranking, index) => (
                            <div key={index}>
                                <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="absolute top-3 right-3">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0
                                                ? "bg-yellow-500 text-yellow-950"
                                                : index === 1
                                                    ? "bg-gray-400 text-gray-950"
                                                    : index === 2
                                                        ? "bg-amber-600 text-amber-950"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <TruckIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base">{ranking.equipoName}</CardTitle>
                                            </div>
                                        </div>
                                        {ranking.isMostEfficient && (
                                            <Badge variant="default" className="gap-1 w-fit mt-2">
                                                <TrophyIcon className="h-3 w-3" />
                                                El mejor
                                            </Badge>
                                        )}
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="rounded-lg bg-primary/5 p-3 text-center">
                                            <div className="text-2xl font-bold text-primary">
                                                {ranking.averageEfficiency.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
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
                                                    {ranking.totalFuelUsed.toLocaleString("es-MX", { maximumFractionDigits: 0 })} L
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <DollarSignIcon className="h-3.5 w-3.5" />
                                                    <span>Costo total</span>
                                                </div>
                                                <span className="font-medium">
                                                    ${ranking.totalCost.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default PerformanceRanking