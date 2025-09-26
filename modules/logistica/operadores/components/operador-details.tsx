"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Operador } from '../../bdd/operadores/types/operadores'
import { parseFirebaseDate } from '@/utils/parse-timestamp-date'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

const OperadorDetails = ({ operador }: { operador: Operador }) => {
    const getInitials = (nombres: string, apellidos: string) => {
        return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalles del Operador</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={operador.image || "/placeholder.svg"} alt={`${operador.nombres} ${operador.apellidos}`} />
                            <AvatarFallback className="text-xl">{getInitials(operador.nombres, operador.apellidos)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-2xl font-bold">
                                {operador.nombres} {operador.apellidos}
                            </h3>
                            <p className="text-muted-foreground">{operador.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Información Personal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Teléfono:</span>
                                    <span className="font-medium">{operador.telefono}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">NSS:</span>
                                    <span className="font-medium">{operador.nss}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">CURP:</span>
                                    <span className="font-medium">{operador.curp}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">INE:</span>
                                    <span className="font-medium">{operador.ine}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tipo de Sangre:</span>
                                    <Badge variant="destructive">{operador.tipoSangre}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Dirección</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Calle:</span>
                                    <span className="font-medium">{operador.calle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Número Exterior:</span>
                                    <span className="font-medium">{operador.externo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Colonia:</span>
                                    <span className="font-medium">{operador.colonia}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Código Postal:</span>
                                    <span className="font-medium">{operador.cp}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Información de Licencia</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Número de Licencia:</span>
                                    <Badge variant="secondary">{operador.numLicencia}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tipo de Licencia:</span>
                                    <Badge variant="outline">{operador.tipoLicencia}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Emisor:</span>
                                    <span className="font-medium">{operador.emisor}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Fechas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Creado:</span>
                                    <span className="font-medium">{parseFirebaseDate(operador.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Actualizado:</span>
                                    <span className="font-medium">{parseFirebaseDate(operador.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OperadorDetails