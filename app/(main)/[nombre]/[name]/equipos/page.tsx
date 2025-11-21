"use client"

import DocumentCompletationCard from "@/modules/logistica/equipos/components/dashboard/document-completation-card"
import StatusDistributionChart from "@/modules/logistica/equipos/components/dashboard/status-distribution-chart"
import { CommandDialogEquipos } from "@/modules/logistica/equipos/documentos/components/command-dialog-equipos"
import MaintenanceStatusCard from "@/modules/logistica/equipos/components/dashboard/maintenance-status-card"
import { FleetActionsSheet } from "@/modules/logistica/equipos/components/dashboard/fleet-action-sheet"
import { useDetailedEquipoData } from "@/modules/logistica/equipos/hooks/use-detailed-equipo-data"
import { EquiposSkeleton } from "@/modules/logistica/equipos/components/dashboard/equipos-skeleton"
import FleetAgeChart from "@/modules/logistica/equipos/components/dashboard/fleet-age-chart"
import AlertsSection from "@/modules/logistica/equipos/components/dashboard/alerts-section"
import FleetKpiCard from "@/modules/logistica/equipos/components/dashboard/fleet-kpi-cards"
import { exportEquipos } from "@/functions/excel-export/equipos/export/export-equipos"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { IconFileExport } from "@tabler/icons-react"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const EquiposPage = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { equipos, isLoading } = useEquipos()
    const { area } = useArea()

    const {
        edadEquiposChartData,
        availableWithIssues,
        maintenanceUpcoming,
        outOfServiceTrucks,
        maintenanceOverdue,
        maintenanceDueSoon,
        operationalTrucks,
        maintenanceTrucks,
        totalMaintenance,
        inactiveTrucks,
        avgRendimiento,
        enViajeTrucks,
        maintenanceOk,
        groupsSummary,
        activeTrucks,
        totalTrucks,
        newTrucks,
        oldTrucks,
        avgAge,
        documentosTotales,
        documentosEnTiempo,
        documentosPorVencer,
        documentosVencidos,
        documentosSinFecha,
        porcentajeCumplimientoDocumental,
    } = useDetailedEquipoData(equipos, new Date().getFullYear())

    const convertedGroupSummary = Object.entries(groupsSummary).map(([key, value]) => ({
        name: key,
        value: value
    }))

    const exportEquiposData = async () => {
        try {
            toast.promise(exportEquipos(equipos, area?.nombre || ""), {
                loading: "Exportando datos...",
                success: "Datos exportados con éxito",
                error: "Error al exportar datos"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    if (isLoading) {
        return <EquiposSkeleton />
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <PageTitle
                icon={<Truck className="h-12 w-12 text-primary" />}
                title="Datos de la Flota"
                description="Gestión integral de equipos de transporte de combustible"
                hasActions={true}
                actions={
                    <>
                        <Button className="sm:w-auto" onClick={() => exportEquiposData()}>
                            <IconFileExport className="w-4 h-4 mr-2" />
                            Exportar Datos
                        </Button>
                        <FleetActionsSheet />
                        <Button onClick={() => setOpen(true)}>
                            <Truck className="h-4 w-4" />
                            Ver equipo
                        </Button>
                    </>
                }
            />
            <Separator className="my-4 sm:my-6" />

            {/* KPI Cards Section */}
            <FleetKpiCard
                availableWithIssues={availableWithIssues}
                outOfServiceTrucks={outOfServiceTrucks}
                operationalTrucks={operationalTrucks}
                maintenanceTrucks={maintenanceTrucks}
                inactiveTrucks={inactiveTrucks}
                totalTrucks={totalTrucks ?? 0}
                enViajeTrucks={enViajeTrucks}
                activeTrucks={activeTrucks}
                newTrucks={newTrucks}
                oldTrucks={oldTrucks}
                avgAge={avgAge}
                convertedGroupSummary={convertedGroupSummary}
            />

            {/* Maintenance and Documents Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6 sm:mb-8">
                <MaintenanceStatusCard
                    prontosAvencer={maintenanceDueSoon ?? 0}
                    proximos={maintenanceUpcoming ?? 0}
                    vencidos={maintenanceOverdue ?? 0}
                    total={totalMaintenance ?? 0}
                    alDia={maintenanceOk ?? 0}
                />
                <DocumentCompletationCard
                    porcentajeDeCumplimiento={porcentajeCumplimientoDocumental}
                    expiraPronto={documentosPorVencer}
                    critico={documentosSinFecha}
                    expirado={documentosVencidos}
                    total={documentosTotales}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6 sm:mb-8">
                <StatusDistributionChart
                    disponibleConDetallesNum={availableWithIssues ?? 0}
                    fueraDeServicioNum={outOfServiceTrucks ?? 0}
                    disponibleNum={operationalTrucks ?? 0}
                    enTallerNum={maintenanceTrucks ?? 0}
                    enViajeNum={enViajeTrucks ?? 0}
                />
                <FleetAgeChart data={edadEquiposChartData || []} />
            </div>

            {/* Alerts Section */}
            <AlertsSection />

            {/* Command Dialog */}
            <CommandDialogEquipos
                equipos={equipos}
                setOpen={setOpen}
                open={open}
            />
        </div>
    )
}

export default EquiposPage