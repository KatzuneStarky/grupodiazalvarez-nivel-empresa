"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MantenimientoConDetalles } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { Calendar, ChevronRight, FileText, MapPin, User, Wrench } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MaintenanceScheduleProps {
    maintenanceRecords: MantenimientoConDetalles[]
}

const MaintenanceSchedule = ({ maintenanceRecords }: MaintenanceScheduleProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Mantenimientos recientes
                        </CardTitle>
                        <CardDescription>Ultimos mantenimientos</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                        Ver todo
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {maintenanceRecords.map((record) => (
                        <div
                            key={record.id}
                            className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant="outline"
                                            className={
                                                record.tipoServicio === "Preventivo"
                                                    ? "border-primary/30 bg-primary/10 text-primary"
                                                    : record.tipoServicio === "Correctivo"
                                                        ? "border-warning/30 bg-warning/10 text-warning"
                                                        : "border-destructive/30 bg-destructive/10 text-destructive"
                                            }
                                        >
                                            {record.tipoServicio}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className={
                                                cn("capitalize",
                                                    record.estado === "Completado"
                                                        ? "border-success/30 bg-success/10 text-success"
                                                        : record.estado === "En Progreso"
                                                            ? "border-warning/30 bg-warning/10 text-warning"
                                                            : "border-muted-foreground/30 bg-muted text-muted-foreground"
                                                )
                                            }
                                        >
                                            {record.estado === "Completado"
                                                ? "Completado"
                                                : record.estado === "En Progreso"
                                                    ? "En Progreso"
                                                    : "Pendiente"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span className="font-medium text-foreground">{record.equipoId}</span>
                                            <span>- {record.equipo?.numEconomico}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{parseFirebaseDate(record.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <User className="h-3.5 w-3.5" />
                                            <span>{record.mecanicoId}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground">{record.notas}</p>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="font-medium">{record.kmMomento.toLocaleString()} km</span>
                                        <span>•</span>
                                        <span>Datos de mantenimiento: {record.mantenimientoData.length}</span>
                                        {record.evidencias && record.evidencias.length > 0 ? (
                                            <>
                                                <span>•</span>
                                                <FileText className="h-3 w-3" />
                                                <span>Evidencias: {record.evidencias.length}</span>
                                            </>
                                        ) : null}
                                    </div>

                                    {record.fechaProximo && (
                                        <div className="pt-2 text-xs text-muted-foreground">
                                            Proximo mantenimiento:{" "}
                                            <span className="font-medium text-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {parseFirebaseDate(record.fechaProximo).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Button variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default MaintenanceSchedule