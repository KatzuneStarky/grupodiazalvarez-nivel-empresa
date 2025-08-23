"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { BarChart3, LineChart, PieChart, Truck } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const LogisticChartsPage = () => {
    const mes = getCurrentMonthCapitalized()
    const { directLink } = useDirectLink("/graficas/logistica")

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Graficas logistica</h1>
                    <p className="text-muted-foreground">Analisis grafico de viajes hechos por mes ({mes})</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Navegación de Gráficas</CardTitle>
                        <CardDescription>Accede a los diferentes análisis y reportes gráficos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                <Link href={`${directLink}/grafica1`}>
                                    <BarChart3 className="h-6 w-6" />
                                    <span>Gráfica 1</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                <Link href={`${directLink}/grafica2`}>
                                    <LineChart className="h-6 w-6" />
                                    <span>Gráfica 2</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                <Link href={`${directLink}/grafica3`}>
                                    <PieChart className="h-6 w-6" />
                                    <span>Gráfica 3</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                <Link href={`${directLink}/fletes`}>
                                    <Truck className="h-6 w-6" />
                                    <span>Fletes</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default LogisticChartsPage