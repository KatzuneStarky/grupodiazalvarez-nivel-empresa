"use client"

import { BarChart3, Calendar, Clock, Download, Eye, FileIcon, FileText, Gauge, ImageIcon, Package, Search, Wrench } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EquipoConMantenimientos } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface MaintenanceTabProps {
    equipo: EquipoConMantenimientos | null
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    numMantenimientos: number
}

const MaintenanceTab = ({
    equipo,
    searchTerm,
    setSearchTerm,
    numMantenimientos
}: MaintenanceTabProps) => {
    const nextMaintenanceDate = equipo?.mantenimientos
        .filter((m) => parseFirebaseDate(m.fechaProximo) && parseFirebaseDate(m.fechaProximo) > new Date())
        .sort((a, b) => parseFirebaseDate(a.fechaProximo!).getTime() - parseFirebaseDate(b.fechaProximo!).getTime())[0]?.fechaProximo

    const daysUntilNextMaintenance = nextMaintenanceDate
        ? Math.floor((parseFirebaseDate(nextMaintenanceDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null

    return (
        <TabsContent value="maintenance" className="space-y-4 mt-6">
            <div>
                <Card className="border-2 border-primary/20 mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            Resumen de Mantenimiento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <p className="text-sm text-muted-foreground">Total Servicios</p>
                                </div>
                                <p className="text-3xl font-bold">{numMantenimientos}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <p className="text-sm text-muted-foreground">Próximo Servicio</p>
                                </div>
                                <p className="text-2xl font-bold">
                                    {daysUntilNextMaintenance !== null ? `En ${daysUntilNextMaintenance} días` : "N/A"}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <p className="text-sm text-muted-foreground">Último Servicio</p>
                                </div>
                                <p className="text-2xl font-bold">
                                    {equipo?.mantenimientos && equipo?.mantenimientos.length > 0
                                        ? format(
                                            parseFirebaseDate(equipo?.mantenimientos.sort(
                                                (a, b) => parseFirebaseDate(b.fecha).getTime() - parseFirebaseDate(a.fecha).getTime(),
                                            )[0].fecha),
                                            "PPP", { locale: es })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar mantenimientos por tipo, mecánico o notas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {equipo?.mantenimientos && equipo?.mantenimientos.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Wrench className="w-16 h-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">No hay mantenimientos registrados</p>
                            <p className="text-sm text-muted-foreground mt-2">Los servicios y reparaciones aparecerán aquí</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {equipo?.mantenimientos && equipo?.mantenimientos.filter((m) =>
                            !searchTerm ||
                            m.tipoServicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.notas?.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                            .sort((a, b) => parseFirebaseDate(b.fecha).getTime() - parseFirebaseDate(a.fecha).getTime())
                            .map((mantenimiento, index) => {
                                return (
                                    <Card key={mantenimiento.id} className="border-2 hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between flex-wrap gap-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-mono">
                                                            #{equipo?.mantenimientos.length - index}
                                                        </Badge>
                                                        <CardTitle className="text-xl">
                                                            {mantenimiento.tipoServicio || "Mantenimiento General"}
                                                        </CardTitle>
                                                    </div>
                                                    <CardDescription className="flex items-center gap-3 flex-wrap">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(parseFirebaseDate(mantenimiento.fecha), "PPP", { locale: es })}
                                                        </span>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Gauge className="w-4 h-4" />
                                                            {mantenimiento.kmMomento.toLocaleString()} km
                                                        </span>
                                                    </CardDescription>
                                                </div>
                                                {mantenimiento.fechaProximo && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                                    >
                                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                        Próximo: {format(parseFirebaseDate(mantenimiento.fechaProximo), "PPP", { locale: es })}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6 pt-6">
                                            {/**
                                             * {mantenimiento.mecanico && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <Wrench className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Mecánico Responsable</p>
                                                        <p className="font-semibold text-lg">{mantenimiento.mecanico}</p>
                                                    </div>
                                                </div>
                                            )}
                                             */}

                                            {mantenimiento.notas && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        Notas del Servicio
                                                    </p>
                                                    <div className="p-4 rounded-lg bg-muted/50 border">
                                                        <p className="text-sm leading-relaxed">{mantenimiento.notas}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {mantenimiento.mantenimientoData && mantenimiento.mantenimientoData.length > 0 && (
                                                <div className="space-y-3">
                                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                                        <Package className="w-4 h-4" />
                                                        Detalles del Servicio
                                                    </p>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted/50">
                                                                    <TableHead className="font-semibold">Descripcion</TableHead>
                                                                    <TableHead className="text-center font-semibold">Cantidad</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {mantenimiento.mantenimientoData.map((item) => (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell className="font-medium">{item.descripcion}</TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Badge variant="outline">{item.cantidad}</Badge>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            )}

                                            {mantenimiento.Evidencia && mantenimiento.Evidencia.length > 0 ? (
                                                <div className="space-y-3">
                                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4" />
                                                        Evidencia Fotográfica ({mantenimiento.Evidencia.length})
                                                    </p>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {mantenimiento.Evidencia && mantenimiento.Evidencia.map((evidencia) => (
                                                            <div key={evidencia.id} className="relative group">
                                                                {evidencia && evidencia.tipo && evidencia?.tipo.startsWith("image") ? (
                                                                    <img
                                                                        src={evidencia.ruta || "/placeholder.svg"}
                                                                        alt={evidencia.nombre}
                                                                        className="w-full h-32 object-cover rounded-lg border-2 border-border"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-32 bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-border">
                                                                        <FileIcon className="w-10 h-10 text-muted-foreground mb-2" />
                                                                        <p className="text-xs text-muted-foreground text-center px-2 truncate w-full">
                                                                            {evidencia.nombre}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                                    <Button size="sm" variant="secondary">
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        Ver
                                                                    </Button>
                                                                    <Button size="sm" variant="secondary">
                                                                        <Download className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4" />
                                                        Evidencia Fotográfica (0)
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                    </div>
                )}
            </div>
        </TabsContent>
    )
}

export default MaintenanceTab