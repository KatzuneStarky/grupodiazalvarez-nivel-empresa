"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircleIcon, AlertTriangleIcon, BellIcon, CheckCircleIcon } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { AlertaConsumo } from "../types/alertas-consumo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"

interface AlertsDialogProps {
    alerts: AlertaConsumo[]
}

const ConsumoAlertsDialog = ({ alerts }: AlertsDialogProps) => {
    const [open, setOpen] = useState<boolean>(false)

    const getAlertIcon = (type: AlertaConsumo["type"]) => {
        switch (type) {
            case "critical":
                return <AlertCircleIcon className="h-4 w-4" />
            case "warning":
                return <AlertTriangleIcon className="h-4 w-4" />
            case "normal":
                return <CheckCircleIcon className="h-4 w-4" />
        }
    }

    const getAlertVariant = (type: AlertaConsumo["type"]) => {
        switch (type) {
            case "critical":
                return "destructive"
            case "warning":
                return "secondary"
            case "normal":
                return "default"
        }
    }

    const sortedAlerts = [...alerts].sort((a, b) => {
        const typeOrder = { critical: 0, warning: 1, normal: 2 }
        return typeOrder[a.type] - typeOrder[b.type]
    })

    const criticalCount = alerts.filter((a) => a.type === "critical").length
    const warningCount = alerts.filter((a) => a.type === "warning").length

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="relative bg-transparent">
                    <BellIcon className="h-4 w-4 mr-2" />
                    Alertas y anomalias
                    {(criticalCount > 0 || warningCount > 0) && (
                        <Badge variant="destructive" className="ml-2 px-1.5 py-0 h-5 min-w-5">
                            {criticalCount + warningCount}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Alertas y anomalias</DialogTitle>
                    <DialogDescription>Deteccion automatica de cambios peligrosos en el consumo de la flota</DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {sortedAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
                            <p className="text-sm text-muted-foreground">No se han detectado anomalias. Funcionamiento correcto.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedAlerts.map((alert, index) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                                >
                                    <Badge variant={getAlertVariant(alert.type)} className="gap-1 mt-0.5">
                                        {getAlertIcon(alert.type)}
                                        {alert.type.toUpperCase()}
                                    </Badge>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{alert.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {alert.fecha instanceof Date ? parseFirebaseDate(alert.fecha).toLocaleDateString("es-MX") : ""}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ConsumoAlertsDialog