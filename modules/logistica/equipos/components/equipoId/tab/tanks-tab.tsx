"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { FileText, Fuel, MapPin, Shield } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface TanksTabProps {
    equipo: Equipo | null
    isExpired: (date: Date) => boolean
}

const TanksTab = ({
    equipo,
    isExpired
}: TanksTabProps) => {
    const getStatusColor = (estado?: string) => {
        switch (estado?.toLowerCase()) {
            case "bueno":
                return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
            case "regular":
                return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
            case "malo":
                return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <TabsContent value="tanks" className="space-y-4 mt-6">
            <div>
                {equipo?.tanque && equipo?.tanque.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Fuel className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No hay tanques registrados</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {equipo?.tanque && equipo?.tanque.map((tanque, index) => (
                            <Card key={tanque.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Fuel className="w-5 h-5" />
                                            Tanque {index + 1}
                                        </span>
                                        {tanque.estadoFisico && (
                                            <Badge className={getStatusColor(tanque.estadoFisico)}>{tanque.estadoFisico}</Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Marca</p>
                                            <p className="font-medium">{tanque.marca}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Modelo</p>
                                            <p className="font-medium">{tanque.modelo}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Capacidad</p>
                                            <p className="font-medium">{tanque.capacidadLitros} L</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Combustible</p>
                                            <Badge variant="outline">{tanque.tipoCombustible}</Badge>
                                        </div>
                                        {tanque.ubicacion && (
                                            <div className="col-span-2">
                                                <p className="text-sm text-muted-foreground">Ubicación</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <p className="font-medium">{tanque.ubicacion}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {tanque.seguro && (
                                        <div className="pt-3 border-t">
                                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Seguro
                                            </p>
                                            <div className="space-y-1 text-sm">
                                                <p>
                                                    <span className="text-muted-foreground">Aseguradora:</span> {tanque.seguro.aseguradora}
                                                </p>
                                                <p>
                                                    <span className="text-muted-foreground">Póliza:</span> {tanque.seguro.numeroPoliza}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Vigencia:</span>
                                                    {format(parseFirebaseDate(tanque.seguro.vigenciaHasta), "PPP", { locale: es })}
                                                    {isExpired(tanque.seguro.vigenciaHasta) && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Vencido
                                                        </Badge>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {tanque.permisoSCT && (
                                        <div className="pt-3 border-t">
                                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Permiso SCT
                                            </p>
                                            <div className="space-y-1 text-sm">
                                                <p>
                                                    <span className="text-muted-foreground">Número:</span> {tanque.permisoSCT.numero}
                                                </p>
                                                <p>
                                                    <span className="text-muted-foreground">Tipo:</span> {tanque.permisoSCT.tipo}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Vigencia:</span>
                                                    {format(parseFirebaseDate(tanque.permisoSCT.vigenciaHasta), "PPP", { locale: es })}
                                                    {isExpired(tanque.permisoSCT.vigenciaHasta) && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Vencido
                                                        </Badge>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </TabsContent>
    )
}

export default TanksTab