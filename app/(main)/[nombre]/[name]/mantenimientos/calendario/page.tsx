"use client"

import { AlertTriangleIcon, CalendarIcon, CheckCircleIcon, ClockIcon, FileTextIcon, TruckIcon, UserIcon, WrenchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { CalendarEvent } from "@/modules/mantenimiento/types/calendario"
import interactionPlugin from "@fullcalendar/interaction"
import { useDirectLink } from "@/hooks/use-direct-link"
import esLocale from "@fullcalendar/core/locales/es"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import { Button } from "@/components/ui/button"
import FullCalendar from "@fullcalendar/react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import moment from "moment"

const MantenimientosCalendarioPage = () => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [selectedGroup, setSelectedGroup] = useState<string>("all")
    const { directLink } = useDirectLink("/mantenimientos/nuevo")
    const { equipos } = useEquipos()
    const router = useRouter()

    const filteredEquipos = useMemo(() => {
        if (selectedGroup === "all") return equipos
        return equipos.filter((equipo) => equipo.grupoUnidad === selectedGroup)
    }, [equipos, selectedGroup])

    const events = useMemo(() => {
        const calendarEvents: any[] = []

        filteredEquipos.forEach((equipo) => {
            equipo.mantenimiento.forEach((mantenimiento) => {
                if (mantenimiento.fechaProximo) {
                    const daysUntilMaintenance = moment(mantenimiento.fechaProximo).diff(moment(), "days")

                    let urgency: "safe" | "warning" | "urgent" = "safe"
                    let backgroundColor = "var(--maintenance-safe)"
                    let borderColor = "var(--maintenance-safe)"

                    if (daysUntilMaintenance < 15) {
                        urgency = "urgent"
                        backgroundColor = "var(--maintenance-urgent)"
                        borderColor = "var(--maintenance-urgent)"
                    } else if (daysUntilMaintenance <= 30) {
                        urgency = "warning"
                        backgroundColor = "var(--maintenance-warning)"
                        borderColor = "var(--maintenance-warning)"
                    }

                    calendarEvents.push({
                        id: mantenimiento.id,
                        title: `${equipo.numEconomico} - ${mantenimiento.tipoServicio || "Mantenimiento"}`,
                        date: mantenimiento.fechaProximo,
                        backgroundColor,
                        borderColor,
                        textColor: "#ffffff",
                        extendedProps: {
                            mantenimiento,
                            equipo,
                            urgency,
                        },
                    })
                }
            })
        })

        return calendarEvents
    }, [filteredEquipos])

    const handleEventClick = (clickInfo: any) => {
        console.log("Event clicked:", clickInfo.event)

        const event = clickInfo.event
        const calendarEvent: CalendarEvent = {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end || event.start,
            resource: event.extendedProps,
        }
        setSelectedEvent(calendarEvent)
    }

    const handleDateClick = (arg: any) => {
        const calendarEvent: CalendarEvent = {
            id: "new",
            title: `Nuevo mantenimiento`,
            start: arg.date,
            end: arg.date,
            resource: {
                equipo: null,
                mantenimiento: null,
                urgency: "safe",
            },
        }
        setSelectedEvent(calendarEvent)
    }

    const handleCloseModal = () => {
        setSelectedEvent(null)
    }

    const getUrgencyBadge = (urgency: "safe" | "warning" | "urgent") => {
        const variants = {
            safe: { className: "bg-[var(--maintenance-safe)] text-white", icon: CheckCircleIcon, label: "Programado" },
            warning: { className: "bg-[var(--maintenance-warning)] text-white", icon: ClockIcon, label: "Próximo" },
            urgent: { className: "bg-[var(--maintenance-urgent)] text-white", icon: AlertTriangleIcon, label: "Urgente" },
        }

        const { className, icon: Icon, label } = variants[urgency]

        return (
            <Badge className={className}>
                <Icon className="h-3 w-3 mr-1" />
                {label}
            </Badge>
        )
    }

    const uniqueGroups = [...new Set(equipos.map((e) => e.grupoUnidad))]

    console.log(selectedGroup);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-card border-b border-border rounded-lg">
                <div className="px-6 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-foreground">Calendario de Mantenimiento</h1>
                            <p className="text-lg text-muted-foreground">
                                Gestiona los mantenimientos programados de tu flota vehicular
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Filtrar por grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los grupos</SelectItem>
                                    {uniqueGroups.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push(directLink)}>
                                <WrenchIcon className="h-4 w-4 mr-2" />
                                Nuevo Mantenimiento
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Programados</CardTitle>
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-accent" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{events.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">mantenimientos este mes</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Próximos (30 días)</CardTitle>
                            <div className="p-2 bg-[var(--maintenance-warning)]/10 rounded-lg">
                                <ClockIcon className="h-5 w-5 text-[var(--maintenance-warning-text)]" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[var(--maintenance-warning-text)]">
                                {events.filter((e) => e.extendedProps.urgency === "warning").length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">requieren atención pronto</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Urgentes (15 días)</CardTitle>
                            <div className="p-2 bg-[var(--maintenance-urgent)]/10 rounded-lg">
                                <AlertTriangleIcon className="h-5 w-5 text-[var(--maintenance-urgent-text)]" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[var(--maintenance-urgent-text)]">
                                {events.filter((e) => e.extendedProps.urgency === "urgent").length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">requieren atención inmediata</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            locale={esLocale}
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={handleDateClick}
                            height="700px"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            buttonText={{
                                today: "Hoy",
                                month: "Mes",
                                week: "Semana",
                                day: "Día",
                            }}
                            dayMaxEvents={3}
                            moreLinkText="más"
                            eventDisplay="block"
                            displayEventTime={false}
                            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedEvent} onOpenChange={handleCloseModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-6">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <WrenchIcon className="h-6 w-6 text-primary" />
                            </div>
                            Detalles del Mantenimiento
                        </DialogTitle>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="space-y-8">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-accent/10 rounded-xl">
                                        <TruckIcon className="h-8 w-8 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-foreground">{selectedEvent?.resource.equipo?.numEconomico}</h3>
                                        <p className="text-muted-foreground text-lg">
                                            {selectedEvent?.resource.equipo?.marca} {selectedEvent?.resource.equipo?.modelo} (
                                            {selectedEvent?.resource.equipo?.year})
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Grupo: {selectedEvent?.resource.equipo?.grupoUnidad}
                                        </p>
                                    </div>
                                </div>
                                {getUrgencyBadge(selectedEvent.resource.urgency)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">Fecha Programada</span>
                                        </div>
                                        <p className="text-lg font-medium text-foreground">
                                            {moment(selectedEvent?.resource.mantenimiento?.fechaProximo).format("DD/MM/YYYY")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {moment(selectedEvent?.resource.mantenimiento?.fechaProximo).fromNow()}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <WrenchIcon className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">Tipo de Servicio</span>
                                        </div>
                                        <p className="text-lg font-medium text-foreground">
                                            {selectedEvent?.resource.mantenimiento?.tipoServicio || "No especificado"}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">Mecánico Asignado</span>
                                        </div>
                                        <p className="text-lg font-medium text-foreground">
                                            {selectedEvent?.resource.mantenimiento?.mecanico || "No asignado"}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <TruckIcon className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">Kilometraje</span>
                                        </div>
                                        <p className="text-lg font-medium text-foreground">
                                            {selectedEvent?.resource.mantenimiento?.kmMomento.toLocaleString()} km
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {selectedEvent?.resource.mantenimiento?.notas && (
                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">Notas</span>
                                        </div>
                                        <p className="text-foreground bg-muted p-4 rounded-lg leading-relaxed">
                                            {selectedEvent.resource.mantenimiento.notas}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {selectedEvent.resource.mantenimiento && selectedEvent?.resource.mantenimiento?.Evidencia.length > 0 && (
                                <Card className="border-border">
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <FileTextIcon className="h-5 w-5" />
                                            Evidencias ({selectedEvent?.resource.mantenimiento?.Evidencia.length})
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {selectedEvent?.resource.mantenimiento?.Evidencia.map((evidencia) => (
                                                <Card key={evidencia.id} className="border-border hover:shadow-md transition-shadow">
                                                    <CardContent className="p-3">
                                                        <p className="font-medium text-sm text-foreground truncate">{evidencia.nombre}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{evidencia.tipo}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t border-border">
                                <Button variant="outline" onClick={handleCloseModal}>
                                    Cerrar
                                </Button>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <WrenchIcon className="h-4 w-4 mr-2" />
                                    Editar Mantenimiento
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MantenimientosCalendarioPage