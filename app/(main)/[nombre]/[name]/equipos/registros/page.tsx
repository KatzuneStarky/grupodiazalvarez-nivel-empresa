"use client"

import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import EquiposGrid from "@/modules/logistica/equipos/components/equipos-grid"
import { BarChart3, Download, Filter, Plus, Search } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

const RegistroEquiposPage = () => {
    const [showFleetAnalytics, setShowFleetAnalytics] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const { equipos, isLoading } = useEquipos()
    const router = useRouter()

    const { directLink } = useDirectLink("equipos/registros/nuevo")

    const filteredEquipos = equipos.filter(
        (equipo) =>
            equipo.numEconomico.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (equipo.placas && equipo.placas.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (equipo.operador && equipo.operador.nombres.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const totalEquipos = equipos.length
    const activeEquipos = equipos.filter((e) => e.activo).length
    const inMaintenanceEquipos = equipos.filter((e) => e.estado === EstadoEquipos.EN_TALLER).length
    //const totalAlerts = equipos.reduce((sum, e) => sum + (e.alertas?.filter((a) => !a.resuelta).length || 0), 0)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-400">Parque vehicular</h1>
                            <p className="text-gray-600 text-lg dark:text-gray-300">
                                Gestión integral de la flota de vehículos, incluyendo registro, mantenimiento y seguimiento.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="sm:w-auto">
                                <Download className="w-4 h-4 mr-2" />
                                Exportar Datos
                            </Button>
                            <Button variant="outline" className="sm:w-auto" onClick={() => setShowFleetAnalytics(true)}>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Análisis
                            </Button>
                            <Button
                                className="sm:w-auto"
                                onClick={() => router.push(directLink)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Registrar Vehículo
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{totalEquipos}</div>
                            <div className="text-blue-100">Flota total</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{activeEquipos}</div>
                            <div className="text-green-100">Unidades activas</div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{inMaintenanceEquipos}</div>
                            <div className="text-yellow-100">En mantenimiento</div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{0}</div>
                            <div className="text-red-100">Alertas activas</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Busqueda mediante numero economico, marca, modelo, placas, conductor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 text-base"
                        />
                    </div>
                    <Button variant="outline" className="h-12">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros avanzados
                    </Button>
                </div>

                {!isLoading && (
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                        <span>
                            Mostrando {filteredEquipos.length} de {totalEquipos} vehículos
                            {searchTerm && ` coincidentes con "${searchTerm}"`}
                        </span>
                        <span>Última actualización: {new Date().toLocaleTimeString()}</span>
                    </div>
                )}

                <EquiposGrid
                    equipos={filteredEquipos}
                    loading={isLoading}
                    onSelect={() => { }}
                    onStatusToggle={async () => { }}
                    onDocumentUpload={() => { }}
                />
            </div>
            {/**
             * <AnalyticsDashboard
                equipos={equipos}
                open={showFleetAnalytics}
                onOpenChange={setShowFleetAnalytics}
                isFleetView={true}
            />
             */}
        </div>
    )
}

export default RegistroEquiposPage