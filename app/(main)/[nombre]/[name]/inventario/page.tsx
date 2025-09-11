"use client"

import { useInventarioTaller } from "@/modules/mantenimiento/inventario/hooks/use-inventario-taller"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Filter, Package, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const InventarioPage = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const { inventarioTaller, loading, error } = useInventarioTaller()
    const { directLink } = useDirectLink("/inventario/nuevo")
    const router = useRouter()

    const filteredInventories = inventarioTaller.filter((inventory) => inventory.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    const totalInventories = inventarioTaller.length
    const totalProducts = inventarioTaller.reduce((sum, inv) => sum + inv.productos.length, 0)
    const totalLowStock = inventarioTaller.reduce(
        (sum, inv) => sum + inv.productos.filter((p) => p.minimo && p.cantidad <= p.minimo).length,
        0,
    )
    const totalOutOfStock = inventarioTaller.reduce(
        (sum, inv) => sum + inv.productos.filter((p) => p.cantidad === 0).length,
        0,
    )

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
        </div>
    )
}

export default InventarioPage