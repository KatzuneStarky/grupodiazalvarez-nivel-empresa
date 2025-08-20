"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruta } from "@/modules/logistica/equipos/types/rutas"
import { Plus, Route, Truck } from "lucide-react"
import { useState } from "react"

const EquiposRutasPage = () => {
    const [selectedRoute, setSelectedRoute] = useState<Ruta | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [routes, setRoutes] = useState<Ruta[]>([])
    const [showForm, setShowForm] = useState(false)

    const activeRoutes = routes.filter((route) => route.activa).length
    const totalDistance = routes.reduce((sum, route) => sum + route.trayecto.kilometros, 0)
    const billableRoutes = routes.filter((route) => route.viajeFacturable).length

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
                    <Button className="flex items-center gap-2">
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
                            <div className="text-2xl font-bold">{routes.length}</div>
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
                                {routes.length > 0 ? Math.round((activeRoutes / routes.length) * 100) : 0}% del total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
                            <Route className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalDistance.toLocaleString()} km</div>
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
                                {routes.length > 0 ? Math.round((billableRoutes / routes.length) * 100) : 0}% del total
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EquiposRutasPage