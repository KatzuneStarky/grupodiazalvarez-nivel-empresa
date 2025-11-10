"use client"

import GraficasCard from "@/modules/logistica/graficas/components/otros/graficas-card"
import { ChartSection } from "@/modules/logistica/graficas/types/chart-section"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { ChartLineIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const ChartsPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { directLink } = useDirectLink("")

    const sections: ChartSection[] = [
    {
        id: "logistica",
        title: "Logistica",
        description: "Seccion de graficas para el area de logistica (Graficas sobre faltantes/sobrantes, cantidad de viajes, etc)",
        icon: "mdi:tanker-truck",
        href: `${directLink}/graficas/logistica`,
    }
]

    const filteredSections = sections.filter(
        (section) =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <PageTitle
                title="Graficas"
                description="Centro de graficas, explore las diferentes graficas presentadas en el sistema"
                icon={
                    <ChartLineIcon className="w-12 h-12 text-primary" />
                }
            />
            <div className="mt-12">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Busque el tipo de grafica requerido..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
                    {filteredSections.map((f) => (
                        <GraficasCard section={f} key={f.id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChartsPage