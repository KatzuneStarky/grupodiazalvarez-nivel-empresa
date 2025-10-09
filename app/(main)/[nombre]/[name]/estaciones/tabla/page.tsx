"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteEstacionDialog from "@/modules/logistica/estaciones/components/delete-estacion-dialog"
import { useEstacionesFilters } from "@/modules/logistica/estaciones/hooks/use-estaciones-filters"
import { exportEstaciones } from "@/functions/excel-export/estaciones/export/export-estaciones"
import { EstacionDialog } from "@/modules/logistica/estaciones/components/estacion-dialog"
import EstacionesFilters from "@/modules/logistica/estaciones/components/filtros"
import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion"
import { IconFileExport, IconGasStation } from "@tabler/icons-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Card, CardContent } from "@/components/ui/card"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Edit, Eye, Plus, Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"

const EstacionesTablePage = () => {
    const [selectedStation, setSelectedStation] = useState<EstacionServicio | null>(null)
    const { directLink } = useDirectLink("/estaciones")
    const { area } = useArea()
    const router = useRouter()

    const {
        searchTerm,
        setSearchTerm,
        dateRange,
        setDateRange,
        filteredEstaciones,
        selectedTanquesRange,
        setSelectedTanquesRange,
        tanquesRange,
        filterCombustible,
        setFilterCombustible,
        capacidadRange,
        setSelectCapacidadRange,
        selectCapacidadRage,
        estaciones
    } = useEstacionesFilters()

    const getFuelLevelColor = (percentage: number) => {
        if (percentage >= 70) return "bg-green-500"
        if (percentage >= 40) return "bg-yellow-500"
        return "bg-red-500"
    }

    const handleExportEstaciones = async () => {
        try {
            toast.promise(exportEstaciones(estaciones, area?.nombre || ""), {
                loading: "Exportando datos...",
                success: "Datos exportados con éxito",
                error: "Error al exportar datos"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageTitle
                icon={<IconGasStation className="h-12 w-12 text-primary" />}
                title='Estaciones de servicio'
                description='Administre la informacion de sus estaciones de servicio'
                hasActions
                actions={
                    <>
                        <Button
                            className="sm:w-auto"
                            onClick={() => handleExportEstaciones()}
                        >
                            <IconFileExport className="w-4 h-4 mr-2" />
                            Exportar Datos
                        </Button>

                        <Button
                            className="sm:w-auto"
                            onClick={() => router.push(`${directLink}/nuevo`)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva estacion
                        </Button>
                    </>
                }
            />
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
                                                onClick={() => router.push(`${directLink}/editar?estacionId=${station.id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <DeleteEstacionDialog estacionId={station.id} className="text-primary hover:text-primary-foreground hover:bg-primary" />
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

            <EstacionDialog
                selectedStation={selectedStation}
                setSelectedStation={setSelectedStation}
                getFuelLevelColor={getFuelLevelColor}
            />
        </div>
    )
}

export default EstacionesTablePage