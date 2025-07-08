"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CompanyContactCard from "@/modules/contactos/components/company-contact-card"
import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas"
import { Building2, Contact, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useMemo, useState } from "react"

const ContactosPage = () => {
    const [principalFilter, setPrincipalFilter] = useState<string>("all")
    const [industryFilter, setIndustryFilter] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    const { empresas, loading, error } = useAllEmpreas()

    const hasContacts = empresas.find((empresa) => empresa.contactos.length > 0)
    const industries = useMemo(() => {
        const uniqueIndustries = Array.from(new Set(empresas.map((e) => e.industria).filter(Boolean)))
        return uniqueIndustries as string[]
    }, [empresas])

    const filteredEmpresas = useMemo(() => {
        if (empresas.length === 0) return []

        return empresas
            .filter((empresa) => {
                const companyNameMatch = empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())

                const contactNameMatch = empresa.contactos.some((contact) =>
                    contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
                )

                const industryMatch = industryFilter === "all" || empresa.industria === industryFilter

                let principalMatch = true
                if (principalFilter === "principal") {
                    principalMatch = empresa.contactos.some((contact) => contact.principal)
                } else if (principalFilter === "non-principal") {
                    principalMatch = empresa.contactos.some((contact) => !contact.principal)
                }

                return (companyNameMatch || contactNameMatch) && industryMatch && principalMatch
            })
            .map((empresa) => ({
                ...empresa,
                contactos: empresa.contactos.filter((contact) => {
                    const contactNameMatch = contact.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                    const companyNameMatch = empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())

                    let principalMatch = true
                    if (principalFilter === "principal") {
                        principalMatch = contact.principal
                    } else if (principalFilter === "non-principal") {
                        principalMatch = !contact.principal
                    }

                    return (contactNameMatch || companyNameMatch || searchTerm === "") && principalMatch
                }),
            }))
    }, [empresas, searchTerm, industryFilter, principalFilter])

    const clearFilters = () => {
        setSearchTerm("")
        setIndustryFilter("all")
        setPrincipalFilter("all")
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <h1 className="text-3xl font-bold">Directorio de Contactos</h1>
                    <div className="text-sm text-muted-foreground">
                        {filteredEmpresas.length} empresa(s),{" "}
                        {filteredEmpresas.reduce((acc, e) => acc + e.contactos.length, 0)}{" "}
                        contacto(s)
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar empresas o contactos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={industryFilter} onValueChange={setIndustryFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Industria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las industrias</SelectItem>
                                {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={principalFilter} onValueChange={setPrincipalFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Tipo de contacto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los contactos</SelectItem>
                                <SelectItem value="principal">Solo principales</SelectItem>
                                <SelectItem value="non-principal">Solo secundarios</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap bg-transparent">
                            <Filter className="h-4 w-4 mr-2" />
                            Limpiar filtros
                        </Button>

                        <Button
                            onClick={() => router.push("/administracion/contactos/nuevo")}
                            className="whitespace-nowrap"
                        >
                            <Contact className="h-4 w-4 mr-2" />
                            Nuevo contacto
                        </Button>
                    </div>
                </div>
            </div>

            {filteredEmpresas.length === 0 ? (
                <Card className="p-8 text-center">
                    <div className="space-y-2">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-medium">No se encontraron resultados</h3>
                        <p className="text-muted-foreground">Intenta ajustar tus filtros o términos de búsqueda</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-8">
                    {filteredEmpresas.map((empresa) => (
                        <CompanyContactCard key={empresa.id} empresa={empresa} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ContactosPage