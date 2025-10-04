"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Edit, Map, MapPin, Truck, User } from "lucide-react"
import DeleteRouteDialog from "./delete-route-dialog"
import { Ruta } from "../../equipos/types/rutas"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface RouteCardProps {
    route: Ruta
    directLink: string
    handleViewMap: (route: Ruta) => void
}

const RouteCard = ({ route, directLink, handleViewMap }: RouteCardProps) => {
    const router = useRouter()

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold">{route.cliente}</CardTitle>
                        <p className="text-sm text-muted-foreground">{route.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={route.activa ? "default" : "secondary"}>{route.activa ? "Activa" : "Inactiva"}</Badge>
                        <Badge variant={route.tipoViaje === "local" ? "secondary" : "default"}>{route.tipoViaje}</Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <div>
                            <p className="text-sm font-medium">Origen</p>
                            <p className="text-sm text-muted-foreground">{route.origen?.nombre}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <div>
                            <p className="text-sm font-medium">Destino</p>
                            <p className="text-sm text-muted-foreground">{route.destino?.nombre}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium">{route.trayecto.kilometros} km</p>
                            <p className="text-xs text-muted-foreground">Distancia</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <div>
                            <p className="text-sm font-medium">{route.trayecto.horas}h</p>
                            <p className="text-xs text-muted-foreground">Duración</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium capitalize">{route.trayecto.tipoTrayecto}</p>
                            <p className="text-xs text-muted-foreground">Tipo</p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t">
                    <Badge variant="outline" className="text-xs capitalize">
                        {route.clasificacion}
                    </Badge>
                    {route.viajeFacturable && (
                        <Badge variant="outline" className="ml-2 text-xs">
                            Facturable
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewMap(route)}>
                        <Map className="h-4 w-4 mr-1" />
                        Ver Mapa
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`${directLink}/editar?rutaId=${route.id}`)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteRouteDialog routeId={route.id} variant="outline" />
                </div>
            </CardContent>
        </Card>
    )
}

export default RouteCard