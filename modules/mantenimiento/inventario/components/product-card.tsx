"use client"

import { ProductoInventario } from "../types/producto-inventario"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { AlertTriangle, Calendar, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Inventario } from "../types/inventario"
import { Badge } from "@/components/ui/badge"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface ProductCardProps {
    product: ProductoInventario
    inventory: Inventario
    stockStatus: {
        status: string
        label: string
        color: "default" | "secondary" | "destructive"
    }
}

const ProductCard = ({
    product,
    inventory,
    stockStatus,
}: ProductCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-muted dark:text-white" />
                            <Badge variant="outline" className="text-xs">
                                {product.productoSAT.key}
                            </Badge>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.productoSAT.description}</h3>
                        <p className="text-xs text-muted dark:text-gray-200 mb-2">{inventory.nombre}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Badge variant={stockStatus.color} className="text-xs">
                            {stockStatus.label}
                        </Badge>
                        <span className="text-lg font-bold">
                            {product.cantidad} {product.unidad.description}
                        </span>
                    </div>

                    {(product.minimo || product.maximo) && (
                        <div className="text-xs text-muted dark:text-gray-200">
                            Rango stock: {product.minimo || 0} - {product.maximo || "∞"}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <div className="flex items-center gap-1 text-muted dark:text-gray-200">
                                <Calendar className="h-3 w-3" />
                                Entrada
                            </div>
                            <div>{format(parseFirebaseDate(product.fechaUltimaEntrada), "PPP", { locale: es })}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-muted dark:text-gray-200">
                                <Calendar className="h-3 w-3" />
                                Salida
                            </div>
                            <div>{format(parseFirebaseDate(product.fechaUltimaSalida), "PPP", { locale: es })}</div>
                        </div>
                    </div>

                    {product.notas && (
                        <div className="text-xs">
                            <div className="text-muted dark:text-gray-200 mb-1">Notas:</div>
                            <div className="line-clamp-2">{product.notas}</div>
                        </div>
                    )}

                    {stockStatus.status !== "in-stock" && (
                        <div className="flex items-center gap-2 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            {stockStatus.status === "out-of-stock" ? "Producto agotado" : "Stock por debajo del mínimo"}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductCard