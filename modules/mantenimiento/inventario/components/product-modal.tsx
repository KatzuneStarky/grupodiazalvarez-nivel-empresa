"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductoInventario } from "../types/producto-inventario"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package } from "lucide-react"
import { format } from "date-fns"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { es } from "date-fns/locale"

interface ProductModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    product: ProductoInventario
    ubicacion: string
}

const ProductModal = ({
    open,
    setOpen,
    product,
    ubicacion
}: ProductModalProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Vista general del producto
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Llave del producto</span>
                            <Badge variant="outline">{product.productoSAT.key}</Badge>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div>
                                    <span className="text-sm text-muted-foreground">Unidad SAT</span>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {product.unidad.key} - {product.unidad.description}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Descripción del Producto</span>
                                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">{product.productoSAT.description}</div>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Ubicacion</span>
                                <div className="mt-1 p-3 bg-muted rounded-md text-sm">{ubicacion}</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-semibold">Información de Stock</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-l-blue-500">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-200 mb-2 text-sm uppercase tracking-wide">Cantidad Actual</h4>
                                    <p className="text-3xl font-bold text-blue-600">{product.cantidad}</p>
                                </div>
                                <div className="dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-l-amber-500">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-200 mb-2 text-sm uppercase tracking-wide">Stock Mínimo</h4>
                                    <p className="text-3xl font-bold text-amber-600">{product.minimo || "—"}</p>
                                </div>

                                <div className="dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-l-green-500">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-200 mb-2 text-sm uppercase tracking-wide">Stock Máximo</h4>
                                    <p className="text-3xl font-bold text-green-600">{product.maximo || "—"}</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-semibold">Historial de fechas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Última Entrada
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar />
                                        <p className="text-gray-800 dark:text-muted-foreground font-medium">
                                            {format(parseFirebaseDate(product.fechaUltimaEntrada), "PPP", { locale: es })}
                                        </p>
                                    </div>
                                </div>

                                <div className="dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        Última Salida
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar />
                                        <p className="text-gray-800 dark:text-muted-foreground font-medium">
                                            {format(parseFirebaseDate(product.fechaUltimaSalida), "PPP", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-semibold">Notas</h3>
                            <div className="dark:bg-card p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-400">
                                <p className="text-gray-700 dark:text-white whitespace-pre-wrap leading-relaxed">{product.notas}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductModal