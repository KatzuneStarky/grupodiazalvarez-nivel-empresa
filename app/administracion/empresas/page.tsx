"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas"
import EmpresaCard from "@/modules/empresas/components/empresa-card"
import { Empresa } from "@/modules/empresas/types/empresas"
import { Building2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

const EmpresasPage = () => {
    const [filteredEmpresas, setFilderesEmpresas] = useState<Empresa[]>([])
    const [industryFilter, setIndustryFilter] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")

    const { empresas, loading, error } = useAllEmpreas()

    const industries = Array.from(new Set(empresas.map((e) => e.industria).filter(Boolean)))

    useEffect(() => {
        setFilderesEmpresas(empresas.filter(
            (empresa) =>
                empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                empresa.rfc.toLowerCase().includes(searchTerm.toLowerCase()),
        ))
    }, [searchTerm])

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Cargando empresas...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Empresas</h1>
                    <p className="text-muted-foreground">Administra la información de las empresas registradas</p>
                </div>
                <Button onClick={() => window.location.href = "/administracion/empresas/nuevo"}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Empresa
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o RFC..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filtrar por industria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las industrias</SelectItem>
                        {industries.map((industry) => (
                            <SelectItem key={industry} value={industry!}>
                                {industry}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {empresas.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No se encontraron empresas</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm || industryFilter !== "all"
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "Comienza agregando tu primera empresa"}
                    </p>
                    {!searchTerm &&
                        industryFilter === "all" && (
                            <Button onClick={() => window.location.href = "/administracion/empresas/nuevo"}>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Primera Empresa
                            </Button>
                        )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {empresas.map((empresa, index) => (
                        <div>
                            <EmpresaCard key={index} empresa={empresa} onDelete={() => { }} onEdit={() => { }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EmpresasPage