"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    AlertTriangle,
    Truck,
    Users,
    Wrench,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from "lucide-react"

interface KpiCardsProps {
    totalEquipos: number
    equiposEnIncidencias: number
    equiposEnMantenimiento: number
    equiposEnOrdenes: number
    totalMecanicos: number
    mecanicosOcupados: number
    totalIncidencias: number
    totalOrdenesMantenimiento: number
    totalMantenimientos: number
    cambioIncidencias?: number
    cambioOrdenes?: number
    cambioMantenimientos?: number
    cambioEquiposDisponibles?: number
}

const KpiCards = ({
    totalEquipos,
    equiposEnIncidencias,
    equiposEnMantenimiento,
    equiposEnOrdenes,
    totalMecanicos,
    mecanicosOcupados,
    totalIncidencias,
    totalOrdenesMantenimiento,
    totalMantenimientos,
    cambioIncidencias = 0,
    cambioOrdenes = 0,
    cambioMantenimientos = 0,
    cambioEquiposDisponibles = 0
}: KpiCardsProps) => {
    const mecanicosDisponibles
        = totalMecanicos - mecanicosOcupados
    const equiposDisponibles
        = totalEquipos - equiposEnIncidencias - equiposEnMantenimiento - equiposEnOrdenes

    const getTrendIcon = (value: number) => {
        if (value > 0) return <ArrowUpRight className="h-3 w-3" />
        if (value < 0) return <ArrowDownRight className="h-3 w-3" />
        return <Minus className="h-3 w-3" />
    }

    const getTrendColor = (value: number, inverse = false) => {
        if (inverse) {
            if (value > 0) return "text-red-500 dark:text-red-400"
            if (value < 0) return "text-emerald-600 dark:text-emerald-400"
        } else {
            if (value > 0) return "text-emerald-600 dark:text-emerald-400"
            if (value < 0) return "text-red-500 dark:text-red-400"
        }
        return "text-muted-foreground"
    }

    return (
        <div className="mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Card className="overflow-hidden border-l-4 border-l-sky-500 dark:border-l-sky-400 bg-gradient-to-br from-sky-500/10 dark:from-sky-400/5 via-transparent to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                    <CardTitle className="text-sm font-medium">Equipos</CardTitle>
                    <div className="rounded-full bg-sky-500/20 dark:bg-sky-400/10 p-2">
                        <Truck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl sm:text-3xl font-bold">{totalEquipos}</div>
                        <span className="text-xs text-muted-foreground">totales</span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Disponibles</span>
                            <Badge variant="outline" className="bg-emerald-500/15 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-400/20 text-[10px] sm:text-xs">
                                {equiposDisponibles}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">En incidencias</span>
                            <Badge variant="outline" className="bg-red-500/15 dark:bg-red-400/10 text-red-700 dark:text-red-400 border-red-500/30 dark:border-red-400/20 text-[10px] sm:text-xs">
                                {equiposEnIncidencias}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">En mantenimiento</span>
                            <Badge variant="outline" className="bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-400/20 text-[10px] sm:text-xs">
                                {equiposEnMantenimiento}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">En órdenes</span>
                            <Badge variant="outline" className="bg-purple-500/15 dark:bg-purple-400/10 text-purple-700 dark:text-purple-400 border-purple-500/30 dark:border-purple-400/20 text-[10px] sm:text-xs">
                                {equiposEnOrdenes}
                            </Badge>
                        </div>
                    </div>

                    {cambioEquiposDisponibles !== 0 && (
                        <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium", getTrendColor(cambioEquiposDisponibles))}>
                            {getTrendIcon(cambioEquiposDisponibles)}
                            <span className="truncate">{Math.abs(cambioEquiposDisponibles)}% vs mes anterior</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-l-4 border-l-violet-500 dark:border-l-violet-400 bg-gradient-to-br from-violet-500/10 dark:from-violet-400/5 via-transparent to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                    <CardTitle className="text-sm font-medium">Mecánicos</CardTitle>
                    <div className="rounded-full bg-violet-500/20 dark:bg-violet-400/10 p-2">
                        <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl sm:text-3xl font-bold">{totalMecanicos}</div>
                        <span className="text-xs text-muted-foreground">totales</span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Disponibles</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                                <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">{mecanicosDisponibles}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Ocupados</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                                <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">{mecanicosOcupados}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-1 sm:pt-2">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/50">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 transition-all duration-500"
                                style={{ width: `${totalMecanicos > 0 ? (mecanicosDisponibles / totalMecanicos) * 100 : 0}%` }}
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground text-center">
                            {totalMecanicos > 0 ? Math.round((mecanicosDisponibles / totalMecanicos) * 100) : 0}% disponibilidad
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-l-4 border-l-red-500 dark:border-l-red-400 bg-gradient-to-br from-red-500/10 dark:from-red-400/5 via-transparent to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                    <CardTitle className="text-sm font-medium">Incidencias</CardTitle>
                    <div className="rounded-full bg-red-500/20 dark:bg-red-400/10 p-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl sm:text-3xl font-bold">{totalIncidencias}</div>
                        <span className="text-xs text-muted-foreground">activas</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-muted/30 p-2">
                        <span className="text-xs text-muted-foreground">Equipos afectados</span>
                        <Badge variant="destructive" className="text-[10px] sm:text-xs bg-red-500/90 dark:bg-red-500/80">
                            {equiposEnIncidencias}
                        </Badge>
                    </div>

                    {cambioIncidencias !== 0 && (
                        <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium", getTrendColor(cambioIncidencias, true))}>
                            {getTrendIcon(cambioIncidencias)}
                            <span className="truncate">{Math.abs(cambioIncidencias)}% vs mes anterior</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-l-4 border-l-orange-500 dark:border-l-orange-400 bg-gradient-to-br from-orange-500/10 dark:from-orange-400/5 via-transparent to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                    <CardTitle className="text-sm font-medium">Órdenes de Mantenimiento</CardTitle>
                    <div className="rounded-full bg-orange-500/20 dark:bg-orange-400/10 p-2">
                        <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl sm:text-3xl font-bold">{totalOrdenesMantenimiento}</div>
                        <span className="text-xs text-muted-foreground">totales</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-muted/30 p-2">
                        <span className="text-xs text-muted-foreground">Equipos en órdenes</span>
                        <Badge variant="outline" className="bg-orange-500/15 dark:bg-orange-400/10 text-orange-700 dark:text-orange-400 border-orange-500/30 dark:border-orange-400/20 text-[10px] sm:text-xs">
                            {equiposEnOrdenes}
                        </Badge>
                    </div>

                    {cambioOrdenes !== 0 && (
                        <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium", getTrendColor(cambioOrdenes))}>
                            {getTrendIcon(cambioOrdenes)}
                            <span className="truncate">{Math.abs(cambioOrdenes)}% vs mes anterior</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-l-4 border-l-emerald-500 dark:border-l-emerald-400 bg-gradient-to-br from-emerald-500/10 dark:from-emerald-400/5 via-transparent to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                    <CardTitle className="text-sm font-medium">Mantenimientos</CardTitle>
                    <div className="rounded-full bg-emerald-500/20 dark:bg-emerald-400/10 p-2">
                        <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl sm:text-3xl font-bold">{totalMantenimientos}</div>
                        <span className="text-xs text-muted-foreground">totales</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-muted/30 p-2">
                        <span className="text-xs text-muted-foreground">Equipos en proceso</span>
                        <Badge variant="outline" className="bg-emerald-500/15 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-400/20 text-[10px] sm:text-xs">
                            {equiposEnMantenimiento}
                        </Badge>
                    </div>

                    {cambioMantenimientos !== 0 && (
                        <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium", getTrendColor(cambioMantenimientos))}>
                            {getTrendIcon(cambioMantenimientos)}
                            <span className="truncate">{Math.abs(cambioMantenimientos)}% vs mes anterior</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default KpiCards