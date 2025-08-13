"use client"

import { STATUS_COLORS, STATUS_LABELS, StatusSummaryItem } from "@/modules/logistica/estado/types/estado-dashboard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UpdateEstadoEquipoForm from "@/modules/logistica/estado/components/update-state-form"
import { useEstadoEquipo } from "@/modules/logistica/estado/hooks/use-estado-equipos"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { getStatusConfig } from "@/modules/logistica/estado/constants/status"
import { StateCard } from "@/modules/logistica/estado/components/state-card"
import { Download, Filter, Search, Truck, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

const EstadoEquiposPage = () => {
    const { equipos, isLoading } = useEquipos()
    const {
        estadoCount,
        loading,
    } = useEstadoEquipo({ equipos, isLoading })

    const [sortBy, setSortBy] = useState<"status" | "year" | "maintenance">("status")
    const [yearRange, setYearRange] = useState([2000, new Date().getFullYear()])
    const [selectedStatuses, setSelectedStatuses] = useState<EstadoEquipos[]>([])
    const [capacityFilter, setCapacityFilter] = useState("")
    const [showInactive, setShowInactive] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const statusSummary: StatusSummaryItem[] = useMemo(() => {
        const summary = Object.values(EstadoEquipos).map((status) => ({
            status,
            count: equipos.filter((eq) => eq.estado === status).length,
            color: STATUS_COLORS[status],
            label: STATUS_LABELS[status],
        }))
        return summary.filter((item) => item.count > 0)
    }, [equipos])

    const filteredEquipment = useMemo(() => {
        const filtered = equipos.filter((eq) => {
            const matchesSearch =
                searchTerm === "" ||
                eq.numEconomico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                eq.placas && eq.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
                eq.serie && eq.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                eq.tipoTanque && eq.tipoTanque.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(eq.estado)
            const matchesActive = showInactive || eq.activo
            const matchesYear = eq.year >= yearRange[0] && eq.year <= yearRange[1]
            const matchesCapacity = capacityFilter === "" || eq.m3 && eq.m3.toString().includes(capacityFilter)

            return matchesSearch && matchesStatus && matchesActive && matchesYear && matchesCapacity
        })

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "status":
                    return a.numEconomico.localeCompare(b.numEconomico, 'es', { sensitivity: 'base' })
                case "year":
                    return b.year - a.year
                /**
                 * case "maintenance":
                    const aDate = a.nextMaintenanceDue?.getTime() || 0
                    const bDate = b.nextMaintenanceDue?.getTime() || 0
                    return aDate - bDate
                 */
                default:
                    return 0
            }
        })

        return filtered
    }, [equipos, searchTerm, selectedStatuses, showInactive, yearRange, capacityFilter, sortBy])

    const toggleStatusFilter = (status: EstadoEquipos) => {
        setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
    }

    const clearAllFilters = () => {
        setSearchTerm("")
        setSelectedStatuses([])
        setShowInactive(false)
        setYearRange([2000, new Date().getFullYear()])
        setCapacityFilter("")
    }

    const activeFiltersCount = [
        searchTerm !== "",
        selectedStatuses.length > 0,
        showInactive,
        yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear(),
        capacityFilter !== "",
    ].filter(Boolean).length

    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Estado de la flota
                        </h1>
                        <p className="text-muted-foreground">
                            Gestion del estado actual de los equipos
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Card className="w-full px-4">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {Object.entries(estadoCount).map(([state, count]) => (
                            <StateCard key={state} state={state as EstadoEquipos} count={count} />
                        ))}
                    </div>
                </Card>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Estado de los equipos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="hidden md:block">
                                    <div className="flex h-8 rounded-lg overflow-hidden bg-gray-200">
                                        {statusSummary.map((item, index) => {
                                            const percentage = (item.count / equipos.length) * 100
                                            return (
                                                <Tooltip key={item.status}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`${item.color} cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-white text-sm font-medium`}
                                                            style={{ width: `${percentage}%` }}
                                                            onClick={() => toggleStatusFilter(item.status)}
                                                        >
                                                            {item.count}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            {item.label}: {item.count} trucks ({percentage.toFixed(1)}%)
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="md:hidden space-y-2">
                                    {statusSummary.map((item) => (
                                        <div key={item.status} className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${item.color}`} />
                                            <span className="flex-1 text-sm">{item.label}</span>
                                            <Badge variant="secondary">{item.count}</Badge>
                                        </div>
                                    ))}
                                </div>

                                <div className="hidden md:flex flex-wrap gap-4 text-sm">
                                    {statusSummary.map((item) => (
                                        <div key={item.status} className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                            <span>{item.label}</span>
                                            <Badge variant="outline">{item.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar equipo por numero economico..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filtrar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="status">Filtrar por estado</SelectItem>
                                    <SelectItem value="year">Filtrar por año</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                                {activeFiltersCount > 0 && (
                                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Filtros avanzados</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                                        <X className="h-4 w-4 mr-2" />
                                        Limpiar todo
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-medium mb-3">Estado</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.values(EstadoEquipos).map((status) => (
                                            <div key={status} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={status}
                                                    checked={selectedStatuses.includes(status)}
                                                    onCheckedChange={() => toggleStatusFilter(status)}
                                                />
                                                <label htmlFor={status} className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`} />
                                                    {STATUS_LABELS[status]}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-3">Rango de años</h4>
                                        <div className="px-3">
                                            <Slider
                                                value={yearRange}
                                                onValueChange={setYearRange}
                                                min={2000}
                                                max={new Date().getFullYear()}
                                                step={1}
                                                className="w-full place-items-center"
                                            />
                                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                <span>{yearRange[0]}</span>
                                                <span>{yearRange[1]}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">Capacidad (M³)</h4>
                                        <Input
                                            placeholder="Filtrar por capacidad (M³)"
                                            value={capacityFilter}
                                            onChange={(e) => setCapacityFilter(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">Opciones</h4>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="inactive" checked={showInactive} />
                                            <label htmlFor="inactive" className="text-sm cursor-pointer">
                                                Mostrar equipos inactivos
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        {activeFiltersCount > 0 && (
                            <span>
                                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {equipos.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400 mb-2">No se encontraron equipos</h3>
                                <p className="text-gray-500">Intenta ajustar el criterio de busqueda</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {filteredEquipment.map((equipo) => {
                                const { bgColor, textColor, icon: IconComponent, label } = getStatusConfig(equipo.estado);
                                return (
                                    <Dialog key={equipo.id}>
                                        <DialogTrigger asChild>
                                            <div
                                                className={cn(
                                                    `max-w-sm mx-auto rounded-xl shadow-lg 
                                                overflow-hidden hover:shadow-xl duration-300 
                                                transform hover:-translate-y-1 w-full h-full flex flex-col
                                                cursor-pointer transition-all `,
                                                    bgColor
                                                )}
                                            >
                                                <div className="p-6 flex flex-col h-full">
                                                    <div className="flex-shrink-0">
                                                        <div className="text-sm text-gray-600 mb-1">
                                                            Numero económico
                                                        </div>
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            {equipo.numEconomico}
                                                        </div>
                                                    </div>

                                                    <div className={`flex items-center 
                                                    justify-center h-full rounded-lg my-4 w-full`}>
                                                        <div className={textColor + " mr-3"}>
                                                            <IconComponent className={textColor + " text-2xl"} />
                                                        </div>
                                                        <div>
                                                            <div className={textColor + " font-medium text-sm"}>
                                                                {label}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Cambiar el estado del equipo {equipo.numEconomico}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <UpdateEstadoEquipoForm equipo={equipo} />
                                        </DialogContent>
                                    </Dialog>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EstadoEquiposPage