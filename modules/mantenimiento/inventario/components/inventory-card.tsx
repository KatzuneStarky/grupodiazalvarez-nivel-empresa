"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, Calendar, CheckCircle, Package } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Inventario } from "../types/inventario"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface InventoryCardProps {
    inventory: Inventario
    inStockCount: number
    lowStockCount: number
    outOfStockCount: number
    totalProducts: number
    totalLowStock: number
    totalOutOfStock: number
}

const InventoryCard = ({ inventory, inStockCount, lowStockCount, outOfStockCount, totalProducts }: InventoryCardProps) => {
    const { directLink } = useDirectLink("/inventario")
    const router = useRouter()

    return (
        <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border bg-card"
            onClick={() => {
                router.push(`${directLink}/${inventory.id}`)
            }}
        >
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold text-card-foreground">{inventory.nombre}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {totalProducts} producto{totalProducts > 1 ? "s" : ""}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-chart-3/10">
                        <CheckCircle className="h-4 w-4 text-chart-3 mx-auto mb-1" />
                        <p className="text-sm font-medium text-chart-3">{inStockCount}</p>
                        <p className="text-xs text-muted dark:text-white">En Stock</p>
                    </div>

                    <div className="text-center p-2 rounded-lg bg-chart-4/10">
                        <AlertTriangle className="h-4 w-4 text-chart-4 mx-auto mb-1" />
                        <p className="text-sm font-medium text-chart-4">{lowStockCount}</p>
                        <p className="text-xs text-muted dark:text-white">Stock Bajo</p>
                    </div>

                    <div className="text-center p-2 rounded-lg bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive mx-auto mb-1" />
                        <p className="text-sm font-medium text-destructive">{outOfStockCount}</p>
                        <p className="text-xs text-muted dark:text-white">Agotados</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted dark:text-gray-200">
                    <Calendar className="h-4 w-4" />
                    <span>Actualizado: {format(parseFirebaseDate(inventory.fechaActualizacion), "PPP", { locale: es })}</span>
                </div>

                {totalProducts > 0 && (
                    <div className="pt-2 border-t border-border">
                        <div className="flex justify-between text-xs text-muted">
                            <span className="text-gray-300">Estado general:</span>
                            <span
                                className={`font-medium ${outOfStockCount > 0 ? "text-destructive" : lowStockCount > 0 ? "text-chart-4" : "text-chart-3"
                                    }`}
                            >
                                {outOfStockCount > 0 ? "Requiere atención" : lowStockCount > 0 ? "Stock bajo" : "Óptimo"}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default InventoryCard