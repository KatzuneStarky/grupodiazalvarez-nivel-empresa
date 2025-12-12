"use client"

import { Mail, Phone, Calendar, Activity, CheckCircle2, AlertCircle, Clock, Wrench, ClipboardList } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { getStatusColor, getStatusLabel } from "../utils/utils-mechanics"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Mecanico } from "../../types/mecanico"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { OrdenMantenimiento } from "@/modules/mantenimiento/types/orden-mantenimiento"

interface MechanicDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mecanico: Mecanico
    mantenimientos: Mantenimiento[]
    ordenes?: OrdenMantenimiento[]
}

export const MechanicDetailsDialog = ({ open, onOpenChange, mecanico, mantenimientos, ordenes = [] }: MechanicDetailsDialogProps) => {
    const activeMaintenances = mantenimientos.filter((m) => m.estado === "En Progreso" || m.estado === "Pendiente")

    // Filter orders that are assigned to this mechanic, are active/pending, AND are NOT linked to an existing maintenance
    const activeOrders = ordenes.filter(o =>
        o.mecanicoId === mecanico.id &&
        (o.estado === 'En Progreso' || o.estado === 'Pendiente') &&
        !mantenimientos.some(m => m.ordenMantenimientoId === o.id)
    )

    const statusColor = getStatusColor(mecanico.estado)
    const statusLabel = getStatusLabel(mecanico.estado)
    const initials = `${mecanico.nombre.charAt(0)}${mecanico.apellidos.charAt(0)}`

    const formatDate = (date: any) => {
        try {
            return format(parseFirebaseDate(date), "PPP", { locale: es })
        } catch (e) {
            return "Fecha no disponible"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-4 border-muted">
                            <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold">
                                {mecanico.nombre} {mecanico.apellidos}
                            </DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={`${statusColor} transition-colors`}>
                                    {statusLabel}
                                </Badge>
                                {!mecanico.activo && (
                                    <Badge variant="destructive">Inactivo</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6">
                    <div className="space-y-6 pb-6">
                        {/* Información de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-muted/50">
                                <h4 className="flex items-center gap-2 font-semibold text-sm text-primary">
                                    <AlertCircle className="w-4 h-4" />
                                    Información Personal
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-foreground">{mecanico.email || "No registrado"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-foreground">{mecanico.telefono || "No registrado"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-foreground">Registrado: {formatDate(mecanico.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas Rápidas */}
                            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-muted/50">
                                <h4 className="flex items-center gap-2 font-semibold text-sm text-primary">
                                    <Activity className="w-4 h-4" />
                                    Desempeño
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-center p-2 bg-background rounded-lg border shadow-sm">
                                        <span className="block text-2xl font-bold text-foreground">
                                            {mecanico.mantenimientosAsignados.length}
                                        </span>
                                        <span className="text-[10px] uppercase font-medium text-muted-foreground">
                                            Asignados
                                        </span>
                                    </div>
                                    <div className="text-center p-2 bg-background rounded-lg border shadow-sm">
                                        <span className="block text-2xl font-bold text-green-600">
                                            {mecanico.historial.length}
                                        </span>
                                        <span className="text-[10px] uppercase font-medium text-muted-foreground">
                                            Completados
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Mantenimientos Activos Detalle */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 font-semibold text-sm">
                                <Wrench className="w-4 h-4 text-primary" />
                                Tareas en Curso ({activeMaintenances.length + activeOrders.length})
                            </h4>

                            {(activeMaintenances.length > 0 || activeOrders.length > 0) ? (
                                <div className="grid gap-3">
                                    {activeMaintenances.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Mantenimiento (Orden #{m.ordenMantenimientoId?.substring(0, 8) || "?"})</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(m.fecha)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {m.estado}
                                            </Badge>
                                        </div>
                                    ))}
                                    {activeOrders.map((o) => (
                                        <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100/50 transition-colors border-amber-200 dark:border-amber-800">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
                                                    <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Orden de Mantenimiento</p>
                                                    <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                                                        {o.descripcionProblema}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                                                {o.estado}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No tiene tareas activas actualmente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
