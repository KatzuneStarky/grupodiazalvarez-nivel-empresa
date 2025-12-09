"use client"

import { useMantenimientosFilters } from "@/modules/mantenimiento/mantenimientos/hooks/use-mantenimientos-filters"
import { AlertTriangle, Calendar, CheckCircle, Clock, Edit, Eye, FileText, Gauge, Trash, User, Wrench, WrenchIcon } from "lucide-react"
import MantenimientoDialog from "@/modules/mantenimiento/mantenimientos/components/mantenimiento-dialog"
import MantenimientosFilters from "@/modules/mantenimiento/mantenimientos/components/filters"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Icon from "@/components/global/icon"
import { es } from "date-fns/locale"
import { format } from "date-fns"

const MantenimientosRegistrosPage = () => {
    const { directLink } = useDirectLink("/mantenimientos/nuevo")
    const {
        filterMantenimientos,
        handleTableCellClick,
        numEconomicoEquipo,
        setIsDialogOpen,
        selectedRecord,
        isDialogOpen,
        setEquipoId,
        equipoId,
        dateRange,
        setDateRange,
        equipos,
        kmRange,
        mecanico,
        searchTerm,
        selectedKmRange,
        setMecanico,
        setSearchTerm,
        setSelectedKmRange,
        setTipoServicioFilter,
        tipoServicioFilter,
        uniqueMecanicos,
        setSelectedRecord
    } = useMantenimientosFilters()
    const router = useRouter()

    if (equipoId === "") return setEquipoId("all")


    const getUrgencyBadge = (fechaProximo?: Date) => {
        if (!fechaProximo) return null

        const today = new Date()
        const nextDate = new Date(fechaProximo)
        const diffTime = nextDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Vencido
                </Badge>
            )
        } else if (diffDays <= 15) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Urgente
                </Badge>
            )
        } else if (diffDays <= 30) {
            return (
                <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                    <Clock className="w-3 h-3" />
                    Próximo
                </Badge>
            )
        } else {
            return (
                <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-green-700 border-green-300 dark:text-green-400 dark:border-green-600"
                >
                    <CheckCircle className="w-3 h-3" />
                    Al día
                </Badge>
            )
        }
    }

    const getDaysUntilNext = (fechaProximo?: Date) => {
        if (!fechaProximo) return null

        const today = new Date()
        const nextDate = new Date(fechaProximo)
        const diffTime = nextDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return `${Math.abs(diffDays)} días vencido`
        if (diffDays === 0) return "Hoy"
        if (diffDays === 1) return "Mañana"
        return `En ${diffDays} días`
    }

    const handleCardClick = (record: Mantenimiento) => {
        setSelectedRecord(record)
        setIsDialogOpen(true)
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon iconName='vaadin:tools' className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Registros de mantenimientos</h1>
                            <p className="text-muted-foreground">
                                Gestione la informacion de los mantenimientos de cada equipo registrado en la plataforma.
                            </p>
                        </div>
                    </div>

                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push(directLink)}>
                        <WrenchIcon className="h-4 w-4 mr-2" />
                        Nuevo Mantenimiento
                    </Button>
                </div>

                <Separator className="my-4" />
                <MantenimientosFilters
                    equipoId={equipoId}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    tipoServicioFilter={tipoServicioFilter}
                    setTipoServicioFilter={setTipoServicioFilter}
                    equipos={equipos}
                    kmRange={kmRange}
                    mecanico={mecanico}
                    searchTerm={searchTerm}
                    selectedKmRange={selectedKmRange}
                    setEquipoId={setEquipoId}
                    setMecanico={setMecanico}
                    setSearchTerm={setSearchTerm}
                    setSelectedKmRange={setSelectedKmRange}
                    uniqueMecanicos={uniqueMecanicos || []}
                />
                <Separator className="my-8" />

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterMantenimientos.map((mantenimiento) => (
                            <Card
                                key={mantenimiento.id}
                                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] relative overflow-hidden"
                                onClick={() => handleCardClick(mantenimiento)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-semibold text-balance">
                                            {mantenimiento.tipoServicio || "Mantenimiento"}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">Realizado:</span>
                                            <span>{format(parseFirebaseDate(mantenimiento.fecha), "PPP", { locale: es })}</span>
                                        </div>
                                        {mantenimiento.fechaProximo && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium text-muted-foreground">Próximo:</span>
                                                <span className="font-semibold text-foreground">{getDaysUntilNext(parseFirebaseDate(mantenimiento.fechaProximo))}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Gauge className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium text-muted-foreground">Kilometraje:</span>
                                        <span className="font-semibold text-foreground">{mantenimiento.kmMomento.toLocaleString()} km</span>
                                    </div>

                                    {/**
                                     * {mantenimiento.mecanico && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium text-muted-foreground">Mecánico:</span>
                                            <span className="font-semibold text-foreground">{mantenimiento.mecanico}</span>
                                        </div>
                                    )}
                                     */}

                                    {mantenimiento.mantenimientoData && mantenimiento.mantenimientoData.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Wrench className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium text-muted-foreground">Servicios:</span>
                                            <span className="font-semibold text-foreground">
                                                {mantenimiento.mantenimientoData.length} servicio{mantenimiento.mantenimientoData.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}

                                    {mantenimiento.Evidencia && mantenimiento.Evidencia.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium text-muted-foreground">Evidencia:</span>
                                            <span className="font-semibold text-foreground">{mantenimiento.Evidencia.length} archivos</span>
                                        </div>
                                    )}

                                    {mantenimiento.notas && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                                "{mantenimiento.notas.length > 80 ? `${mantenimiento.notas.substring(0, 80)}...` : mantenimiento.notas}"
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center justify-end w-full">
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button variant={"outline"} className="w-8 h-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            <Button variant={"outline"} className="w-8 h-8">
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <Button variant={"outline"} className="w-8 h-8">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>

                                {mantenimiento.fechaProximo &&
                                    (() => {
                                        const today = new Date()
                                        const nextDate = parseFirebaseDate(mantenimiento.fechaProximo)
                                        const diffTime = nextDate.getTime() - today.getTime()
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                                        if (diffDays <= 15) {
                                            return (
                                                <div className="absolute top-0 right-0">
                                                    <div className="relative w-[140px] h-[55px] bg-yellow-500 rotate-45 translate-x-[50px] -translate-y-[4px] flex items-center justify-center shadow-md">
                                                        <p className="text-xs font-bold text-white">Próximo</p>
                                                    </div>
                                                </div>
                                            )
                                        } else if (diffDays <= 30) {
                                            return (
                                                <div className="absolute top-0 right-0">
                                                    <div className="relative w-[140px] h-[55px] bg-green-500 rotate-45 translate-x-[50px] -translate-y-[4px] flex items-center justify-center shadow-md">
                                                        <p className="text-xs font-bold text-white">En tiempo</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    })()}
                            </Card>
                        ))}
                    </div>
                </div>

                <MantenimientoDialog
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    selectedRecord={selectedRecord}
                />
            </div>
        </main>
    )
}

export default MantenimientosRegistrosPage