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

const EquiposPage = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { equipos } = useEquipos()
    const { area } = useArea()

    const {
        compliancePercentage,
        upcomingMaintenance,
        overdueMaintenance,
        operationalTrucks,
        dueMaintenance,
        allMaintenance,
        criticalDocs,
        expiredDocs,
        warningDocs,
        allDocs,
        avgAge,
    } = useDetailedEquipoData({ currentYear: new Date().getFullYear(), equipos: equipos })

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
                operationalTrucks={operationalTrucks}
                equipos={equipos}
                avgAge={avgAge}
            />

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <MaintenanceStatusCard 
                    prontosAvencer={dueMaintenance}
                    proximos={upcomingMaintenance}
                    vencidos={overdueMaintenance}
                    total={allMaintenance}
                />
                <DocumentCompletationCard 
                    porcentajeDeCumplimiento={compliancePercentage}
                    expiraPronto={warningDocs ?? 0}
                    critico={criticalDocs ?? 0}
                    expirado={expiredDocs ?? 0}
                    total={allDocs}
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