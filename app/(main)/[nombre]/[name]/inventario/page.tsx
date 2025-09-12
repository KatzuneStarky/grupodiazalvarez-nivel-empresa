"use client"

import { useInventarioFilters } from "@/modules/mantenimiento/inventario/hooks/use-inventario-filters"
import InventoryCard from "@/modules/mantenimiento/inventario/components/inventory-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Package, Plus, Search } from "lucide-react"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const InventarioPage = () => {
    const { directLink } = useDirectLink("/inventario/nuevo")
    const router = useRouter()
    const {
        searchTerm,
        setSearchTerm,
        filteredInventories,
        totalInventories,
        totalProducts,
        totalLowStock,
        totalOutOfStock,
        getInvenroyCardData
    } = useInventarioFilters()

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Registros de inventarios</h1>
                        <p className="text-muted-foreground">
                            Gestione la informacion de los inventarios de cada equipo registrado en la plataforma.
                        </p>
                    </div>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push(directLink)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Inventario
                </Button>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted dark:text-gray-300">Total Inventarios</p>
                                <p className="text-2xl font-bold">{totalInventories}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-chart-1" />
                            <div>
                                <p className="text-sm text-muted dark:text-gray-300">Total Productos</p>
                                <p className="text-2xl font-bold">{totalProducts}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-chart-4" />
                            <div>
                                <p className="text-sm text-muted dark:text-gray-300">Stock Bajo</p>
                                <p className="text-2xl font-bold">{totalLowStock}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-red-700" />
                            <div>
                                <p className="text-sm text-muted dark:text-gray-300">Agotados</p>
                                <p className="text-2xl font-bold">{totalOutOfStock}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center justify-between gap-2">
                            <div className='flex items-center gap-2'>
                                <Search className="h-4 w-4" />
                                Búsqueda y Filtros
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardHeader>
                    <div className="flex items-center justify-between w-full gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder=""
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Button>
                            <Filter />
                            Limpiar filtros
                        </Button>
                    </div>
                </CardHeader>
            </Card>
            <Separator className="my-4" />

            {filteredInventories.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron inventarios</h3>
                        <p className="text-muted dark:text-gray-400">Intenta ajustar la búsqueda.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInventories.map((inventory) => {
                        const data = getInvenroyCardData(inventory)
                        return (
                            <InventoryCard
                                key={inventory.id}
                                inventory={inventory}
                                inStockCount={data.inStockCount}
                                lowStockCount={data.lowStockCount}
                                outOfStockCount={data.outOfStockCount}
                                totalLowStock={totalLowStock}
                                totalOutOfStock={totalOutOfStock}
                                totalProducts={data.totalProducts}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default InventarioPage