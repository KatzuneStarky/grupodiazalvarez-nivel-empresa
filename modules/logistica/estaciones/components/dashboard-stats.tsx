"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Building2, Fuel } from 'lucide-react'
import { formatNumber } from '@/utils/format-number'
import { EstacionServicio } from '../types/estacion'

const DashboardStats = ({ estaciones }: { estaciones: EstacionServicio[] }) => {
    const activeStations = estaciones.filter((s) => s.activo).length
    const totalTanks = estaciones.reduce((sum, station) => sum + station.tanques.length, 0)
    const lowFuelTanks = estaciones.reduce((sum, station) => { return sum + station.tanques.filter((tank) => tank.capacidadActual / tank.capacidadTotal < 0.25).length }, 0)
    const totalCapacity = estaciones.reduce((sum, station) => sum + station.tanques.reduce((tankSum, tank) => tankSum + tank.capacidadTotal, 0), 0)

    const stats = [
        {
            title: "Estaciones Activas",
            value: activeStations,
            total: estaciones.length,
            icon: Building2,
            color: "text-primary",
        },
        {
            title: "Total de Tanques",
            value: totalTanks,
            icon: Fuel,
            color: "text-chart-2",
        },
        {
            title: "Capacidad Total",
            value: `${formatNumber(totalCapacity)} L`,
            icon: Activity,
            color: "text-chart-3",
        },
        {
            title: "Tanques con Combustible Bajo",
            value: lowFuelTanks,
            icon: AlertTriangle,
            color: "text-destructive",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-card-foreground">
                            {stat.value}
                            {stat.total && <span className="text-sm text-muted-foreground ml-1">/ {stat.total}</span>}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default DashboardStats