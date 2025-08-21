"use client"

import { AlertTriangle, Clock, Copy, CreditCard, Eye, Fuel, Navigation, Phone, Settings, Shield, User } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getStatusColor } from "../constants/colores-equipos"
import { brandGradients } from "../constants/colores-marcas"
import { vehicleIcons } from "../constants/iconos-equipo"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { formatCurrency } from "@/utils/format-currency"
import { formatNumber } from "@/utils/format-number"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Timestamp } from "firebase/firestore"

interface EquipoCardProps {
    equipo: Equipo
    onSelect: (id: string) => void
    onStatusToggle: (id: string, activo: boolean) => Promise<void>
    onDocumentUpload: (file: File) => void
}

const EquipoCard = ({
    equipo,
    onSelect,
    onStatusToggle,
    onDocumentUpload
}: EquipoCardProps) => {
    const [isToggling, setIsToggling] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")
    const [showAnalytics, setShowAnalytics] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    //const nextMaintenance = calculateNextMaintenance(equipo)
    //const warningCount = getExpiryWarnings(equipo)
    const complianceProgress = 0
    //const performanceScore = getPerformanceScore(equipo)
    const vehicleIcon = vehicleIcons[equipo.marca as keyof typeof vehicleIcons] || vehicleIcons.default
    const brandGradient = brandGradients[equipo.marca as keyof typeof brandGradients] || brandGradients.default

    //const activeAlerts = equipo.alertas?.filter((alert) => !alert.resuelta) || []
    //const highPriorityAlerts = activeAlerts.filter((alert) => alert.prioridad === "Alta")

    const fechaExpiracionSeguro
        = equipo.seguro?.vigenciaHasta instanceof Timestamp
            ? equipo.seguro.vigenciaHasta.toDate()
            : new Date(equipo.seguro &&  equipo.seguro.vigenciaHasta || new Date());

    return (
        <div>
            <Card
                className={cn(
                    "group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2",
                    "border-2 hover:border-primary",
                    "min-h-[600px]",
                )}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <div className="absolute top-0 right-0 flex gap-1">
                    <div
                        className={cn(
                            "px-3 py-1 text-xs font-medium text-white transform translate-x-3 -translate-y-2 rounded-lg",
                            getStatusColor(equipo.estado),
                        )}
                    >
                        {equipo.estado}
                    </div>
                    {/**
                     * {highPriorityAlerts.length > 0 && (
                        <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full transform rotate-12 translate-x-1 -translate-y-1">
                            {highPriorityAlerts.length}
                        </div>
                    )}
                     */}
                </div>

                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-lg",
                                    brandGradient,
                                )}
                            >
                                {vehicleIcon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300">{equipo.numEconomico}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-200 font-medium">
                                    {equipo.marca} {equipo.modelo} {equipo.year}
                                </p>
                                {equipo.serie && <p className="text-xs text-gray-500 dark:text-gray-300 font-mono">S/N: {equipo.serie}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {/**
                             * {warningCount > 0 && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span className="text-xs font-medium">{warningCount}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Documents expiring soon</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                             */}
                            <Switch
                                checked={equipo.activo || false}
                                onCheckedChange={async () => { }}
                                disabled={isToggling}
                                className="data-[state=checked]:bg-green-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{/** performanceScore */}%</div>
                            <div className="text-xs text-blue-600">Rendimiento</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                                {equipo.rendimientoPromedioKmPorLitro ? formatNumber(equipo.rendimientoPromedioKmPorLitro) : "N/A"}
                            </div>
                            <div className="text-xs text-green-600">km/L</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">
                                {equipo.m3 ? formatNumber(equipo.m3) : "N/A"}
                            </div>
                            <div className="text-xs text-purple-600">M³</div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 text-xs">
                            <TabsTrigger value="overview" className="text-xs">
                                General
                            </TabsTrigger>
                            <TabsTrigger value="technical" className="text-xs">
                                Tecnico
                            </TabsTrigger>
                            <TabsTrigger value="financial" className="text-xs">
                                Financiero
                            </TabsTrigger>
                            <TabsTrigger value="operations" className="text-xs">
                                Operaciones
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-3 mt-4">
                            {equipo.placas && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                                        {equipo.placas}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(equipo.placas!)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}

                            {(equipo.m3 || equipo.tipoTanque) && (
                                <div className="flex gap-2 flex-wrap">
                                    {equipo.m3 && (
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                            <Fuel className="w-3 h-3 mr-1" />
                                            {equipo.m3} m³
                                        </Badge>
                                    )}
                                    {equipo.tipoTanque && (
                                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{equipo.tipoTanque}</Badge>
                                    )}
                                </div>
                            )}

                            {equipo.operador && (
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{equipo.operador.nombres}</p>
                                        <p className="text-xs text-gray-500">Lic: {equipo.operador.numLicencia}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <Phone className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}

                            {equipo.ultimaUbicacion && (
                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                    <Navigation className="w-4 h-4 text-green-600" />
                                    <div className="flex-1">
                                        <div className="flex gap-4">
                                            <p className="text-sm font-medium text-green-800">Lat: {equipo.ultimaUbicacion.latitud}</p>
                                            <p className="text-sm font-medium text-green-800">Lng: {equipo.ultimaUbicacion.longitud}</p>
                                        </div>
                                        <p className="text-xs text-green-600">{equipo.ultimaUbicacion.direccionAproximada}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                        <Shield className="w-4 h-4" />
                                        Completado
                                    </span>
                                    <span
                                        className={cn(
                                            "font-medium",
                                            complianceProgress >= 80
                                                ? "text-green-600"
                                                : complianceProgress >= 60
                                                    ? "text-yellow-600"
                                                    : "text-red-600",
                                        )}
                                    >
                                        {complianceProgress}%
                                    </span>
                                </div>
                                <Progress
                                    value={complianceProgress}
                                    className={cn(
                                        "h-2",
                                        complianceProgress >= 80
                                            ? "[&>div]:bg-green-500"
                                            : complianceProgress >= 60
                                                ? "[&>div]:bg-yellow-500"
                                                : "[&>div]:bg-red-500",
                                    )}
                                />
                            </div>

                            {/**
                              * {nextMaintenance && (
                                <div className="flex items-center gap-2 text-sm p-2 bg-orange-50 rounded-lg">
                                    <Wrench className="w-4 h-4 text-orange-600" />
                                    <div className="flex-1">
                                        <p className="font-medium text-orange-800">Next Maintenance</p>
                                        <p className="text-orange-600">{new Date(nextMaintenance).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                              */}
                        </TabsContent>

                        <TabsContent value="technical" className="space-y-3 mt-4">
                            {/**
                             * {equipo.especificacionesTecnicas?.motor && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-1">
                                        <Settings className="w-4 h-4" />
                                        Engine
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="text-gray-600">Brand:</span>
                                            <p className="font-medium">{equipo.especificacionesTecnicas.motor.marca}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <span className="text-gray-600">Power:</span>
                                            <p className="font-medium">{equipo.especificacionesTecnicas.motor.potencia} HP</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                             */}

                            {equipo.tanque.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Tank Details</h4>
                                    {equipo.tanque.map((tank, index) => (
                                        <div key={tank.id} className="bg-blue-50 p-2 rounded-lg text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Tank {index + 1}</span>
                                                <Badge variant="outline">{tank.marca}</Badge>
                                            </div>
                                            <p className="text-gray-600">Capacity: {0} m³</p>
                                            <p className="text-gray-600">Modelo: {tank.modelo}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/**
                             * {equipo.horasOperacion && (
                                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-purple-800">Operating Hours</p>
                                        <p className="text-xs text-purple-600">{formatNumber(equipo.horasOperacion)} hrs</p>
                                    </div>
                                </div>
                            )}
                             */}
                        </TabsContent>

                        <TabsContent value="financial" className="space-y-3 mt-4">
                            {equipo.seguro && (
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Aseguradora</span>
                                    </div>
                                    <p className="text-xs text-blue-600">{equipo.seguro.aseguradora}</p>
                                    <p className="text-xs text-blue-600">
                                        Expira el: {new Date(fechaExpiracionSeguro).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {/**
                             * {equipo.costoOperacion && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        Operating Costs
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-red-50 p-2 rounded">
                                            <span className="text-gray-600">Per km:</span>
                                            <p className="font-medium">{formatCurrency(equipo.costoOperacion.costoPorKm)}</p>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded">
                                            <span className="text-gray-600">Monthly:</span>
                                            <p className="font-medium">{formatCurrency(equipo.costoOperacion.costoMensual)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}                            

                            {equipo.financiamiento && (
                                <div className="bg-green-50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CreditCard className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">Financing</span>
                                    </div>
                                    <p className="text-xs text-green-600">Type: {equipo.financiamiento.tipo}</p>
                                    {equipo.financiamiento.pagoMensual && (
                                        <p className="text-xs text-green-600">
                                            Monthly: {formatCurrency(equipo.financiamiento.pagoMensual)}
                                        </p>
                                    )}
                                </div>
                            )}
                             */}
                        </TabsContent>

                        <TabsContent value="operations" className="space-y-3 mt-4">
                            {/**
                             * {equipo.consumoCombustible && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-1">
                                        <Fuel className="w-4 h-4" />
                                        Fuel Consumption
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-yellow-50 p-2 rounded">
                                            <span className="text-gray-600">Daily avg:</span>
                                            <p className="font-medium">{equipo.consumoCombustible.promedioDiario.toFixed(1)} L</p>
                                        </div>
                                        <div className="bg-yellow-50 p-2 rounded">
                                            <span className="text-gray-600">Current level:</span>
                                            <p className="font-medium">{equipo.consumoCombustible.nivelActual}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {equipo.historialRutas && equipo.historialRutas.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-1">
                                        <Route className="w-4 h-4" />
                                        Recent Routes
                                    </h4>
                                    <div className="space-y-1">
                                        {equipo.historialRutas.slice(0, 2).map((ruta) => (
                                            <div key={ruta.id} className="bg-gray-50 p-2 rounded text-xs">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        {ruta.origen} → {ruta.destino}
                                                    </span>
                                                    <span className="text-gray-500">{ruta.kilometros} km</span>
                                                </div>
                                                <p className="text-gray-600">{new Date(ruta.fecha).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeAlerts.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-1">
                                        <Bell className="w-4 h-4" />
                                        Active Alerts
                                    </h4>
                                    <div className="space-y-1">
                                        {activeAlerts.slice(0, 3).map((alert) => (
                                            <div key={alert.id} className={cn("p-2 rounded text-xs", getPriorityColor(alert.prioridad))}>
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium">{alert.tipo}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {alert.prioridad}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1">{alert.mensaje}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                             */}
                        </TabsContent>
                    </Tabs>

                    <div
                        className={cn(
                            "flex items-center gap-2 transition-all duration-200 pt-2 border-t",
                            showActions ? "opacity-100 translate-y-0" : "opacity-70 md:opacity-100 translate-y-1 md:translate-y-0",
                        )}
                    >
                        <Button onClick={() => setShowDetails(true)} className="flex-1" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                        </Button>

                        {/**
                         * <DropdownActions
                            equipo={equipo}
                            onAnalytics={() => setShowAnalytics(true)}
                            onDocumentUpload={onDocumentUpload}
                        />
                         */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default EquipoCard