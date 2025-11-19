"use client"

import ImportDialog from "@/components/global/import-dialog"
import { ReporteViajes } from "../types/reporte-viajes"
import UploadViajesDialog from "./upload-viajes-dialog"
import { Button } from "@/components/ui/button"
import { Download, Zap } from "lucide-react"
import Icon from "@/components/global/icon"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface ReporteViajesActionsSheetProps {
    exportReportesViajesAction: (data: ReporteViajes[]) => void
    importViajesDataJson: (data: ReporteViajes[]) => void
    exportReporteViajesDataJson: () => void
    reporteViajes: ReporteViajes[]
}

const ReporteViajesActionsSheet = ({
    exportReporteViajesDataJson,
    exportReportesViajesAction,
    importViajesDataJson,
    reporteViajes
}: ReporteViajesActionsSheetProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Zap />
                    Acciones
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Acciones para los reportes de viajes</SheetTitle>
                    <SheetDescription>
                        Acciones disponibles para los reportes de viajes
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-3">
                    <ImportDialog<ReporteViajes>
                        onImport={importViajesDataJson}
                        title="Importar viajes"
                        triggerLabel="Importar Json"
                        child={true}
                    >
                        <Button
                            className="h-auto mx-4 justify-start gap-3 bg-cyan-500/10 py-4 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                            variant="outline"
                        >
                            <Icon iconName="si:json-fill" className="h-5 w-5" />
                            <div className="flex flex-col items-start">
                                <span className="font-medium">Importar JSON</span>
                                <span className="text-xs text-muted-foreground">
                                    Importar los reportes de viajes en formato JSON
                                </span>
                            </div>
                        </Button>
                    </ImportDialog>

                    <UploadViajesDialog />

                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-blue-500/10 py-4 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                        variant="outline"
                        onClick={() => exportReporteViajesDataJson()}
                    >
                        <Icon iconName="si:json-fill" className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Exportar JSON</span>
                            <span className="text-xs text-muted-foreground">
                                Exportar los reportes de viajes en formato JSON
                            </span>
                        </div>
                    </Button>
                    <Button
                        className="h-auto mx-4 justify-start gap-3 bg-emerald-500/10 py-4 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                        variant="outline"
                        onClick={() => exportReportesViajesAction(reporteViajes)}
                    >
                        <Download className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Exportar CSV</span>
                            <span className="text-xs text-muted-foreground">
                                Exportar los reportes de viajes en formato CSV
                            </span>
                        </div>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ReporteViajesActionsSheet