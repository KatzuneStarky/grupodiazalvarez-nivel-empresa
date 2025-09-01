"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClasificacionRuta, Ruta, TipoViaje } from "../../equipos/types/rutas"
import { Edit, Eye, Grid, List, Map, Search, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import RouteMapPage from "./route-map"
import RouteCard from "./route-card"
import { useState } from "react"

interface RouteTableProps {
    routes: Ruta[]
}

const RoutesManager = ({ routes }: RouteTableProps) => {
    const [filterClasificacion, setFilterClasificacion] = useState<ClasificacionRuta | "all">("all")
    const [filterActiva, setFilterActiva] = useState<"all" | "active" | "inactive">("all")
    const [filterTipoViaje, setFilterTipoViaje] = useState<TipoViaje | "all">("all")
    const [sortBy, setSortBy] = useState<"distance" | "client" | "date">("client")
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
    const [selectedRoute, setSelectedRoute] = useState<Ruta | null>(null)
    const [viewMode, setViewMode] = useState<"table" | "cards">("table")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [showMapModal, setShowMapModal] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    const itemsPerPage = 10

    const filteredRoutes = routes
        .filter((route) => {
            const matchesSearch =
                //route.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                route?.origen?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                route?.destino?.nombre.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesTipoViaje = filterTipoViaje === "all" || route.tipoViaje === filterTipoViaje
            const matchesClasificacion = filterClasificacion === "all" || route.clasificacion === filterClasificacion
            const matchesActiva =
                filterActiva === "all" ||
                (filterActiva === "active" && route.activa) ||
                (filterActiva === "inactive" && !route.activa)

            return matchesSearch && matchesTipoViaje && matchesClasificacion && matchesActiva
        })
        .sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case "distance":
                    comparison = a.trayecto.kilometros - b.trayecto.kilometros
                    break
                case "client":
                    //comparison = (a.cliente?.nombre || "").localeCompare(b.cliente?.nombre || "")
                    break
                case "date":
                    comparison = a.id.localeCompare(b.id) // Using ID as proxy for creation date
                    break
            }

            return sortOrder === "asc" ? comparison : -comparison
        })

    const handleViewMap = (route: Ruta) => {
        setSelectedRoute(route)
        setShowMapModal(true)
    }

    const handleViewDetails = (route: Ruta) => {
        setSelectedRoute(route)
        setShowDetailsModal(true)
    }

    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedRoutes = filteredRoutes.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Filtros y Búsqueda
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "table" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("table")}
                            >
                                <List className="h-4 w-4 mr-1" />
                                Tabla
                            </Button>
                            <Button
                                variant={viewMode === "cards" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("cards")}
                            >
                                <Grid className="h-4 w-4 mr-1" />
                                Tarjetas
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="col-span-2">
                            <Input
                                placeholder="Buscar por cliente, origen o destino..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select value={filterTipoViaje} onValueChange={(value: TipoViaje | "all") => setFilterTipoViaje(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tipo de viaje" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="local">Local</SelectItem>
                                <SelectItem value="foráneo">Foráneo</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterClasificacion}
                            onValueChange={(value: ClasificacionRuta | "all") => setFilterClasificacion(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Clasificación" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las clasificaciones</SelectItem>
                                <SelectItem value="material peligroso">Material Peligroso</SelectItem>
                                <SelectItem value="grava de 3/4">Grava de 3/4</SelectItem>
                                <SelectItem value="cemento">Cemento</SelectItem>
                                <SelectItem value="arena">Arena</SelectItem>
                                <SelectItem value="agua">Agua</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterActiva}
                            onValueChange={(value: "all" | "active" | "inactive") => setFilterActiva(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="active">Activas</SelectItem>
                                <SelectItem value="inactive">Inactivas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Ordenar por:</span>
                            <Select value={sortBy} onValueChange={(value: "distance" | "client" | "date") => setSortBy(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Cliente</SelectItem>
                                    <SelectItem value="distance">Distancia</SelectItem>
                                    <SelectItem value="date">Fecha</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground">
                Mostrando {paginatedRoutes.length} de {filteredRoutes.length} rutas
            </div>

            {viewMode === "table" ? (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Origen</TableHead>
                                    <TableHead>Destino</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Clasificación</TableHead>
                                    <TableHead>Distancia</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedRoutes.map((route) => (
                                    <TableRow key={route.id}>
                                        <TableCell className="font-medium">{route.cliente}</TableCell>
                                        <TableCell>{route.origen?.nombre}</TableCell>
                                        <TableCell>{route.destino?.nombre}</TableCell>
                                        <TableCell>
                                            <Badge variant={route.tipoViaje === "local" ? "secondary" : "default"}>{route.tipoViaje}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{route.clasificacion}</Badge>
                                        </TableCell>
                                        <TableCell>{route.trayecto.kilometros} km</TableCell>
                                        <TableCell>
                                            <Badge variant={route.activa ? "default" : "secondary"}>
                                                {route.activa ? "Activa" : "Inactiva"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(route)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleViewMap(route)}>
                                                    <Map className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedRoutes.map((route) => (
                        <RouteCard key={route.id} route={route} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
                <DialogContent className="max-w-5xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Map className="h-5 w-5" />
                            Mapa de Ruta: {selectedRoute?.origen?.nombre} → {selectedRoute?.destino?.nombre}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedRoute && (
                        <div className="space-y-4 p-8">
                            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{selectedRoute.trayecto.kilometros}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Kilómetro{selectedRoute.trayecto.kilometros > 1 ? "s" : ""}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{selectedRoute.trayecto.horas}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Hora
                                        {selectedRoute.trayecto.horas > 1 || selectedRoute.trayecto.horas === 0 ? "s" : ""}
                                    </div>
                                </div>
                                <div className="text-center capitalize">
                                    <div className="text-lg font-semibold">{selectedRoute.trayecto.tipoTrayecto}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Tipo de Trayecto
                                    </div>
                                </div>
                            </div>
                            <RouteMapPage origen={selectedRoute.origen} destino={selectedRoute.destino} className="h-96 w-full" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Eye className="h-6 w-6 text-blue-600" />
                            Detalles Completos de la Ruta
                        </DialogTitle>
                    </DialogHeader>
                    <Separator />
                    {selectedRoute && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full ${selectedRoute.activa ? "bg-green-500" : "bg-red-500"}`} />
                                    <div>
                                        <h3 className="font-semibold text-lg capitalize">{selectedRoute.descripcion}</h3>
                                        <p className="text-sm text-muted-foreground">ID: {selectedRoute.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={selectedRoute.activa ? "default" : "secondary"} className="px-3 py-1">
                                        {selectedRoute.activa ? "Activa" : "Inactiva"}
                                    </Badge>
                                    <Badge variant={selectedRoute.viajeFacturable ? "default" : "outline"} className="px-3 py-1">
                                        {selectedRoute.viajeFacturable ? "Facturable" : "No Facturable"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{selectedRoute.trayecto.kilometros}</div>
                                        <div className="text-sm text-blue-700 font-medium">
                                            Kilómetro{selectedRoute.trayecto.kilometros > 1 ? "s" : ""}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-orange-600">{selectedRoute.trayecto.horas}</div>
                                        <div className="text-sm text-orange-700 font-medium">
                                            Hora{selectedRoute.trayecto.horas > 1 || selectedRoute.trayecto.horas === 0 ? "s" : ""}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                    <CardContent className="p-4 text-center capitalize">
                                        <div className="text-lg font-bold text-green-600">{selectedRoute.tipoViaje}</div>
                                        <div className="text-sm text-green-700 font-medium">Tipo de Viaje</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                    <CardContent className="p-4 text-center capitalize">
                                        <div className="text-lg font-bold text-purple-600">{selectedRoute.trayecto.tipoTrayecto}</div>
                                        <div className="text-sm text-purple-700 font-medium">Tipo Trayecto</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-2">
                                <CardHeader className="">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Map className="h-5 w-5 text-slate-600" />
                                        Información de Ruta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg border border-green-200">
                                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                                            <div>
                                                <div className="text-sm font-medium text-green-500">Origen</div>
                                                <div className="font-semibold text-green-600">{selectedRoute.origen?.nombre}</div>
                                                <div className="text-sm text-green-800">
                                                    Lat: {selectedRoute.origen?.latitud}, Lng: {selectedRoute.origen?.longitud}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg border border-red-200">
                                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                                            <div>
                                                <div className="text-sm font-medium text-red-500">Destino</div>
                                                <div className="font-semibold text-red-600">{selectedRoute.destino?.nombre}</div>
                                                <div className="text-sm text-red-800">
                                                    Lat: {selectedRoute.destino?.latitud}, Lng: {selectedRoute.destino?.longitud}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-muted-foreground">Clasificación:</span>
                                            <Badge variant="outline" className="font-medium capitalize">
                                                {selectedRoute.clasificacion}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-muted-foreground">Descripción:</span>
                                            <span className="text-sm font-medium text-right max-w-48">{selectedRoute.descripcion}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RoutesManager