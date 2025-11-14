"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import { meses } from "@/constants/meses"

interface ReporteViajesFiltersProps {
    setSelectedMunicipio: React.Dispatch<React.SetStateAction<string>>
    setSelectedProduct: React.Dispatch<React.SetStateAction<string>>
    setSelectedClient: React.Dispatch<React.SetStateAction<string>>
    setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
    setSelectedYear: React.Dispatch<React.SetStateAction<string>>
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    uniqueYears: (number | undefined)[]
    handleClearFilters: () => void
    uniqueMunicipios: string[]
    selectedMunicipio: string
    uniqueProducts: string[]
    selectedProduct: string
    uniqueClients: string[]
    selectedClient: string
    selectedMonth: string
    selectedYear: string
    searchTerm: string
}

const ReporteViajesFilters = ({
    setSelectedMunicipio,
    handleClearFilters,
    setSelectedProduct,
    setSelectedClient,
    selectedMunicipio,
    setSelectedMonth,
    uniqueMunicipios,
    setSelectedYear,
    selectedProduct,
    uniqueProducts,
    selectedClient,
    setSearchTerm,
    selectedMonth,
    uniqueClients,
    selectedYear,
    uniqueYears,
    searchTerm,
}: ReporteViajesFiltersProps) => {
    return (
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
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente, producto, operador o municipio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button onClick={() => handleClearFilters()}>
                        <Filter />
                        Limpiar filtros
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Producto" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los productos</SelectItem>
                            {uniqueProducts.map((product) => (
                                <SelectItem key={product} value={product}>
                                    {product}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los clientes</SelectItem>
                            {uniqueClients.map((client) => (
                                <SelectItem key={client} value={client}>
                                    {client}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedMunicipio} onValueChange={setSelectedMunicipio}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Municipio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los municipios</SelectItem>
                            {uniqueMunicipios.map((municipality) => (
                                <SelectItem key={municipality} value={municipality}>
                                    {municipality}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los meses</SelectItem>
                            {meses.map((month) => (
                                <SelectItem key={month} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los años</SelectItem>
                            {uniqueYears.map((year) => (
                                <SelectItem key={year} value={year?.toString() || ""}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}

export default ReporteViajesFilters