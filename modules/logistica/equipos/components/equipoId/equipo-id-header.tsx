"use client"

import { AlertCircle, CheckCircle2, Eye, FileText, Fuel, Radio, Truck, Wrench, XCircle } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { getStatusColor } from "../../constants/colores-equipos"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EquipoIdHeaderProps {
    equipo: Equipo | null
    numMantenimientos: number
    totalArchivos: number
    numTanques: number
}

const EquipoIdHeader = ({
    equipo,
    numTanques,
    totalArchivos,
    numMantenimientos,
}: EquipoIdHeaderProps) => {
    return (
        <Card className="overflow-hidden border-2">
            <CardHeader>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                        {equipo?.imagen ? (
                            <div className="relative group">
                                <img
                                    src={equipo?.imagen || "/placeholder.svg"}
                                    alt={`${equipo?.marca} ${equipo?.modelo}`}
                                    className="w-full lg:w-64 h-64 object-cover rounded-xl shadow-lg ring-2 ring-primary/10"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <Button variant="secondary" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver imagen completa
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full lg:w-64 h-64 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center ring-2 ring-border">
                                <Truck className="w-20 h-20 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between flex-wrap gap-3">
                            <div className="space-y-2">
                                <CardTitle className="text-4xl font-bold text-balance">
                                    {equipo?.marca} {equipo?.modelo}
                                </CardTitle>
                                <CardDescription className="text-lg flex items-center gap-2 flex-wrap">
                                    <Badge variant="secondary" className="font-medium">
                                        {equipo?.tipoUnidad || "Vehículo"}
                                    </Badge>
                                    <span className="text-muted-foreground">•</span>
                                    <span>Año {equipo?.year}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">ID: {equipo?.id}</span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Badge variant={equipo?.activo ? "default" : "secondary"} className="h-fit text-sm px-3 py-1.5">
                                    {equipo?.activo ? (
                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    ) : (
                                        <XCircle className="w-4 h-4 mr-1.5" />
                                    )}
                                    {equipo?.activo ? "Activo" : "Inactivo"}
                                </Badge>
                                {equipo?.gpsActivo && (
                                    <Badge
                                        variant="outline"
                                        className="h-fit text-sm px-3 py-1.5 border-green-500/50 bg-green-500/10"
                                    >
                                        <Radio className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
                                        GPS Activo
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="space-y-1.5 p-3 rounded-lg bg-background/50 border">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                    Número Económico
                                </p>
                                <p className="font-bold text-lg">{equipo?.numEconomico}</p>
                            </div>
                            {equipo?.placas && (
                                <div className="space-y-1.5 p-3 rounded-lg bg-background/50 border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Placas</p>
                                    <p className="font-bold text-lg">{equipo?.placas}</p>
                                </div>
                            )}
                            {equipo?.serie && (
                                <div className="space-y-1.5 p-3 rounded-lg bg-background/50 border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Número de Serie
                                    </p>
                                    <p className="font-semibold text-sm">{equipo?.serie}</p>
                                </div>
                            )}
                            <div className="space-y-1.5 p-3 rounded-lg bg-background/50 border">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Estado General</p>
                                <Badge className={cn("text-sm font-semibold", getStatusColor(equipo?.estado || EstadoEquipos.DISPONIBLE))}>
                                    {equipo?.estado}
                                </Badge>
                            </div>
                            <div className="space-y-1.5 p-3 rounded-lg bg-background/50 border">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Grupo</p>
                                <p className="font-semibold text-xs leading-tight">{equipo?.grupoUnidad}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Mantenimientos</p>
                                    <p className="text-xl font-bold">
                                        {numMantenimientos}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Documentos</p>
                                    <p className="text-xl font-bold">
                                        {totalArchivos}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <Fuel className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tanques</p>
                                    <p className="text-xl font-bold">
                                        {numTanques}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <div className="p-2 rounded-lg bg-orange-500/20">
                                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Por vencer</p>
                                    {/** <p className="text-xl font-bold">{expiringDocumentsCount + expiredDocumentsCount}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default EquipoIdHeader