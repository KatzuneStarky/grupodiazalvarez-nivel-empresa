"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPhysicalStateColor } from '@/modules/logistica/tanques/constants/physical-status-color'
import { getFuelTypeColor } from '@/modules/logistica/tanques/constants/fuel-type-color'
import { Calendar, FileText, Fuel, MapPin, Plus, Search, Shield, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEquipos } from '@/modules/logistica/bdd/equipos/hooks/use-equipos'
import { useDirectLink } from '@/hooks/use-direct-link'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Timestamp } from 'firebase/firestore'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Icon from '@/components/global/icon'
import { useMemo, useState } from "react"
import { es } from 'date-fns/locale'
import { format } from 'date-fns'

const TanquesPage = () => {
    const [physicalStateFilter, setPhysicalStateFilter] = useState<string>("all")
    const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [brandFilter, setBrandFilter] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")

    const { directLink } = useDirectLink("equipos/tanques/nuevo")
    const { equipos } = useEquipos()
    const router = useRouter()

    const allTanks = useMemo(() => {
        return equipos.flatMap((equipo) =>
            equipo.tanque.map((tanque) => ({
                ...tanque,
                vehicleInfo: {
                    numEconomico: equipo.numEconomico,
                    marca: equipo.marca,
                    modelo: equipo.modelo,
                    year: equipo.year,
                },
            })),
        )
    }, [equipos])

    const filteredTanks = useMemo(() => {
        return allTanks.filter((tank) => {
            const matchesSearch =
                searchTerm === "" ||
                tank.numeroTanque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tank.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tank.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tank.vehicleInfo.numEconomico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tank.serie?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesFuelType = fuelTypeFilter === "all" || tank.tipoCombustible === fuelTypeFilter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && tank.activo) ||
                (statusFilter === "inactive" && !tank.activo)
            const matchesPhysicalState = physicalStateFilter === "all" || tank.estadoFisico === physicalStateFilter
            const matchesBrand = brandFilter === "all" || tank.marca === brandFilter

            return matchesSearch && matchesFuelType && matchesStatus && matchesPhysicalState && matchesBrand
        })
    }, [allTanks, searchTerm, fuelTypeFilter, statusFilter, physicalStateFilter, brandFilter])

    const uniqueFuelTypes = [...new Set(allTanks.map((tank) => tank.tipoCombustible))]
    const uniquePhysicalStates = [...new Set(allTanks.map((tank) => tank.estadoFisico).filter(Boolean))]
    const uniqueBrands = [...new Set(allTanks.map((tank) => tank.marca))]

    const clearFilters = () => {
        setSearchTerm("")
        setFuelTypeFilter("all")
        setStatusFilter("all")
        setPhysicalStateFilter("all")
        setBrandFilter("all")
    }

    const getStatusColor = (activo?: boolean) => {
        return activo ? "bg-green-500" : "bg-gray-400"
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon iconName='mdi:train-car-tank' className="h-12 w-12 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Tanques de equipos</h1>
                    <p className="text-muted-foreground">
                        Gestione la informacion de los tanques de cada equipo registrado en la plataforma.
                    </p>
                </div>
            </div>

            <Separator className="my-4" />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className='flex items-center gap-2'>
                            <Search className="h-5 w-5" />
                            Búsqueda y Filtros
                        </div>

                        <Button onClick={() => router.push(directLink)}>
                            <Plus className='h-5 w-5' />
                            Nuevo tanque
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por número de tanque, marca, modelo, serie o vehículo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Tipo de Combustible" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los combustibles</SelectItem>
                                {uniqueFuelTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="active">Activos</SelectItem>
                                <SelectItem value="inactive">Inactivos</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={physicalStateFilter} onValueChange={setPhysicalStateFilter}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Estado Físico" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados físicos</SelectItem>
                                {uniquePhysicalStates.map((state) => (
                                    <SelectItem key={state} value={state || ""}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={brandFilter} onValueChange={setBrandFilter}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Marca" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las marcas</SelectItem>
                                {uniqueBrands.map((brand) => (
                                    <SelectItem key={brand} value={brand}>
                                        {brand}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
                            <X className="h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {filteredTanks.map((tanque) => {
                    const fechaExpiracionSeguro
                        = tanque.seguro?.vigenciaHasta instanceof Timestamp
                            ? tanque.seguro.vigenciaHasta.toDate()
                            : new Date(tanque.seguro && tanque.seguro.vigenciaHasta || new Date());
                    const fechaExpiracionSCT
                        = tanque.permisoSCT?.vigenciaHasta instanceof Timestamp
                            ? tanque.permisoSCT.vigenciaHasta.toDate()
                            : new Date(tanque.permisoSCT && tanque.permisoSCT.vigenciaHasta || new Date());

                    const fuelPercentage = 0

                    return (
                        <Card key={tanque.id} className={`${!tanque.activo ? "opacity-60 border-dashed" : ""}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Fuel className="h-5 w-5" />
                                        Tanque {tanque.numeroTanque || tanque.id.slice(-4)}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className={`${getFuelTypeColor(tanque.tipoCombustible)} text-white`}>
                                            {tanque.tipoCombustible}
                                        </Badge>
                                        <Badge
                                            variant={tanque.activo ? "default" : "secondary"}
                                            className={`${getStatusColor(tanque.activo)} text-white`}
                                        >
                                            {tanque.activo ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Vehículo: {tanque.vehicleInfo.numEconomico} - {tanque.vehicleInfo.marca} {tanque.vehicleInfo.modelo} (
                                    {tanque.vehicleInfo.year})
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium">Marca</p>
                                        <p className="text-muted-foreground">{tanque.marca}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Modelo</p>
                                        <p className="text-muted-foreground">{tanque.modelo}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Año</p>
                                        <p className="text-muted-foreground">{tanque.year}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Capacidad</p>
                                        <p className="text-muted-foreground">{tanque.capacidadLitros}M³</p>
                                    </div>
                                </div>

                                {tanque.ubicacion && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>Ubicación: {tanque.ubicacion}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Nivel de Combustible</span>
                                        <span>
                                            0M³ / {tanque.capacidadLitros}M³ ({fuelPercentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <Progress value={fuelPercentage} className="h-2" />
                                </div>

                                {tanque.estadoFisico && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Estado Físico:</span>
                                        <Badge variant="secondary" className={`${getPhysicalStateColor(tanque.estadoFisico)} text-white`}>
                                            {tanque.estadoFisico}
                                        </Badge>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                                    {tanque.serie && (
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            Serie: {tanque.serie}
                                        </div>
                                    )}
                                    {tanque.placas && (
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            Placas: {tanque.placas}
                                        </div>
                                    )}
                                    {tanque.seguro && (
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-3 w-3" />
                                            Seguro: {tanque.seguro.aseguradora} (Vence: {format(fechaExpiracionSeguro, 'dd/MM/yyyy', { locale: es })})

                                        </div>
                                    )}
                                    {tanque.permisoSCT && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Permiso SCT: {tanque.permisoSCT.numero} (Vence: {format(fechaExpiracionSCT, "dd/MM/yyyy", { locale: es })})
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default TanquesPage