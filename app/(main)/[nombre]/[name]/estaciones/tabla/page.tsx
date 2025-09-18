"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEstacionesFilters } from "@/modules/logistica/estaciones/hooks/use-estaciones-filters"
import { EstacionDialog } from "@/modules/logistica/estaciones/components/estacion-dialog"
import EstacionesFilters from "@/modules/logistica/estaciones/components/filtros"
import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Card, CardContent } from "@/components/ui/card"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Edit, Eye, Plus, Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { IconGasStation } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"

const EstacionesTablePage = () => {
    const [selectedStation, setSelectedStation] = useState<EstacionServicio | null>(null)
    const { directLink } = useDirectLink("/estaciones/nuevo")
    const router = useRouter()

    const {
        searchTerm,
        setSearchTerm,
        dateRange,
        setDateRange,
        getMainContact,
        getStationFuelByType,
        filteredEstaciones,
        selectedTanquesRange,
        setSelectedTanquesRange,
        tanquesRange,
        filterCombustible,
        setFilterCombustible,
        capacidadRange,
        setSelectCapacidadRange,
        selectCapacidadRage
    } = useEstacionesFilters()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <IconGasStation className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Estaciones de servicio</h1>
                        <p className="text-muted-foreground">
                            Administre la informacion de sus estaciones de servicio
                        </p>
                    </div>
                </div>

                <Button
                    className="sm:w-auto"
                    onClick={() => router.push(directLink)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva estacion
                </Button>
            </div>
            <Separator className="mt-4 mb-8" />
            <EstacionesFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setDateRange={setDateRange}
                dateRange={dateRange}
                selectedTanquesRange={selectedTanquesRange}
                setSelectedTanquesRange={setSelectedTanquesRange}
                tanquesRange={tanquesRange}
                filterCombustible={filterCombustible}
                setFilterCombustible={setFilterCombustible}
                capacidadRange={capacidadRange}
                setSelectCapacidadRange={setSelectCapacidadRange}
                selectCapacidadRage={selectCapacidadRage}
            />
            <Separator className="my-8" />

            <Card className="mt-8">
                <CardContent>
                    <div className="overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-muted/50">
                                    <TableHead className="text-muted-foreground">Razon social</TableHead>
                                    <TableHead className="text-muted-foreground">Nombre corto</TableHead>
                                    <TableHead className="text-muted-foreground">Permiso CRE</TableHead>
                                    <TableHead className="text-muted-foreground">Ciudad</TableHead>
                                    <TableHead className="text-muted-foreground">Estado</TableHead>
                                    <TableHead className="text-muted-foreground">Productos</TableHead>
                                    <TableHead className="text-muted-foreground">Tanques</TableHead>
                                    <TableHead className="text-muted-foreground">Fecha Registro</TableHead>
                                    <TableHead className="text-muted-foreground">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEstaciones.map((station) => (
                                    <TableRow key={station.id} className="border-border hover:bg-muted/50">
                                        <TableCell className="font-medium text-foreground">{station.razonSocial}</TableCell>
                                        <TableCell className="font-medium text-foreground">{station.nombre}</TableCell>
                                        <TableCell className="font-medium text-foreground">{station.numeroPermisoCRE}</TableCell>
                                        <TableCell className="text-muted-foreground">{station.direccion.ciudad}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={station.activo ? "default" : "secondary"}
                                                className={
                                                    station.activo ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                                }
                                            >
                                                {station.activo ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {station.productos?.map((producto) => (
                                                    <Badge key={producto} variant="outline" className="text-xs border-border text-muted-foreground">
                                                        {producto}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-center">{station.tanques.length}</TableCell>
                                        <TableCell className="text-muted-foreground">{format(parseFirebaseDate(station.fechaRegistro), "PPP", { locale: es })}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedStation(station)}
                                                className="text-primary hover:text-primary-foreground hover:bg-primary"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:text-primary-foreground hover:bg-primary"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:text-primary-foreground hover:bg-primary"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredEstaciones.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No se encontraron estaciones que coincidan con los filtros.
                        </div>
                    )}
                </CardContent>
            </Card>

            <EstacionDialog selectedStation={selectedStation} setSelectedStation={setSelectedStation} />
        </div>
    )
}

export default EstacionesTablePage