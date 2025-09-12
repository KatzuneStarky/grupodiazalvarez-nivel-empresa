"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/modules/mantenimiento/inventario/components/product-card";
import { useInventarioTallerById } from "@/modules/mantenimiento/inventario/hooks/use-inventario-taller-by-id";
import { ProductoInventario } from "@/modules/mantenimiento/inventario/types/producto-inventario";
import { AlertTriangle, CheckCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";

const InventarioIdPage = ({ params }: { params: Promise<{ inventarioId: string }> }) => {
    const { inventarioId } = use(params);

    const [searchTerm, setSearchTerm] = useState("")
    const [showLowStock, setShowLowStock] = useState(false)
    const [showOutOfStock, setShowOutOfStock] = useState(false)

    const { inventarioTaller } = useInventarioTallerById(inventarioId)
    const router = useRouter()

    const filteredProducts = useMemo(() => {
        if (!inventarioTaller) return []

        return inventarioTaller.productos.filter((product) => {
            const matchesSearch =
                product.productoSAT.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productoSAT.key.includes(searchTerm)

            const isLowStock = product.minimo ? product.cantidad <= product.minimo : false
            const isOutOfStock = product.cantidad === 0

            const matchesLowStock = !showLowStock || isLowStock
            const matchesOutOfStock = !showOutOfStock || isOutOfStock

            return matchesSearch && matchesLowStock && matchesOutOfStock
        })
    }, [inventarioTaller, searchTerm, showLowStock, showOutOfStock])

    if (!inventarioTaller) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Inventario no encontrado</h3>
                        <p className="text-muted mb-4">El inventario solicitado no existe.</p>
                        <Button onClick={() => router.push("/")} variant="outline">
                            Volver al inicio
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStockStatus = (product: ProductoInventario) => {
        if (product.cantidad === 0) return { status: "out-of-stock", label: "Agotado", color: "destructive" }
        if (product.minimo && product.cantidad <= product.minimo)
            return { status: "low-stock", label: "Stock Bajo", color: "secondary" }
        return { status: "in-stock", label: "En Stock", color: "default" }
    }

    const totalProducts = inventarioTaller.productos.length
    const lowStockCount = inventarioTaller.productos.filter((p) => p.minimo && p.cantidad <= p.minimo).length
    const outOfStockCount = inventarioTaller.productos.filter((p) => p.cantidad === 0).length

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted dark:text-white">Total Productos</p>
                                <p className="text-2xl font-bold">{totalProducts}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-chart-3" />
                            <div>
                                <p className="text-sm text-muted dark:text-white">En Stock</p>
                                <p className="text-2xl font-bold">{totalProducts - outOfStockCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-chart-4" />
                            <div>
                                <p className="text-sm text-muted dark:text-white">Stock Bajo</p>
                                <p className="text-2xl font-bold">{lowStockCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-sm text-muted dark:text-white">Agotados</p>
                                <p className="text-2xl font-bold">{outOfStockCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {filteredProducts.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                        <p className="text-muted">Intenta ajustar los filtros o agregar nuevos productos.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            inventory={inventarioTaller}
                            stockStatus={{
                                color: "default",
                                status: getStockStatus(product).status,
                                label: getStockStatus(product).label,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default InventarioIdPage