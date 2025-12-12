"use client"

import { Activity, Briefcase, CalendarCheck, ClipboardList, Clock, Loader2, Mail, Phone, User, Wrench, AlertTriangle, CheckCircle2, MapPin, Gauge, Image as ImageIcon } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useOrdenesMantenimiento } from "@/modules/mantenimiento/hooks/use-ordenes-mantenimiento"
import { acceptOrdenMantenimiento } from "@/modules/mantenimiento/actions/accept-order"
import { OrdenMantenimiento } from "@/modules/mantenimiento/types/orden-mantenimiento"
import { useMecanicos } from "@/modules/mantenimiento/mecanicos/hooks/use-mecanicos"
import { Incidencia } from "@/modules/mantenimiento/incidencias/types/incidencias"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { toast } from "sonner"

const OrdenDetallesDialog = ({
    orden,
    open,
    onOpenChange
}: {
    orden: OrdenMantenimiento | null,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) => {
    const [incidencia, setIncidencia] = useState<Incidencia | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchIncidencia = async () => {
            if (!orden) return
            setLoading(true)
            try {
                const docRef = doc(db, "equipos", orden.equipoId, "incidencias", orden.incidenciaId)
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setIncidencia({ id: snap.id, ...snap.data() } as Incidencia)
                }
            } catch (error) {
                console.error("Error fetching incidencia", error)
            } finally {
                setLoading(false)
            }
        }

        if (open && orden) {
            fetchIncidencia()
        }
    }, [orden, open])

    if (!orden) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalles de Mantenimiento</DialogTitle>
                    <DialogDescription>
                        Orden #{orden.id.slice(0, 8)} - {format(parseFirebaseDate(orden.createAt), "PPP", { locale: es })}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Detalles de la Orden */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Resumen de la Orden
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-muted/50 rounded-lg">
                            <div>
                                <span className="text-muted-foreground block text-xs">Estado:</span>
                                <Badge variant="outline" className="mt-1">{orden.estado}</Badge>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs">Prioridad:</span>
                                <Badge variant="secondary" className="mt-1">{orden.prioridad}</Badge>
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground block text-xs">Descripción del Problema:</span>
                                <p className="mt-1">{orden.descripcionProblema}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Detalles de la Incidencia Original */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" /> Incidencia Reportada
                        </h3>
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : incidencia ? (
                            <div className="space-y-4 p-4 border rounded-lg">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Fecha Reporte:</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                                            {incidencia.fecha ? format(parseFirebaseDate(incidencia.fecha), "PPP", { locale: es }) : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Tipo:</span>
                                        <span className="font-medium">{incidencia.tipo}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Categoría:</span>
                                        <span className="font-medium">{incidencia.categoria || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Severidad:</span>
                                        <Badge variant={incidencia.severidad === 'Alta' ? 'destructive' : 'outline'} className="mt-0.5 text-xs">
                                            {incidencia.severidad}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">¿Equipo Operable?</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {incidencia.operable ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                            )}
                                            <span>{incidencia.operable ? 'Sí' : 'No'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Km Actual:</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                                            {incidencia.kmActual ? `${incidencia.kmActual} km` : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Combustible:</span>
                                        <span className="font-medium">{incidencia.nivelCombustible ? `${incidencia.nivelCombustible}%` : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Velocidad Aprox:</span>
                                        <span className="font-medium">{incidencia.velocidadAprox ? `${incidencia.velocidadAprox} km/h` : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs">Evidencias:</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                            {incidencia.evidencias && incidencia.evidencias.length > 0 ? `${incidencia.evidencias.length} archivos` : 'Sin evidencias'}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <span className="text-muted-foreground block text-xs mb-1">Descripción Original:</span>
                                    <p className="text-sm bg-muted/50 p-2.5 rounded-md text-foreground/90">{incidencia.descripcion}</p>
                                </div>

                                {incidencia.evidencias && incidencia.evidencias.length > 0 && (
                                    <div className="pt-4 border-t mt-2">
                                        <span className="text-muted-foreground block text-xs mb-3">Evidencias Multimedia:</span>
                                        <div className="flex justify-center">
                                            <Carousel className="w-full max-w-[240px] sm:max-w-[350px]">
                                                <CarouselContent>
                                                    {incidencia.evidencias.map((evidencia, index) => (
                                                        <CarouselItem key={index} className="basis-full">
                                                            <div className="p-1">
                                                                <Card className="border-none shadow-none bg-transparent">
                                                                    <CardContent className="flex aspect-square items-center justify-center p-0 relative overflow-hidden rounded-md border text-card-foreground shadow-sm">
                                                                        {evidencia.ruta ? (
                                                                            <img
                                                                                src={evidencia.ruta}
                                                                                alt={evidencia.nombre || `Evidencia ${index + 1}`}
                                                                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                                                onClick={() => window.open(evidencia.ruta, '_blank')}
                                                                            />
                                                                        ) : (
                                                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                                                <ImageIcon className="w-8 h-8" />
                                                                                <span className="text-xs">Sin imagen</span>
                                                                            </div>
                                                                        )}
                                                                        {evidencia.nombre && (
                                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1.5 truncate text-center backdrop-blur-sm">
                                                                                {evidencia.nombre}
                                                                            </div>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="left-2" />
                                                <CarouselNext className="right-2" />
                                            </Carousel>
                                        </div>
                                    </div>
                                )}

                                {incidencia.ubicacion && (
                                    <div className="grid gap-1 pt-2 border-t mt-2">
                                        <span className="text-muted-foreground block text-xs">Ubicación del Incidente:</span>
                                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                            <div className="space-y-0.5">
                                                <p>{incidencia.ubicacion.direccionAproximada || "Dirección no disponible"}</p>
                                                <p className="text-[10px] opacity-70">
                                                    Coordenadas: {incidencia.ubicacion.latitud.toFixed(5)}, {incidencia.ubicacion.longitud.toFixed(5)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm italic">
                                No se pudo cargar la información de la incidencia.
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const OrdenesMantenimientoPage = () => {
    const { ordenes } = useOrdenesMantenimiento()
    const { mecanicos } = useMecanicos()
    const { currentUser } = useAuth()
    const { equipos } = useEquipos()

    const [selectedOrder, setSelectedOrder] = useState<OrdenMantenimiento | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)



    const currentMecanico = mecanicos.find(mecanico => mecanico.email === currentUser?.email)

    const activeOrdersCount = ordenes.filter(o => o.mecanicoId === currentMecanico?.id && o.estado === 'En Progreso').length
    const completedOrdersCount = ordenes.filter(o => o.mecanicoId === currentMecanico?.id && o.estado === 'Completada').length

    const getPriorityColor = (prioridad: string) => {
        switch (prioridad) {
            case 'Baja': return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30"
            case 'Media': return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30"
            case 'Alta': return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30"
            case 'Critica': return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30"
            default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        }
    }

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'Pendiente': return "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20"
            case 'En Progreso': return "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20"
            case 'Completada': return "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20"
            case 'Cancelada': return "text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-500/10 dark:border-gray-500/20"
            default: return "text-gray-600 dark:text-gray-400"
        }
    }

    const handleAcceptOrder = async (ordenId: string) => {
        if (!currentMecanico) {
            toast.error("No se encuentras registrado como mecánico activo")
            return
        }
        const res = await acceptOrdenMantenimiento(ordenId, currentMecanico.id)
        if (res.success) {
            toast.success("Orden aceptada exitosamente")
        } else {
            toast.error(res.error || "Error al aceptar la orden")
        }
    }

    const OrdenCard = ({ orden }: { orden: OrdenMantenimiento }) => {
        const [isAccepting, setIsAccepting] = useState(false)
        const equipo = equipos.find(e => e.id === orden.equipoId)
        const assignedMecanico = mecanicos.find(m => m.id === orden.mecanicoId)
        const isAssignedToMe = currentMecanico?.id === orden.mecanicoId

        const onAccept = async () => {
            try {
                setIsAccepting(true)
                await handleAcceptOrder(orden.id)
            } finally {
                setIsAccepting(false)
            }
        }

        const priorityColor = getPriorityColor(orden.prioridad)
        const statusColor = getStatusColor(orden.estado)

        // Map priority to a tailwind color
        const getPriorityBorderColor = (p: string) => {
            switch (p) {
                case 'Critica': return "border-l-red-500 dark:border-l-red-600"
                case 'Alta': return "border-l-orange-500 dark:border-l-orange-600"
                case 'Media': return "border-l-yellow-500 dark:border-l-yellow-600"
                case 'Baja': return "border-l-blue-500 dark:border-l-blue-600"
                default: return "border-l-gray-300 dark:border-l-gray-600"
            }
        }

        return (
            <Card className={`group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl border-l-[6px] ${getPriorityBorderColor(orden.prioridad)} ${isAssignedToMe ? 'bg-blue-50/20 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' : 'hover:border-primary/50 dark:hover:border-primary/50'}`}>

                {/* Background Pattern for visuals */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.07] dark:group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                    <ClipboardList className="w-24 h-24" />
                </div>

                <CardHeader className="pb-3 relative z-10">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge variant="outline" className={`${statusColor} font-medium px-2.5 py-0.5 shadow-sm backdrop-blur-sm`}>
                            {orden.estado}
                        </Badge>
                        {orden.prioridad === 'Critica' && (
                            <Badge variant="destructive" className="animate-pulse shadow-md">
                                Crítica
                            </Badge>
                        )}
                        {orden.prioridad !== 'Critica' && (
                            <Badge variant="secondary" className="bg-muted/80 text-muted-foreground hover:bg-muted text-[10px] uppercase tracking-wider dark:bg-muted/50">
                                {orden.prioridad}
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground/90">
                            {equipo ? (
                                <>
                                    <div className="p-1.5 rounded-md bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90">
                                        <Wrench className="h-4 w-4" />
                                    </div>
                                    <span>Unidad {equipo.numEconomico}</span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">Unidad Desconocida</span>
                            )}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[40px] text-sm leading-relaxed pt-1 text-muted-foreground/90 dark:text-muted-foreground">
                            {orden.descripcionProblema}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pb-3 space-y-4 relative z-10">
                    <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/40 p-2 rounded border border-muted/50 dark:bg-muted/20 dark:border-border/30">
                            <Clock className="h-3.5 w-3.5 text-primary/70 dark:text-primary/60" />
                            <span className="font-medium">
                                {format(parseFirebaseDate(orden.createAt), "PPP", { locale: es })}
                            </span>
                            <span className="text-muted-foreground/60">•</span>
                            <span>
                                {format(parseFirebaseDate(orden.createAt), "p", { locale: es })}
                            </span>
                        </div>
                    </div>

                    {assignedMecanico ? (
                        <div className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${isAssignedToMe ? 'bg-blue-100/40 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-100' : 'bg-muted/30 border-transparent text-muted-foreground dark:bg-muted/10'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isAssignedToMe ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-500' : 'bg-muted text-muted-foreground dark:bg-secondary dark:text-secondary-foreground'}`}>
                                {assignedMecanico.nombre.charAt(0)}{assignedMecanico.apellidos.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-[10px] uppercase tracking-wider opacity-80 ${isAssignedToMe ? 'dark:text-blue-200' : ''}`}>Asignado a</span>
                                <span className="font-semibold text-sm truncate max-w-[150px]">
                                    {isAssignedToMe ? "Mí (Tú)" : `${assignedMecanico.nombre} ${assignedMecanico.apellidos}`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-yellow-300 bg-yellow-50/50 text-yellow-700 dark:border-yellow-700/50 dark:bg-yellow-900/20 dark:text-yellow-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-medium">Sin asignar</span>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="pt-2 pb-4 relative z-10">
                    {orden.estado === 'Pendiente' ? (
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                            onClick={onAccept}
                            disabled={isAccepting || !currentMecanico}
                        >
                            {isAccepting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Aceptando...
                                </>
                            ) : (
                                "Aceptar Orden"
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-input hover:bg-accent hover:text-accent-foreground group-hover:border-primary/50 transition-colors dark:hover:bg-primary/10 dark:hover:text-primary-foreground"
                            onClick={() => {
                                setSelectedOrder(orden)
                                setDetailsOpen(true)
                            }}
                        >
                            Ver Detalles
                        </Button>
                    )}
                </CardFooter>
            </Card>
        )
    }

    const EmptyState = ({ message }: { message: string }) => (
        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors dark:bg-muted/10 dark:border-muted-foreground/10">
            <div className="bg-muted p-4 rounded-full mb-4 ring-8 ring-muted/30 dark:bg-muted/20 dark:ring-muted/10">
                <ClipboardList className="w-8 h-8 text-muted-foreground dark:text-muted-foreground/80" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Sin órdenes</h3>
            <p className="text-muted-foreground text-sm max-w-sm">{message}</p>
        </div>
    )

    return (
        <div className="w-full container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
            <PageTitle
                title="Órdenes de Mantenimiento"
                description="Gestión y seguimiento de trabajos de taller"
                icon={<ClipboardList className="h-12 w-12 text-muted-foreground" />}
            />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:flex-1 space-y-6 min-w-0">
                    <Tabs defaultValue="pendientes" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/60 rounded-xl mb-6">
                            <TabsTrigger value="pendientes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200">
                                Pendientes
                            </TabsTrigger>
                            <TabsTrigger value="en_progreso" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200">
                                En Progreso
                            </TabsTrigger>
                            <TabsTrigger value="completadas" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200">
                                Completadas
                            </TabsTrigger>
                            <TabsTrigger value="todas" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200">
                                Todas
                            </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[400px]">
                            <TabsContent value="pendientes" className="mt-0 focus-visible:outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {ordenes.filter(o => o.estado === 'Pendiente').length > 0 ? (
                                        ordenes.filter(o => o.estado === 'Pendiente').map(orden => (
                                            <OrdenCard key={orden.id} orden={orden} />
                                        ))
                                    ) : (
                                        <EmptyState message="No hay órdenes pendientes de aceptación en este momento." />
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="en_progreso" className="mt-0 focus-visible:outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {ordenes.filter(o => o.estado === 'En Progreso').length > 0 ? (
                                        ordenes.filter(o => o.estado === 'En Progreso').map(orden => (
                                            <OrdenCard key={orden.id} orden={orden} />
                                        ))
                                    ) : (
                                        <EmptyState message="No tienes ninguna orden en progreso actualmente." />
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="completadas" className="mt-0 focus-visible:outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {ordenes.filter(o => o.estado === 'Completada').length > 0 ? (
                                        ordenes.filter(o => o.estado === 'Completada').map(orden => (
                                            <OrdenCard key={orden.id} orden={orden} />
                                        ))
                                    ) : (
                                        <EmptyState message="Aún no has completado ninguna orden de mantenimiento." />
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="todas" className="mt-0 focus-visible:outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {ordenes.length > 0 ? (
                                        ordenes.map(orden => (
                                            <OrdenCard key={orden.id} orden={orden} />
                                        ))
                                    ) : (
                                        <EmptyState message="No se encontraron registros de órdenes en el sistema." />
                                    )}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                <div className="w-full lg:w-80 xl:w-96 shrink-0">
                    <div className="sticky top-6 space-y-6">
                        {currentMecanico ? (
                            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-secondary/10">
                                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                                    <div className="absolute -bottom-10 left-6">
                                        <div className="h-20 w-20 rounded-full bg-background p-1 shadow-xl">
                                            <div className="h-full w-full rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center overflow-hidden">
                                                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                    {currentMecanico.nombre.charAt(0)}{currentMecanico.apellidos.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-12 pb-6 px-6">
                                    <div>
                                        <h3 className="font-bold text-xl truncate" title={`${currentMecanico.nombre} ${currentMecanico.apellidos}`}>
                                            {currentMecanico.nombre} {currentMecanico.apellidos}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={currentMecanico.estado === 'DISPONIBLE' ? 'default' : 'secondary'} className="text-xs font-normal">
                                                {currentMecanico.estado}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="p-3 bg-background/50 rounded-lg border shadow-sm space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-foreground/80">
                                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                                                    <Mail className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="truncate flex-1">{currentMecanico.email || "Sin email"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-foreground/80">
                                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md">
                                                    <Phone className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="flex-1">{currentMecanico.telefono || "Sin teléfono"}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col items-center justify-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 transition-colors">
                                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeOrdersCount}</span>
                                                <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70 mt-1">En curso</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-3 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800 transition-colors">
                                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{completedOrdersCount}</span>
                                                <span className="text-[10px] font-medium uppercase tracking-wider text-green-600/70 dark:text-green-400/70 mt-1">Completados</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                                                <span className="flex items-center gap-1">
                                                    <CalendarCheck className="h-3 w-3" />
                                                    Desde
                                                </span>
                                                <span className="font-medium">
                                                    {currentMecanico.createdAt
                                                        ? format(parseFirebaseDate(currentMecanico.createdAt), "MMM yyyy", { locale: es })
                                                        : "N/A"
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed bg-muted/40 shadow-none">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <User className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">Perfil no disponible</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <OrdenDetallesDialog
                orden={selectedOrder}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </div>
    )
}

export default OrdenesMantenimientoPage
