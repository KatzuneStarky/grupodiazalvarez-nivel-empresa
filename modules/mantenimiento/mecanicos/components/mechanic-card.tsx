"use client"

import { ChevronRight, ClipboardList, History, Mail, Phone, User } from "lucide-react"
import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { getStatusColor, getStatusLabel } from "../utils/utils-mechanics"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import MaintenancePreview from "./maintenance-preview"
import { Mecanico } from "../../types/mecanico"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { MechanicDetailsDialog } from "./mechanic-details-dialog"
import { OrdenMantenimiento } from "@/modules/mantenimiento/types/orden-mantenimiento"

interface MechanicCardProps {
    mecanico: Mecanico
    mantenimientos: Mantenimiento[]
    ordenes?: OrdenMantenimiento[]
    disabled?: boolean
}

const MechanicCard = ({ mecanico, mantenimientos, ordenes = [], disabled }: MechanicCardProps) => {
    const [openDetails, setOpenDetails] = useState(false)
    const activeMaintenances = mantenimientos.filter((m) => m.estado === "En Progreso" || m.estado === "Pendiente")

    // Calculate active tasks: existing active maintenances OR orders assigned to this mechanic that are 'En Progreso'/'Pendiente'
    // and don't have a linked maintenance yet (simple count for now, detailed list in dialog)
    const activeOrders = ordenes.filter(o =>
        o.mecanicoId === mecanico.id &&
        (o.estado === 'En Progreso' || o.estado === 'Pendiente') &&
        !mantenimientos.some(m => m.ordenMantenimientoId === o.id)
    )

    const totalActiveTasks = activeMaintenances.length + activeOrders.length
    const completedCount = mecanico.historial.length

    const statusColor = getStatusColor(mecanico.estado)
    const statusLabel = getStatusLabel(mecanico.estado)
    const initials = `${mecanico.nombre.charAt(0)}${mecanico.apellidos.charAt(0)}`

    return (
        <>
            <Card className={`overflow-hidden transition-all ${disabled ? "opacity-60 pointer-events-none grayscale" : "hover:shadow-lg"}`}>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-12 w-12 border-2 border-border">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg text-foreground truncate">
                                    {mecanico.nombre} {mecanico.apellidos}
                                </h3>
                                <Badge variant="secondary" className={`${statusColor} mt-1`}>
                                    {statusLabel}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {mecanico.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{mecanico.email}</span>
                            </div>
                        )}
                        {mecanico.telefono && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>{mecanico.telefono}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <ClipboardList className="w-4 h-4 text-primary" />
                                <span className="text-xs text-muted-foreground">Asignados</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{mecanico.mantenimientosAsignados.length}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <History className="w-4 h-4 text-accent" />
                                <span className="text-xs text-muted-foreground">Completados</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                        </div>
                    </div>

                    {totalActiveTasks > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <ClipboardList className="w-4 h-4" />
                                Mantenimientos Activos ({totalActiveTasks})
                            </h4>
                            <div className="space-y-2">
                                {activeMaintenances.map((mantenimiento) => (
                                    <MaintenancePreview
                                        key={mantenimiento.id}
                                        mantenimiento={mantenimiento}
                                    />
                                ))}
                                {activeOrders.map((orden) => (
                                    <div key={orden.id} className="text-xs p-2 border rounded bg-secondary/20">
                                        <span className="font-medium">Orden Pendiente:</span> {orden.descripcionProblema.substring(0, 30)}...
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {totalActiveTasks === 0 && (
                        <div className="p-4 bg-muted/30 rounded-lg text-center">
                            <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Sin mantenimientos activos</p>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        className="w-full group hover:bg-primary/5 hover:text-primary transition-colors border border-transparent hover:border-primary/10 mt-2"
                        size="sm"
                        disabled={disabled}
                        onClick={() => setOpenDetails(true)}
                    >
                        <span className="font-medium">Ver Detalles</span>
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </CardContent>
            </Card>

            <MechanicDetailsDialog
                open={openDetails}
                onOpenChange={setOpenDetails}
                mecanico={mecanico}
                mantenimientos={mantenimientos}
                ordenes={ordenes}
            />
        </>
    )
}

export default MechanicCard