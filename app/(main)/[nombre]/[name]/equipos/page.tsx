"use client"

import { CommandDialogEquipos } from "@/modules/logistica/equipos/documentos/components/command-dialog-equipos"
import DetailedOverviewCards from "@/modules/logistica/equipos/components/detailed-overview-cards"
import OperationalInsights from "@/modules/logistica/equipos/components/operational-insignths"
import { getMaintenanceUrgency } from "@/modules/logistica/utils/get-maintenance-urgency"
import EquipoKpiMetrics from "@/modules/logistica/equipos/components/equipo-kpi-metric"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Truck } from "lucide-react"

const EquiposPage = () => {
    const [statusFilter, setStatusFilter] = useState<EstadoEquipos | "Todos">("Todos")
    const [maintenanceFilter, setMaintenanceFilter] = useState("Todos")
    const [capacityFilter, setCapacityFilter] = useState("Todos")
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState<boolean>(false)

    const { equipos } = useEquipos()

    const filteredEquipment = useMemo(() => {
        return equipos.filter((equipment) => {
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase()
                const matchesSearch =
                    equipment.numEconomico.toLowerCase().includes(searchLower) ||
                    equipment.marca.toLowerCase().includes(searchLower) ||
                    equipment.modelo.toLowerCase().includes(searchLower) ||
                    equipment.placas?.toLowerCase().includes(searchLower)

                if (!matchesSearch) return false
            }

            if (statusFilter !== "Todos" && equipment.estado !== statusFilter) {
                return false
            }

            if (capacityFilter !== "Todos") {
                const capacity = equipment.m3 || 0
                switch (capacityFilter) {
                    case "pequeño":
                        if (capacity >= 40) return false
                        break
                    case "mediano":
                        if (capacity < 40 || capacity > 45) return false
                        break
                    case "largo":
                        if (capacity <= 45) return false
                        break
                }
            }

            if (maintenanceFilter !== "Todos") {
                const lastMaintenance = equipment.mantenimiento[0]?.fecha
                const urgency = lastMaintenance ? getMaintenanceUrgency(lastMaintenance) : "overdue"
                if (urgency !== maintenanceFilter) return false
            }

            return true
        })
    }, [searchTerm, statusFilter, capacityFilter, maintenanceFilter, equipos])

    const activeFiltersCount = [
        searchTerm,
        statusFilter !== "Todos" ? statusFilter : null,
        capacityFilter !== "Todos" ? capacityFilter : null,
        maintenanceFilter !== "Todos" ? maintenanceFilter : null,
    ].filter(Boolean).length

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("Todos")
        setCapacityFilter("Todos")
        setMaintenanceFilter("Todos")
    }

    return (
        <div>
            <div className="flex-1 space-y-6 p-6"> 
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Datos de la Flota</h1>
                            <p className="text-muted-foreground">
                                Gestión integral de equipos de transporte de combustible
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)}>
                        <Truck className="h-4 w-4" />
                        Ver equipo
                    </Button>
                </div>

                <DetailedOverviewCards equipos={filteredEquipment} />
                <EquipoKpiMetrics fleetData={equipos} />
                <OperationalInsights fleetData={equipos} />
            </div>

            <CommandDialogEquipos
                equipos={equipos}
                setOpen={setOpen}
                open={open}
            />
        </div>
    )
}

export default EquiposPage