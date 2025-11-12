"use client"

import DocumentCompletationCard from "@/modules/logistica/equipos/components/dashboard/document-completation-card"
import { CommandDialogEquipos } from "@/modules/logistica/equipos/documentos/components/command-dialog-equipos"
import MaintenanceStatusCard from "@/modules/logistica/equipos/components/dashboard/maintenance-status-card"
import { FleetActionsSheet } from "@/modules/logistica/equipos/components/dashboard/fleet-action-sheet"
import { useDetailedEquipoData } from "@/modules/logistica/equipos/hooks/use-detailed-equipo-data"
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

import { darkTheme } from '@uiw/react-json-view/dark';
import JsonView from '@uiw/react-json-view';

const EquiposPage = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { equipos } = useEquipos()
    const { area } = useArea()

    const {
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
        documentosTotales
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

    return (
        <div className="container mx-auto px-6 py-8">
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
            <Separator className="mt-4 mb-6" />
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

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <MaintenanceStatusCard 
                    prontosAvencer={maintenanceDueSoon ?? 0}
                    proximos={maintenanceUpcoming ?? 0}
                    vencidos={maintenanceOverdue ?? 0}
                    total={totalMaintenance ?? 0}
                    alDia={maintenanceOk ?? 0}
                />
                <DocumentCompletationCard 
                    porcentajeDeCumplimiento={0}
                    expiraPronto={0}
                    critico={0}
                    expirado={0}
                    total={0}
                />
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