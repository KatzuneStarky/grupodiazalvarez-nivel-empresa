"use client"

import { ConsumoData } from "@/modules/logistica/consumo/types/consumo-data"
import { DollarSign, Gauge, TrendingDown, TrendingUp } from "lucide-react"
import { useConsumo } from "@/modules/logistica/consumo/hooks/use-consumo"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Card, CardContent } from "@/components/ui/card"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/global/icon"
import { format } from "date-fns"
import { useState } from "react"
import { es } from "date-fns/locale"

const ConsumoPage = () => {
    const currentMont = getCurrentMonthCapitalized()
    const { consumo } = useConsumo()

    const [mes, setMes] = useState<string>("Julio")

    const filterConsumo = (consumo: ConsumoData[], mes: string) => {
        return consumo.filter((item) => {
            const fecha = parseFirebaseDate(item.fecha);
            const nombreMes = fecha.toLocaleString("es-MX", { month: "long" });
            const capitalized = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
            return capitalized === mes;
        });
    };

    const consumoFiltrado = filterConsumo(consumo ?? [], mes);

    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Registros de consumo"
                description="Gestine y administre el consumo de la flota"
                icon={
                    <Icon iconName="picon:fuel" className="w-12 h-12" />
                }
            />

            <Separator className="my-4" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {consumoFiltrado.map((entry, index) => {
                    const eficiencia = entry.rendimientoKmL ?? 0
                    const kilometros = entry.kmRecorridos ?? 0
                    const litros = entry.litrosCargados ?? 0
                    const costo = entry.costoTotal ?? 0

                    const isEfficient = eficiencia >= 8
                    const isInefficient = eficiencia < 6

                    return (
                        <Card className="border-2 hover:shadow-md transition-shadow" key={entry.id}>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-sm">{entry.equipo?.numEconomico || "Unknown Truck"}</p>
                                        <p className="text-xs text-muted-foreground">{format(parseFirebaseDate(entry.fecha), "MMM dd, yyyy", { locale: es })}</p>
                                    </div>
                                    <Badge
                                        variant={isEfficient ? "default" : isInefficient ? "destructive" : "secondary"}
                                        className="text-xs"
                                    >
                                        {isEfficient ? (
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                        ) : isInefficient ? (
                                            <TrendingDown className="h-3 w-3 mr-1" />
                                        ) : null}
                                        {isEfficient ? "Efficiente" : isInefficient ? "Bajo" : "Normal"}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-lg">
                                    <Gauge className="h-4 w-4 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Eficiencia</p>
                                        <p className="text-lg font-bold">{eficiencia.toFixed(2)} km/L</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Distancia recorrida</p>
                                        <p className="font-semibold">{kilometros.toFixed(0)} km</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Consumo</p>
                                        <p className="font-semibold">{litros.toFixed(1)} L</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Costo total</p>
                                        <p className="font-semibold flex items-center gap-0.5">
                                            <DollarSign className="h-3 w-3" />
                                            {costo.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Operador</p>
                                        <p className="font-semibold truncate">{entry.operador?.nombres || "Unknown"}</p>
                                    </div>
                                </div>

                                {entry.viaje && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground uppercase">Destino: {entry.viaje.DescripcionDelViaje}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default ConsumoPage