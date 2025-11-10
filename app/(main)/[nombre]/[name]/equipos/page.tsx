"use client"

import { CommandDialogEquipos } from "@/modules/logistica/equipos/documentos/components/command-dialog-equipos"
import DetailedOverviewCards from "@/modules/logistica/equipos/components/detailed-overview-cards"
import OperationalInsights from "@/modules/logistica/equipos/components/operational-insignths"
import EquipoKpiMetrics from "@/modules/logistica/equipos/components/equipo-kpi-metric"
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
        <div>
            <div className="flex-1 space-y-6 p-6">
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
                            <Button onClick={() => setOpen(true)}>
                                <Truck className="h-4 w-4" />
                                Ver equipo
                            </Button>
                        </>
                    }
                />
                <Separator className="mt-4 mb-6" />

                <DetailedOverviewCards equipos={equipos} />
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