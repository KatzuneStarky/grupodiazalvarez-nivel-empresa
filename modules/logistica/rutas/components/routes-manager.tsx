"use client"

import { useState } from "react"
import { ClasificacionRuta, Ruta, TipoViaje } from "../../equipos/types/rutas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Eye, Grid, List, Map, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import RouteCard from "./route-card"

interface RouteTableProps {
    routes: Ruta[]
}

const RoutesManager = ({ routes }: RouteTableProps) => {
    const [filterClasificacion, setFilterClasificacion] = useState<ClasificacionRuta | "all">("all")
    const [filterActiva, setFilterActiva] = useState<"all" | "active" | "inactive">("all")
    const [filterTipoViaje, setFilterTipoViaje] = useState<TipoViaje | "all">("all")
    const [sortBy, setSortBy] = useState<"distance" | "client" | "date">("client")
    const [selectedRoute, setSelectedRoute] = useState<Ruta | null>(null)
    const [viewMode, setViewMode] = useState<"table" | "cards">("table")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
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
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
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
        </div>
    )
}

export default RoutesManager