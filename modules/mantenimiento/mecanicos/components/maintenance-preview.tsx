"use client"

import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Calendar, Gauge, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    getMaintenanceTypeColor,
    getMaintenanceTypeIcon,
    getStatusColor as getMaintenanceStatusColor
} from "../utils/utils-maintenance"

interface MaintenancePreviewProps {
    mantenimiento: Mantenimiento
}

const MaintenancePreview = ({ mantenimiento }: MaintenancePreviewProps) => {
    const typeColor = getMaintenanceTypeColor(mantenimiento.tipoMantenimiento)
    const statusColor = getMaintenanceStatusColor(mantenimiento.estado)
    const TypeIcon = getMaintenanceTypeIcon(mantenimiento.tipoMantenimiento)

    return (
        <div className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`p-1.5 rounded ${typeColor}`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {mantenimiento.tipoServicio || "Servicio General"}
                        </p>
                        <p className="text-xs text-muted-foreground">Equipo {mantenimiento.equipoId}</p>
                    </div>
                </div>
                <Badge variant="secondary" className={`${statusColor} text-xs`}>
                    {mantenimiento.estado}
                </Badge>
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{parseFirebaseDate(mantenimiento.fecha).toLocaleDateString("es-MX")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{mantenimiento.kmMomento.toLocaleString()} km</span>
                </div>
                {mantenimiento.fechaProximo && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Próximo: {parseFirebaseDate(mantenimiento.fechaProximo).toLocaleDateString("es-MX")}</span>
                    </div>
                )}
            </div>

            {mantenimiento.tipoMantenimiento && (
                <Badge variant="outline" className={`${typeColor} mt-2 text-xs font-normal`}>
                    {mantenimiento.tipoMantenimiento}
                </Badge>
            )}
        </div>
    )
}

export default MaintenancePreview