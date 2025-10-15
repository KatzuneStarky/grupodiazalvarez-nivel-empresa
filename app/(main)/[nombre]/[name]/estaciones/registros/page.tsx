"use client"

import { ChevronLeft, ChevronRight, Droplets, Fuel, Import, MapPin, Plus, User } from "lucide-react"
import { useEstacionesFilters } from "@/modules/logistica/estaciones/hooks/use-estaciones-filters"
import { importEstaciones } from "@/functions/excel-export/estaciones/import/import-estaciones"
import { exportEstaciones } from "@/functions/excel-export/estaciones/export/export-estaciones"
import { EstacionDialog } from "@/modules/logistica/estaciones/components/estacion-dialog"
import EstacionActions from "@/modules/logistica/estaciones/components/estacion-actions"
import EstacionesFilters from "@/modules/logistica/estaciones/components/filtros"
import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconFileExport, IconGasStation } from "@tabler/icons-react"
import ImportDialog from "@/components/custom/import-dialog"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"

const RegistrosEstacionesPage = () => {
    const [currentFuelSlides, setCurrentFuelSlides] = useState<Record<string, number>>({})
    const [selectedStation, setSelectedStation] = useState<EstacionServicio | null>(null)
    const [open, setOpen] = useState<boolean>(false)

    const { directLink } = useDirectLink("/estaciones")
    const router = useRouter()
    const { area } = useArea()
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
        selectCapacidadRage,
        estaciones
    } = useEstacionesFilters()

    const getFuelTypeColor = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case "Magna":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Premium":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "Diesel":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getFuelLevelColor = (percentage: number) => {
        if (percentage >= 70) return "bg-green-500"
        if (percentage >= 40) return "bg-yellow-500"
        return "bg-red-500"
    }

    const nextFuelSlide = (stationId: string, maxSlides: number) => {
        setCurrentFuelSlides((prev) => ({
            ...prev,
            [stationId]: ((prev[stationId] || 0) + 1) % maxSlides,
        }))
    }

    const prevFuelSlide = (stationId: string, maxSlides: number) => {
        setCurrentFuelSlides((prev) => ({
            ...prev,
            [stationId]: ((prev[stationId] || 0) - 1 + maxSlides) % maxSlides,
        }))
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
                            onClick={() => setOpen(!open)}
                        >
                            <Import className="w-4 h-4 mr-2" />
                            Importar Datos
                        </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEstaciones.map((estacion) => {
                    const fuelByType = getStationFuelByType(estacion)
                    const currentSlideIndex = currentFuelSlides[estacion.id] || 0
                    const currentFuelSlide = fuelByType[currentSlideIndex]

                    return (
                        <motion.div
                            key={estacion.id}
                        >
                            <Card
                                className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg font-semibold text-balance leading-tight">{estacion.nombre}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={estacion.activo ? "default" : "secondary"}
                                                className={estacion.activo ? "bg-green-500 hover:bg-green-600" : ""}
                                            >
                                                {estacion.activo ? "Activa" : "Inactiva"}
                                            </Badge>

                                            <EstacionActions
                                                directLink={directLink}
                                                estacionId={estacion.id}
                                                setSelectedStation={setSelectedStation}
                                                selectedStation={estacion}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <span className="truncate">
                                            {estacion.direccion.ciudad}, {estacion.direccion.estado}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4 text-purple-500" />
                                        <span className="truncate">{getMainContact(estacion)}</span>
                                    </div>

                                    <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Fuel className="h-4 w-4 text-orange-500" />
                                                <span className="text-sm font-medium">
                                                    {estacion.tanques.length} tanque{estacion.tanques.length !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                            {fuelByType.length > 1 && (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            prevFuelSlide(estacion.id, fuelByType.length)
                                                        }}
                                                    >
                                                        <ChevronLeft className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-xs text-muted-foreground">
                                                        {currentSlideIndex + 1}/{fuelByType.length}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            nextFuelSlide(estacion.id, fuelByType.length)
                                                        }}
                                                    >
                                                        <ChevronRight className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {currentFuelSlide && (
                                            <motion.div
                                                key={`${estacion.id}-${currentSlideIndex}`}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Badge className={`${getFuelTypeColor(currentFuelSlide.tipo)} font-medium`}>
                                                        {currentFuelSlide.tipo}
                                                    </Badge>
                                                    <div className="flex items-center gap-1">
                                                        <Droplets className="h-3 w-3 text-blue-500" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {Math.round(currentFuelSlide.percentage)}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${getFuelLevelColor(currentFuelSlide.percentage)}`}
                                                            style={{ width: `${currentFuelSlide.percentage}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>{currentFuelSlide.currentCapacity.toLocaleString()} L</span>
                                                        <span>{currentFuelSlide.totalCapacity.toLocaleString()} L</span>
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        {estacion.tanques.length} tanque{estacion.tanques.length !== 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            <EstacionDialog
                selectedStation={selectedStation}
                setSelectedStation={setSelectedStation}
                getFuelLevelColor={getFuelLevelColor}
            />

            <ImportDialog
                open={open}
                onOpenChange={setOpen}
                title="Importar estaciones"
                description="Suba un archivo excel con los datos solicitados para cada registro de una estacion"
                onImport={importEstaciones}
                acceptedFormats=".xlsx,.xls"
            />
        </div>
    )
}

export default RegistrosEstacionesPage