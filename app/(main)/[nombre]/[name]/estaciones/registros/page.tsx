"use client"

import { Building, Calendar, ChevronLeft, ChevronRight, Clock, Droplets, FileText, Fuel, Mail, MapPin, Phone, Plus, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEstaciones } from "@/modules/logistica/estaciones/hooks/use-estaciones"
import { EstacionServicio } from "@/modules/logistica/estaciones/types/estacion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { IconGasStation } from "@tabler/icons-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"
import EstacionesFilters from "@/modules/logistica/estaciones/components/filtros"

const RegistrosEstacionesPage = () => {
    const [currentFuelSlides, setCurrentFuelSlides] = useState<Record<string, number>>({})
    const [selectedStation, setSelectedStation] = useState<EstacionServicio | null>(null)

    const { directLink } = useDirectLink("/estaciones/nuevo")
    const { estaciones } = useEstaciones()
    const router = useRouter()

    const getMainContact = (station: EstacionServicio) => {
        if (station.contacto.responsable) return station.contacto.responsable
        if (station.contacto.telefono) return station.contacto.telefono
        if (station.contacto.email) return station.contacto.email
        return "Sin contacto"
    }

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

    const getStationFuelByType = (station: EstacionServicio) => {
        const fuelTypes = new Map<
            string,
            { tanks: typeof station.tanques; totalCapacity: number; currentCapacity: number }
        >()

        station.tanques.forEach((tanque) => {
            const tipo = tanque.tipoCombustible
            if (!fuelTypes.has(tipo)) {
                fuelTypes.set(tipo, { tanks: [], totalCapacity: 0, currentCapacity: 0 })
            }
            const fuelData = fuelTypes.get(tipo)!
            fuelData.tanks.push(tanque)
            fuelData.totalCapacity += tanque.capacidadTotal
            fuelData.currentCapacity += tanque.capacidadActual
        })

        return Array.from(fuelTypes.entries()).map(([tipo, data]) => ({
            tipo,
            tanks: data.tanks,
            totalCapacity: data.totalCapacity,
            currentCapacity: data.currentCapacity,
            percentage: data.totalCapacity > 0 ? (data.currentCapacity / data.totalCapacity) * 100 : 0,
        }))
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
            <EstacionesFilters />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {estaciones.map((estacion) => {
                    const fuelByType = getStationFuelByType(estacion)
                    const currentSlideIndex = currentFuelSlides[estacion.id] || 0
                    const currentFuelSlide = fuelByType[currentSlideIndex]

                    return (
                        <motion.div
                            key={estacion.id}
                        >
                            <Card
                                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                                onClick={() => setSelectedStation(estacion)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg font-semibold text-balance leading-tight">{estacion.nombre}</CardTitle>
                                        <Badge
                                            variant={estacion.activo ? "default" : "secondary"}
                                            className={estacion.activo ? "bg-green-500 hover:bg-green-600" : ""}
                                        >
                                            {estacion.activo ? "Activa" : "Inactiva"}
                                        </Badge>
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
                                                        {currentFuelSlide.tanks.length} tanque{currentFuelSlide.tanks.length !== 1 ? "s" : ""}
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

            <Dialog open={!!selectedStation} onOpenChange={() => setSelectedStation(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedStation && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-balance">{selectedStation.nombre}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            Información General
                                        </h3>
                                        <div className="space-y-1 text-sm">
                                            {selectedStation.razonSocial && (
                                                <p>
                                                    <span className="font-medium">Razón Social:</span> {selectedStation.razonSocial}
                                                </p>
                                            )}
                                            {selectedStation.rfc && (
                                                <p>
                                                    <span className="font-medium">RFC:</span> {selectedStation.rfc}
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-medium">Estado:</span>
                                                <Badge className="ml-2" variant={selectedStation.activo ? "default" : "secondary"}>
                                                    {selectedStation.activo ? "Activa" : "Inactiva"}
                                                </Badge>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Fechas
                                        </h3>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="font-medium">Fecha de Registro:</span>{" "}
                                                {format(parseFirebaseDate(selectedStation.fechaRegistro), "PPP", { locale: es })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Dirección
                                    </h3>
                                    <div className="text-sm space-y-1">
                                        <p>
                                            {selectedStation.direccion.calle} {selectedStation.direccion.numeroExterior}
                                            {selectedStation.direccion.numeroInterior && ` Int. ${selectedStation.direccion.numeroInterior}`}
                                        </p>
                                        <p>{selectedStation.direccion.colonia}</p>
                                        <p>
                                            {selectedStation.direccion.ciudad}, {selectedStation.direccion.estado}
                                        </p>
                                        <p>
                                            {selectedStation.direccion.codigoPostal}, {selectedStation.direccion.pais}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Coordenadas: {selectedStation.ubicacion?.lat}, {selectedStation.ubicacion?.lng}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h3 className="font-semibold">Contacto</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        {selectedStation.contacto.telefono && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                <span>{selectedStation.contacto.telefono}</span>
                                            </div>
                                        )}
                                        {selectedStation.contacto.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                <span>{selectedStation.contacto.email}</span>
                                            </div>
                                        )}
                                        {selectedStation.contacto.responsable && (
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>{selectedStation.contacto.responsable}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStation.numeroPermisoCRE && (
                                        <div className="space-y-2">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Permiso CRE
                                            </h3>
                                            <p className="text-sm">{selectedStation.numeroPermisoCRE}</p>
                                        </div>
                                    )}

                                    {selectedStation.horarios && (
                                        <div className="space-y-2">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Horarios
                                            </h3>
                                            <p className="text-sm">{selectedStation.horarios}</p>
                                        </div>
                                    )}
                                </div>

                                {selectedStation.productos && selectedStation.productos.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Productos Ofrecidos</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedStation.productos.map((producto, index) => (
                                                    <Badge key={index} className={getFuelTypeColor(producto)}>
                                                        {producto}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Fuel className="h-4 w-4" />
                                        Tanques de Combustible ({selectedStation.tanques.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedStation.tanques.map((tanque, index) => {
                                            const percentage = (tanque.capacidadActual / tanque.capacidadTotal) * 100

                                            return (
                                                <Card
                                                    key={index}
                                                    className="p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-l-4 border-l-blue-500"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <Badge className={getFuelTypeColor(tanque.tipoCombustible)}>
                                                                {tanque.tipoCombustible}
                                                            </Badge>
                                                            {tanque.numeroTanque && (
                                                                <span className="text-sm font-medium text-muted-foreground">
                                                                    #{tanque.numeroTanque}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-muted-foreground">Nivel actual</span>
                                                                <span className="text-lg font-bold">{Math.round(percentage)}%</span>
                                                            </div>

                                                            <Progress value={percentage} className="h-3" />

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                                                                    <div className="font-medium text-blue-700 dark:text-blue-300">Actual</div>
                                                                    <div className="text-lg font-bold">{tanque.capacidadActual.toLocaleString()}</div>
                                                                    <div className="text-xs text-muted-foreground">litros</div>
                                                                </div>
                                                                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                                    <div className="font-medium text-gray-700 dark:text-gray-300">Total</div>
                                                                    <div className="text-lg font-bold">{tanque.capacidadTotal.toLocaleString()}</div>
                                                                    <div className="text-xs text-muted-foreground">litros</div>
                                                                </div>
                                                            </div>

                                                            {tanque.fechaUltimaRecarga && (
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>Última recarga: {format(parseFirebaseDate(tanque.fechaUltimaRecarga), "PPP", { locale: es})}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RegistrosEstacionesPage