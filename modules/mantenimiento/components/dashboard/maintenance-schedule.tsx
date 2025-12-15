"use client"

import { AlertTriangle, Calendar, ChevronRight, FileText, MapPin, User, Wrench, ClipboardList, Clock, Flag, X, Fuel, Gauge, Navigation } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MantenimientoConDetalles } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Operador } from "@/modules/logistica/bdd/operadores/types/operadores"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { OrdenMantenimiento } from "../../types/orden-mantenimiento"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Incidencia } from "../../incidencias/types/incidencias"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Mecanico } from "../../types/mecanico"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MaintenanceScheduleProps {
    maintenanceRecords: MantenimientoConDetalles[]
    ordenes?: OrdenMantenimiento[]
    incidencias?: Incidencia[]
    operadores?: Operador[]
    mecanicos?: Mecanico[]
    equipos?: Equipo[]
}

const MaintenanceSchedule = ({
    maintenanceRecords,
    incidencias = [],
    operadores = [],
    mecanicos = [],
    ordenes = [],
    equipos = [],
}: MaintenanceScheduleProps) => {
    const [selectedMantenimiento, setSelectedMantenimiento] = useState<MantenimientoConDetalles | null>(null)
    const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null)
    const [selectedOrden, setSelectedOrden] = useState<OrdenMantenimiento | null>(null)

    const ordenesMantenimiento = ordenes.filter(o => o.estado !== 'Cancelada' && o.estado !== 'Completada')
    const mantenimientosCompletados = maintenanceRecords.filter(m => m.estado === 'Completado' || m.estado === 'En Progreso')
    const incidenciasRecientes = incidencias.filter(i => i.estado !== 'Resuelta').slice(0, 5)

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'Critica':
                return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
            case 'Alta':
                return 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400'
            case 'Media':
                return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            case 'Baja':
                return 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
            default:
                return 'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400'
        }
    }

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Pendiente':
                return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
            case 'En Progreso':
                return 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
            case 'Completada':
                return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            case 'Cancelada':
                return 'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400'
            default:
                return 'border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400'
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Actividades Recientes
                </CardTitle>
                <CardDescription>Incidencias, órdenes y mantenimientos</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="incidencias" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="incidencias" className="gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="hidden sm:inline">Incidencias</span>
                            <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                                {incidenciasRecientes.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="ordenes" className="gap-2">
                            <ClipboardList className="h-4 w-4" />
                            <span className="hidden sm:inline">Órdenes</span>
                            <Badge variant="outline" className="ml-1 h-5 px-1.5 text-[10px] bg-orange-500/10 text-orange-600 border-orange-500/20">
                                {ordenesMantenimiento.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="mantenimientos" className="gap-2">
                            <Wrench className="h-4 w-4" />
                            <span className="hidden sm:inline">Mantenimientos</span>
                            <Badge variant="outline" className="ml-1 h-5 px-1.5 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                {mantenimientosCompletados.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="incidencias" className="mt-4">
                        <div className="space-y-3">
                            {incidenciasRecientes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No hay incidencias activas</p>
                                </div>
                            ) : (
                                incidenciasRecientes.map((incidencia) => {
                                    const numEconomico = equipos.find((e) => e.id === incidencia.equipoId)?.numEconomico;
                                    const operadorNombre = operadores.find((o) => o.id === incidencia.operadorId)?.nombres;
                                    const operadorApellido = operadores.find((o) => o.id === incidencia.operadorId)?.apellidos;

                                    return (
                                        <div
                                            key={incidencia.id}
                                            className="group relative rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:border-red-500/50 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "capitalize text-[10px] sm:text-xs",
                                                                incidencia.severidad === "Alta"
                                                                    ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                                                                    : incidencia.severidad === "Media"
                                                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                                        : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                            )}
                                                        >
                                                            {incidencia.severidad || "Normal"}
                                                        </Badge>
                                                        <Badge variant="outline" className="capitalize text-[10px] sm:text-xs">
                                                            {incidencia.tipo}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span className="font-medium text-foreground">{numEconomico}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span>{parseFirebaseDate(incidencia.creadtedAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <User className="h-3.5 w-3.5" />
                                                            <span>{operadorNombre + ' ' + operadorApellido}</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 capitalize">
                                                        {incidencia.descripcion}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 shrink-0"
                                                    onClick={() => setSelectedIncidencia(incidencia)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="ordenes" className="mt-4">
                        <div className="space-y-3">
                            {ordenesMantenimiento.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No hay órdenes de mantenimiento activas</p>
                                </div>
                            ) : (
                                ordenesMantenimiento.slice(0, 5).map((orden) => {
                                    const numEconomico = equipos.find((e) => e.id === orden.equipoId)?.numEconomico;
                                    const mecanicoNombre = mecanicos.find((o) => o.id === orden.mecanicoId)?.nombre;
                                    const mecanicoApellido = mecanicos.find((o) => o.id === orden.mecanicoId)?.apellidos;
                                    const incidencia = incidencias.find((i) => i.id === orden.incidenciaId);

                                    return (
                                        <div
                                            key={orden.id}
                                            className="group relative rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:border-orange-500/50 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] sm:text-xs flex items-center gap-1",
                                                                getPrioridadColor(orden.prioridad)
                                                            )}
                                                        >
                                                            <Flag className="h-3 w-3" />
                                                            {orden.prioridad}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] sm:text-xs",
                                                                getEstadoColor(orden.estado)
                                                            )}
                                                        >
                                                            {orden.estado}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span className="font-medium text-foreground">{numEconomico}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span>{parseFirebaseDate(orden.fechaCreacion).toLocaleDateString()}</span>
                                                        </div>
                                                        {orden.mecanicoId && (
                                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                                <User className="h-3.5 w-3.5" />
                                                                <span>{mecanicoNombre + ' ' + mecanicoApellido}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                        {orden.descripcionProblema}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                        {orden.fechaInicio && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                <span>Inicio: {parseFirebaseDate(orden.fechaInicio).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                        {orden.fechaTerminacion && (
                                                            <>
                                                                <span>•</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>Fin: {parseFirebaseDate(orden.fechaTerminacion).toLocaleDateString()}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {orden.incidenciaId && (
                                                        <div className="pt-1 text-xs text-muted-foreground">
                                                            <span className="font-medium text-foreground inline-flex items-center gap-1">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                Incidencia: {incidencia?.descripcion}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 shrink-0"
                                                    onClick={() => setSelectedOrden(orden)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="mantenimientos" className="mt-4">
                        <div className="space-y-3">
                            {mantenimientosCompletados.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Wrench className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No hay mantenimientos recientes</p>
                                </div>
                            ) : (
                                mantenimientosCompletados.slice(0, 5).map((record) => {
                                    const numEconomico = equipos.find((e) => e.id === record.equipoId)?.numEconomico;
                                    const mecanicoNombre = mecanicos.find((o) => o.id === record.mecanicoId)?.nombre;
                                    const mecanicoApellido = mecanicos.find((o) => o.id === record.mecanicoId)?.apellidos;

                                    return (
                                        <div
                                            key={record.id}
                                            className="group relative rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:border-emerald-500/50 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] sm:text-xs",
                                                                record.tipoServicio === "Preventivo"
                                                                    ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                                    : record.tipoServicio === "Correctivo"
                                                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                                        : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                                                            )}
                                                        >
                                                            {record.tipoServicio}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "capitalize text-[10px] sm:text-xs",
                                                                record.estado === "Completado"
                                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                                    : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                            )}
                                                        >
                                                            {record.estado === "Completado" ? "Completado" : "En Progreso"}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
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
                                                            <span>{mecanicoNombre} {mecanicoApellido}</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{record.notas}</p>

                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="font-medium">{record.kmMomento.toLocaleString()} km</span>
                                                        <span>•</span>
                                                        <span>Datos: {record.mantenimientoData.length}</span>
                                                        {record.evidencias && record.evidencias.length > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <div className="flex items-center gap-1">
                                                                    <FileText className="h-3 w-3" />
                                                                    <span>Evidencias: {record.evidencias.length}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {record.fechaProximo && (
                                                        <div className="pt-1 text-xs text-muted-foreground">
                                                            Próximo mantenimiento:{" "}
                                                            <span className="font-medium text-foreground inline-flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {parseFirebaseDate(record.fechaProximo).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 shrink-0"
                                                    onClick={() => setSelectedMantenimiento(record)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <Dialog open={!!selectedIncidencia} onOpenChange={() => setSelectedIncidencia(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Detalles de Incidencia
                        </DialogTitle>
                        <DialogDescription>
                            Información completa de la incidencia reportada
                        </DialogDescription>
                    </DialogHeader>

                    {selectedIncidencia && (
                        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                            <div className="space-y-4">
                                {/* Badges de Estado y Severidad */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "capitalize",
                                            selectedIncidencia.severidad === "Alta" || selectedIncidencia.severidad === "Critica"
                                                ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                                                : selectedIncidencia.severidad === "Media"
                                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        )}
                                    >
                                        {selectedIncidencia.severidad || "Normal"}
                                    </Badge>
                                    <Badge variant="outline" className="capitalize">
                                        {selectedIncidencia.tipo}
                                    </Badge>
                                    <Badge variant="outline" className={cn(
                                        "capitalize",
                                        selectedIncidencia.estado === "Resuelta"
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                            : "border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
                                    )}>
                                        {selectedIncidencia.estado}
                                    </Badge>
                                    {selectedIncidencia.categoria && (
                                        <Badge variant="outline" className="capitalize">
                                            {selectedIncidencia.categoria}
                                        </Badge>
                                    )}
                                </div>

                                <Separator />

                                {/* Información Principal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="font-medium">Equipo</span>
                                        </div>
                                        <p className="text-sm font-semibold">{selectedIncidencia.equipoId}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span className="font-medium">Operador</span>
                                        </div>
                                        <p className="text-sm font-semibold">{selectedIncidencia.operadorId}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Fecha de Reporte</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {parseFirebaseDate(selectedIncidencia.creadtedAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Wrench className="h-4 w-4" />
                                            <span className="font-medium">Operable</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {selectedIncidencia.operable ? "Sí" : "No"}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Descripción */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4" />
                                        Descripción
                                    </div>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        {selectedIncidencia.descripcion}
                                    </p>
                                </div>

                                {/* Información Adicional del Vehículo */}
                                {(selectedIncidencia.kmActual || selectedIncidencia.nivelCombustible || selectedIncidencia.velocidadAprox) && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium">Información del Vehículo</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {selectedIncidencia.kmActual && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Gauge className="h-4 w-4" />
                                                            <span>Kilometraje</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">{selectedIncidencia.kmActual.toLocaleString()} km</p>
                                                    </div>
                                                )}
                                                {selectedIncidencia.nivelCombustible !== undefined && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Fuel className="h-4 w-4" />
                                                            <span>Combustible</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">{selectedIncidencia.nivelCombustible}%</p>
                                                    </div>
                                                )}
                                                {selectedIncidencia.velocidadAprox && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Gauge className="h-4 w-4" />
                                                            <span>Velocidad Aprox.</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">{selectedIncidencia.velocidadAprox} km/h</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Ubicación */}
                                {selectedIncidencia.ubicacion && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Navigation className="h-4 w-4" />
                                                Ubicación
                                            </div>
                                            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Latitud:</span>
                                                        <p className="font-mono">{selectedIncidencia.ubicacion.latitud}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Longitud:</span>
                                                        <p className="font-mono">{selectedIncidencia.ubicacion.longitud}</p>
                                                    </div>
                                                </div>
                                                {selectedIncidencia.ubicacion.direccionAproximada && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {selectedIncidencia.ubicacion.direccionAproximada}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Evidencias */}
                                {selectedIncidencia.evidencias && selectedIncidencia.evidencias.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="h-4 w-4" />
                                                Evidencias ({selectedIncidencia.evidencias.length})
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedIncidencia.evidencias.map((evidencia) => (
                                                    <div key={evidencia.id} className="bg-muted/50 p-2 rounded text-xs">
                                                        {evidencia.nombre}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedOrden} onOpenChange={() => setSelectedOrden(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-orange-500" />
                            Detalles de Orden de Mantenimiento
                        </DialogTitle>
                        <DialogDescription>
                            Información completa de la orden de trabajo
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrden && (
                        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                            <div className="space-y-4">
                                {/* Badges de Prioridad y Estado */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "flex items-center gap-1",
                                            getPrioridadColor(selectedOrden.prioridad)
                                        )}
                                    >
                                        <Flag className="h-3 w-3" />
                                        {selectedOrden.prioridad}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={cn(getEstadoColor(selectedOrden.estado))}
                                    >
                                        {selectedOrden.estado}
                                    </Badge>
                                </div>

                                <Separator />

                                {/* Información Principal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <ClipboardList className="h-4 w-4" />
                                            <span className="font-medium">ID de Orden</span>
                                        </div>
                                        <p className="text-sm font-mono font-semibold">{selectedOrden.id}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="font-medium">Equipo</span>
                                        </div>
                                        <p className="text-sm font-semibold">{selectedOrden.equipoId}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Fecha de Creación</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {parseFirebaseDate(selectedOrden.fechaCreacion).toLocaleString()}
                                        </p>
                                    </div>

                                    {selectedOrden.mecanicoId && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span className="font-medium">Mecánico Asignado</span>
                                            </div>
                                            <p className="text-sm font-semibold">{selectedOrden.mecanicoId}</p>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Descripción del Problema */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4" />
                                        Descripción del Problema
                                    </div>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        {selectedOrden.descripcionProblema}
                                    </p>
                                </div>

                                {/* Fechas de Trabajo */}
                                {(selectedOrden.fechaInicio || selectedOrden.fechaTerminacion) && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium">Fechas de Trabajo</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedOrden.fechaInicio && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Fecha de Inicio</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">
                                                            {parseFirebaseDate(selectedOrden.fechaInicio).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedOrden.fechaTerminacion && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Fecha de Terminación</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">
                                                            {parseFirebaseDate(selectedOrden.fechaTerminacion).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Incidencia Relacionada */}
                                {selectedOrden.incidenciaId && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <AlertTriangle className="h-4 w-4" />
                                                Incidencia Relacionada
                                            </div>
                                            <div className="bg-muted/50 p-3 rounded-lg">
                                                <p className="text-sm font-mono">{selectedOrden.incidenciaId}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Metadatos */}
                                <Separator />
                                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                    <div>
                                        <span>Creado:</span>
                                        <p className="font-mono">{parseFirebaseDate(selectedOrden.createAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span>Actualizado:</span>
                                        <p className="font-mono">{parseFirebaseDate(selectedOrden.updateAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedMantenimiento} onOpenChange={() => setSelectedMantenimiento(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-emerald-500" />
                            Detalles de Mantenimiento
                        </DialogTitle>
                        <DialogDescription>
                            Información completa del registro de mantenimiento
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMantenimiento && (
                        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                            <div className="space-y-4">
                                {/* Badges de Tipo y Estado */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            selectedMantenimiento.tipoServicio === "Preventivo"
                                                ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                : selectedMantenimiento.tipoServicio === "Correctivo"
                                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                                        )}
                                    >
                                        {selectedMantenimiento.tipoServicio}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            selectedMantenimiento.estado === "Completado"
                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        )}
                                    >
                                        {selectedMantenimiento.estado}
                                    </Badge>
                                    {selectedMantenimiento.tipoMantenimiento && (
                                        <Badge variant="outline">
                                            {selectedMantenimiento.tipoMantenimiento}
                                        </Badge>
                                    )}
                                </div>

                                <Separator />

                                {/* Información Principal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="font-medium">Equipo</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {selectedMantenimiento.equipoId}
                                            {selectedMantenimiento.equipo?.numEconomico &&
                                                ` - ${selectedMantenimiento.equipo.numEconomico}`
                                            }
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Fecha de Servicio</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {parseFirebaseDate(selectedMantenimiento.fecha).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Gauge className="h-4 w-4" />
                                            <span className="font-medium">Kilometraje</span>
                                        </div>
                                        <p className="text-sm font-semibold">{selectedMantenimiento.kmMomento.toLocaleString()} km</p>
                                    </div>

                                    {selectedMantenimiento.mecanicoId && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span className="font-medium">Mecánico</span>
                                            </div>
                                            <p className="text-sm font-semibold">{selectedMantenimiento.mecanicoId}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Notas */}
                                {selectedMantenimiento.notas && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="h-4 w-4" />
                                                Notas
                                            </div>
                                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                                {selectedMantenimiento.notas}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Datos de Mantenimiento */}
                                {selectedMantenimiento.mantenimientoData && selectedMantenimiento.mantenimientoData.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <ClipboardList className="h-4 w-4" />
                                                Trabajos Realizados ({selectedMantenimiento.mantenimientoData.length})
                                            </div>
                                            <div className="space-y-2">
                                                {selectedMantenimiento.mantenimientoData.map((data) => (
                                                    <div key={data.id} className="bg-muted/50 p-3 rounded-lg">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium">{data.descripcion}</p>
                                                                <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                                                                    <span>Cantidad: {data.cantidad}</span>
                                                                    {data.unidadMedida && <span>• {data.unidadMedida}</span>}
                                                                    {data.referenciaParte && <span>• Ref: {data.referenciaParte}</span>}
                                                                </div>
                                                            </div>
                                                            {data.costo && (
                                                                <div className="text-sm font-semibold">
                                                                    ${data.costo.toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Próximo Mantenimiento */}
                                {(selectedMantenimiento.fechaProximo || selectedMantenimiento.proximoKm) && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium">Próximo Mantenimiento</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedMantenimiento.fechaProximo && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Fecha Programada</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">
                                                            {parseFirebaseDate(selectedMantenimiento.fechaProximo).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedMantenimiento.proximoKm && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Gauge className="h-4 w-4" />
                                                            <span>Kilometraje</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">{selectedMantenimiento.proximoKm.toLocaleString()} km</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Evidencias */}
                                {selectedMantenimiento.evidencias && selectedMantenimiento.evidencias.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="h-4 w-4" />
                                                Evidencias ({selectedMantenimiento.evidencias.length})
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {selectedMantenimiento.evidencias.map((evidencia) => (
                                                    <div key={evidencia.id} className="bg-muted/50 p-2 rounded text-xs truncate">
                                                        {evidencia.nombre}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Metadatos */}
                                <Separator />
                                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                    <div>
                                        <span>Creado:</span>
                                        <p className="font-mono">{parseFirebaseDate(selectedMantenimiento.createAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span>Actualizado:</span>
                                        <p className="font-mono">{parseFirebaseDate(selectedMantenimiento.updateAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default MaintenanceSchedule