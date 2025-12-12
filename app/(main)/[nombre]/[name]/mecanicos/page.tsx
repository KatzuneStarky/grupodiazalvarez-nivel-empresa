"use client"

import { useOrdenesMantenimiento } from "@/modules/mantenimiento/hooks/use-ordenes-mantenimiento"
import NewMechanicDialog from "@/modules/mantenimiento/mecanicos/components/new-mechanic-dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import MechanicCard from "@/modules/mantenimiento/mecanicos/components/mechanic-card"
import { useMecanicos } from "@/modules/mantenimiento/mecanicos/hooks/use-mecanicos"
import { Activity, Briefcase, CalendarCheck, Mail, Phone, User } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/global/icon"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"

import { RolUsuario } from "@/enum/user-roles"

const MecanicosPage = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { ordenes } = useOrdenesMantenimiento()
    const { mecanicos } = useMecanicos()
    const { currentUser, rol } = useAuth()

    const currentMecanico = mecanicos.find(mecanico => mecanico.email === currentUser?.email)
    const activeOrdersCount = ordenes.filter(o => o.mecanicoId === currentMecanico?.id && o.estado === 'En Progreso').length
    const completedOrdersCount = ordenes.filter(o => o.mecanicoId === currentMecanico?.id && o.estado === 'Completada').length

    const canCreateMechanic = rol === RolUsuario.Admin || rol === RolUsuario.Super_Admin

    return (
        <div className="container mx-auto py-6 px-8">
            <PageTitle
                description="Gestión de Mecánicos"
                title="Mecánicos"
                icon={<Icon iconName="mdi:mechanic" className="w-12 h-12 text-primary" />}
                hasActions={canCreateMechanic}
                actions={
                    <Button
                        onClick={() => setOpenDialog(!openDialog)}
                    >
                        <Icon iconName="mdi:plus" className="w-4 h-4" />
                        Nuevo Mecánico
                    </Button>
                }
            />
            <Separator className="my-4" />

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-3/4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mecanicos.map((mecanico) => (
                            <MechanicCard
                                key={mecanico.id}
                                mecanico={mecanico}
                                mantenimientos={[]}
                                ordenes={ordenes}
                                disabled={!!(currentMecanico && currentMecanico.id !== mecanico.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/4">
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

            {mecanicos.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No se encontraron mecánicos con los filtros seleccionados</p>
                </div>
            )}

            <NewMechanicDialog
                open={openDialog}
                setOpenDialog={setOpenDialog}
            />
        </div>
    )
}

export default MecanicosPage