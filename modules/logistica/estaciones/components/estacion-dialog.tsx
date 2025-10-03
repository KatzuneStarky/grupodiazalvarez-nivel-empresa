"use client"

import { BadgeIcon, Building, Calendar, Clock, FileText, Fuel, IdCard, Mail, MapPin, Phone, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getFuelTypeColor } from "../../tanques/constants/fuel-type-color"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Separator } from "@/components/ui/separator"
import { EstacionServicio } from "../types/estacion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface DialogProps {
    selectedStation: EstacionServicio | null
    setSelectedStation: React.Dispatch<React.SetStateAction<EstacionServicio | null>>
    getFuelLevelColor: (value: number) => void
}

export const EstacionDialog = ({
    selectedStation,
    setSelectedStation,
    getFuelLevelColor
}: DialogProps) => {
    const contactoArray = Array(selectedStation?.contacto || [])

    return (
        <Dialog open={!!selectedStation} onOpenChange={() => setSelectedStation(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {selectedStation && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-balance">{selectedStation.nombre}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Información General
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        {selectedStation.razonSocial && (
                                            <p>
                                                <span className="font-medium">Razón Social:</span> {selectedStation.razonSocial}
                                            </p>
                                        )}
                                        {selectedStation.rfc && (
                                            <p>
                                                <span className="font-medium">RFC:</span> {selectedStation.rfc}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-medium">Estado:</span>
                                            <Badge className="ml-2" variant={selectedStation.activo ? "default" : "secondary"}>
                                                {selectedStation.activo ? "Activa" : "Inactiva"}
                                            </Badge>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Fechas
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="font-medium">Fecha de Registro:</span>{" "}
                                            {format(parseFirebaseDate(selectedStation.fechaRegistro), "PPP", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Dirección
                                </h3>
                                <div className="text-sm space-y-1">
                                    <p>
                                        {selectedStation.direccion.calle} {selectedStation.direccion.numeroExterior}
                                        {selectedStation.direccion.numeroInterior && ` Int. ${selectedStation.direccion.numeroInterior}`}
                                    </p>
                                    <p>{selectedStation.direccion.colonia}</p>
                                    <p>
                                        {selectedStation.direccion.ciudad}, {selectedStation.direccion.estado}
                                    </p>
                                    <p>
                                        {selectedStation.direccion.codigoPostal}, {selectedStation.direccion.pais}
                                    </p>
                                    <p className="text-muted-foreground">
                                        Coordenadas: {selectedStation.ubicacion?.lat}, {selectedStation.ubicacion?.lng}
                                    </p>
                                </div>
                            </div>

                            <Separator />
                            <h3 className="font-semibold">Contactos</h3>

                            {!Array.isArray(selectedStation.contacto) || selectedStation.contacto.length === 0 ? (
                                <Card>
                                    <div className="flex items-center justify-center gap-2">
                                        <IdCard className="h-8 w-8" />
                                        <span className="text-xl font-extrabold">
                                            No hay contactos disponibles
                                        </span>
                                    </div>
                                </Card>
                            ) : (
                                <div>
                                    {selectedStation.contacto.map((contacto, index) => (
                                        <Card className="space-y-2 p-4" key={index}>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                {contacto.responsable && (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <span>{contacto.responsable}</span>
                                                    </div>
                                                )}
                                                {contacto.cargo && (
                                                    <div className="flex items-center gap-2">
                                                        <BadgeIcon className="h-4 w-4" />
                                                        <span>{contacto.cargo}</span>
                                                    </div>
                                                )}
                                                {contacto.telefono && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{contacto.telefono}</span>
                                                    </div>
                                                )}
                                                {contacto.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        <span>{contacto.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedStation.numeroPermisoCRE && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Permiso CRE
                                        </h3>
                                        <p className="text-sm">{selectedStation.numeroPermisoCRE}</p>
                                    </div>
                                )}

                                {selectedStation.horarios && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Horarios
                                        </h3>
                                        <p className="text-sm">{selectedStation.horarios}</p>
                                    </div>
                                )}
                            </div>

                            {selectedStation.productos && selectedStation.productos.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Productos Ofrecidos</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStation.productos.map((producto, index) => (
                                                <Badge key={index} className={getFuelTypeColor(producto)}>
                                                    {producto}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Fuel className="h-4 w-4" />
                                    Tanques de Combustible ({selectedStation.tanques.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStation.tanques.map((tanque, index) => {
                                        const percentage = (tanque.capacidadActual / tanque.capacidadTotal) * 100

                                        return (
                                            <Card
                                                key={index}
                                                className="p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-l-4 border-l-blue-500"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Badge className={getFuelTypeColor(tanque.tipoCombustible)}>
                                                            {tanque.tipoCombustible}
                                                        </Badge>
                                                        {tanque.numeroTanque && (
                                                            <span className="text-sm font-medium text-muted-foreground">
                                                                #{tanque.numeroTanque}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-muted-foreground">Nivel actual</span>
                                                            <span className="text-lg font-bold">{Math.round(percentage)}%</span>
                                                        </div>

                                                        <Progress value={percentage} className={`h-3 ${getFuelLevelColor(percentage)}`} />

                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                                                                <div className="font-medium text-blue-700 dark:text-blue-300">Actual</div>
                                                                <div className="text-lg font-bold">{tanque.capacidadActual.toLocaleString()}</div>
                                                                <div className="text-xs text-muted-foreground">litros</div>
                                                            </div>
                                                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                                <div className="font-medium text-gray-700 dark:text-gray-300">Total</div>
                                                                <div className="text-lg font-bold">{tanque.capacidadTotal.toLocaleString()}</div>
                                                                <div className="text-xs text-muted-foreground">litros</div>
                                                            </div>
                                                        </div>

                                                        {tanque.fechaUltimaRecarga && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>Última recarga: {format(parseFirebaseDate(tanque.fechaUltimaRecarga), "PPP", { locale: es })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
