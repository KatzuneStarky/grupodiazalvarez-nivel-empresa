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
            case 'Baja': return "bg-blue-100 text-blue-700 hover:bg-blue-100"
            case 'Media': return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
            case 'Alta': return "bg-orange-100 text-orange-700 hover:bg-orange-100"
            case 'Critica': return "bg-red-100 text-red-700 hover:bg-red-100"
            default: return "bg-gray-100 text-gray-700"
        }
    }

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'Pendiente': return "text-yellow-600 bg-yellow-50 border-yellow-200"
            case 'En Progreso': return "text-blue-600 bg-blue-50 border-blue-200"
            case 'Completada': return "text-green-600 bg-green-50 border-green-200"
            case 'Cancelada': return "text-gray-600 bg-gray-50 border-gray-200"
            default: return "text-gray-600"
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

        return (
            <Card className={`flex flex-col h-full hover:shadow-md transition-shadow ${isAssignedToMe ? 'border-blue-500/50 dark:border-blue-500/50 bg-blue-50/10' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className={getStatusColor(orden.estado)}>
                            {orden.estado}
                        </Badge>
                        <Badge className={getPriorityColor(orden.prioridad)}>
                            {orden.prioridad}
                        </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2 flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-muted-foreground" />
                        {equipo ? `Unidad ${equipo.numEconomico}` : "Unidad Desconocida"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                        {orden.descripcionProblema}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-3 space-y-4">
                    <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                                {format(parseFirebaseDate(orden.createAt), "PPP p", { locale: es })}
                            </span>
                        </div>
                    </div>

                    {assignedMecanico && (
                        <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium truncate">
                                {isAssignedToMe ? "Asignado a mí" : `${assignedMecanico.nombre} ${assignedMecanico.apellidos}`}
                            </span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                    {orden.estado === 'Pendiente' ? (
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
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
                        // ... (inside OrdenCard)
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full"
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

    return (
        <div className="w-full container mx-auto py-6 px-4 md:px-8 space-y-6">
            <PageTitle
                title="Órdenes de Mantenimiento"
                description="Gestión y seguimiento de trabajos de taller"
                icon={<ClipboardList className="h-12 w-12 text-muted-foreground" />}
            />
            <Separator />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content - Orders (Left 2/3) */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <Tabs defaultValue="pendientes" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                            <TabsTrigger value="en_progreso">En Progreso</TabsTrigger>
                            <TabsTrigger value="completadas">Completadas</TabsTrigger>
                            <TabsTrigger value="todas">Todas</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            {/* Pendientes Content */}
                            <TabsContent value="pendientes" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {ordenes.filter(o => o.estado === 'Pendiente').map(orden => (
                                        <OrdenCard key={orden.id} orden={orden} />
                                    ))}
                                    {ordenes.filter(o => o.estado === 'Pendiente').length === 0 && (
                                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                            No hay órdenes pendientes
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* En Progreso Content */}
                            <TabsContent value="en_progreso" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {ordenes.filter(o => o.estado === 'En Progreso').map(orden => (
                                        <OrdenCard key={orden.id} orden={orden} />
                                    ))}
                                    {ordenes.filter(o => o.estado === 'En Progreso').length === 0 && (
                                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                            No hay órdenes en progreso
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Completadas Content */}
                            <TabsContent value="completadas" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {ordenes.filter(o => o.estado === 'Completada').map(orden => (
                                        <OrdenCard key={orden.id} orden={orden} />
                                    ))}
                                    {ordenes.filter(o => o.estado === 'Completada').length === 0 && (
                                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                            No hay órdenes completadas
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Todas Content */}
                            <TabsContent value="todas" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {ordenes.map(orden => (
                                        <OrdenCard key={orden.id} orden={orden} />
                                    ))}
                                    {ordenes.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                            No hay órdenes registradas
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Sidebar - Mechanic Profile (Right 1/3) */}
                <div className="w-full lg:w-1/3">
                    <div className="sticky top-6 space-y-6">
                        {currentMecanico ? (
                            <Card className="border-l-4 border-l-blue-500 overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                                            <User className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">
                                                {currentMecanico.nombre} {currentMecanico.apellidos}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={currentMecanico.estado === 'DISPONIBLE' ? 'default' : 'secondary'} className="text-xs">
                                                    {currentMecanico.estado}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {/* Contact Info */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            Información de Contacto
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{currentMecanico.email || "Sin email"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{currentMecanico.telefono || "Sin teléfono"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Stats */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            Actividad Reciente
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20 text-center">
                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {activeOrdersCount}
                                                </div>
                                                <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">
                                                    En Progreso
                                                </div>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20 text-center">
                                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {completedOrdersCount}
                                                </div>
                                                <div className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">
                                                    Completadas
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Briefcase className="h-3 w-3" />
                                            <span>Mecánico registrado desde:</span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 text-sm font-medium pl-5">
                                            <CalendarCheck className="h-3 w-3 text-muted-foreground" />
                                            {currentMecanico.createdAt
                                                ? format(parseFirebaseDate(currentMecanico.createdAt), "PPP", { locale: es })
                                                : "Fecha desconocida"
                                            }
                                        </div>
                                    </div>

                                </CardContent>
                                <CardFooter className="bg-muted/10">
                                    <Button variant="outline" className="w-full text-xs h-8">
                                        Editar Perfil
                                    </Button>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="py-10 text-center space-y-4">
                                    <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Perfil no encontrado</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            No se pudo cargar la información del mecánico actual.
                                        </p>
                                    </div>
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
