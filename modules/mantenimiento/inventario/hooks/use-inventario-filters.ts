import { useInventarioTaller } from "./use-inventario-taller"
import { Inventario } from "../types/inventario"
import { useState } from "react"

export const useInventarioFilters = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const { inventarioTaller } = useInventarioTaller()

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

    const getInvenroyCardData = (inventory: Inventario) => {
        const totalProducts = inventory.productos.length
        const lowStockCount = inventory.productos.filter((p) => p.minimo && p.cantidad <= p.minimo).length
        const outOfStockCount = inventory.productos.filter((p) => p.cantidad === 0).length
        const inStockCount = totalProducts - outOfStockCount

        return {
            totalProducts,
            lowStockCount,
            outOfStockCount,
            inStockCount,
        }
    }

    return {
        searchTerm,
        setSearchTerm,
        filteredInventories,
        totalInventories,
        totalProducts,
        totalLowStock,
        totalOutOfStock,
        getInvenroyCardData
    }
}
