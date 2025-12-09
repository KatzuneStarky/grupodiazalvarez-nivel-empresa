"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Fuel, MapPin, Truck, User } from "lucide-react"
import { ReporteViajes } from "../types/reporte-viajes"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface ReporteViajesCardProps {
    getStatusBadge: (value: string) => React.ReactNode
    report: ReporteViajes
}

const ReporteViajesCard = ({
    getStatusBadge,
    report
}: ReporteViajesCardProps) => {
    return (
        <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.Cliente}</CardTitle>
                    {getStatusBadge(Number(report.FALTANTESYOSOBRANTESA20 ?? 0).toFixed(2).toString())}
                </div>
                <p className="text-sm text-muted-foreground">
                    {format(parseFirebaseDate(report.Fecha), "dd/MM/yyyy", { locale: es })}
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span>{report.Producto}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{report.Equipo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{report.Operador}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{report.Municipio}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-sm bg-muted/30 p-2 rounded">
                    <div>
                        <p className="font-semibold">{report.LitrosA20?.toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">Litros A20</p>
                    </div>
                    <div>
                        <p className="font-semibold">{report.LitrosDescargadosEstaciones?.toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">Descargados</p>
                    </div>
                    <div>
                        <p className="font-semibold">{report.M3}</p>
                        <p className="text-muted-foreground text-xs">M3</p>
                    </div>
                    <div>
                        <p className="font-semibold">${report.Flete?.toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">Flete</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <div>
                        <p className="font-semibold">{report.Temp}°C</p>
                        <p className="text-muted-foreground">Temperatura</p>
                    </div>
                    <div>
                        <p className="font-semibold">{report.Incremento}%</p>
                        <p className="text-muted-foreground">Incremento</p>
                    </div>
                    <div>
                        <p className="font-semibold">#{report.FacturaPemex}</p>
                        <p className="text-muted-foreground">Factura</p>
                    </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Estado A20:</span>
                        {getStatusBadge(Number(report.FALTANTESYOSOBRANTESA20 ?? 0).toFixed(2).toString())}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Estado Natural:</span>
                        {getStatusBadge(Number(report.FALTANTESYOSOBRANTESALNATURAL ?? 0).toFixed(2).toString())}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{report.DescripcionDelViaje}</p>
            </CardContent>
        </Card>

    )
}

export default ReporteViajesCard