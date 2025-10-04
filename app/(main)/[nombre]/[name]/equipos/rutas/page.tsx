"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoutesManager from "@/modules/logistica/rutas/components/routes-manager"
import { useRutas } from "@/modules/logistica/rutas/hooks/use-rutas"
import { Ruta } from "@/modules/logistica/equipos/types/rutas"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Plus, Route, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

const EquiposRutasPage = () => {
    const [selectedRoute, setSelectedRoute] = useState<Ruta | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const { directLink } = useDirectLink("/equipos/rutas")
    const router = useRouter()
    const { rutas } = useRutas()

    const activeRoutes = rutas?.filter((route) => route.activa).length
    const totalDistance = rutas?.reduce((sum, route) => sum + route.trayecto.kilometros, 0)
    const billableRoutes = rutas?.filter((route) => route.viajeFacturable).length

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Gestor de Rutas</h1>
                            <p className="text-muted-foreground">Administra las rutas de transporte de combustible</p>
                        </div>
                    </div>
                    <Button className="flex items-center gap-2" onClick={() => router.push(`${directLink}/nuevo`)}>
                        <Plus className="h-4 w-4" />
                        Nueva Ruta
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Rutas</CardTitle>
                            <Route className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rutas?.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
                            <Route className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeRoutes}</div>
                            <p className="text-xs text-muted-foreground">
                                {rutas && rutas?.length > 0 ? Math.round((activeRoutes || 0 / rutas?.length) * 100) : 0}% del total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
                            <Route className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalDistance?.toLocaleString()} km</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutas Facturables</CardTitle>
                            <Route className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{billableRoutes}</div>
                            <p className="text-xs text-muted-foreground">
                                {rutas && rutas?.length > 0 ? Math.round((billableRoutes || 0 / rutas?.length) * 100) : 0}% del total
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <RoutesManager routes={rutas || []} directLink={directLink} />
        </div>
    )
}

export default EquiposRutasPage