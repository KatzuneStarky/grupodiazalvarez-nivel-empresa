"use client"

import ConsumoAlertsDialog from "@/modules/logistica/consumo/components/consumo-alerts-dialog"
import ConsumosTable from "@/modules/logistica/consumo/components/table/consumos-table"
import { useConsumo } from "@/modules/logistica/consumo/hooks/use-consumo"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Icon from "@/components/global/icon"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SortField = "fecha" | "litrosCargados" | "rendimientoKmL" | "costoTotal"
type SortDirection = "asc" | "desc"

const ConsumoTablaPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<SortField>("fecha")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const itemsPerPage = 50

    const { consumo, loading } = useConsumo()

    const sortedData = [...consumo].sort((a, b) => {
        let aValue: number | Date = 0
        let bValue: number | Date = 0

        switch (sortField) {
            case "fecha":
                aValue = parseFirebaseDate(a.fecha)
                bValue = parseFirebaseDate(b.fecha)
                break
            case "litrosCargados":
                aValue = a.litrosCargados || 0
                bValue = b.litrosCargados || 0
                break
            case "rendimientoKmL":
                aValue = a.rendimientoKmL || 0
                bValue = b.rendimientoKmL || 0
                break
            case "costoTotal":
                aValue = a.costoTotal || 0
                bValue = b.costoTotal || 0
                break
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    const totalPages = Math.ceil(sortedData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = sortedData.slice(startIndex, endIndex)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null
        return sortDirection === "asc" ? (
            <ArrowUpIcon className="h-3 w-3 inline ml-1" />
        ) : (
            <ArrowDownIcon className="h-3 w-3 inline ml-1" />
        )
    }

    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Tabla Consumo"
                description="Gestine y administre el consumo de la flota"
                icon={
                    <Icon iconName="picon:fuel" className="w-12 h-12" />
                }
                hasActions={true}
                actions={
                    <div className="flex items-center gap-2">
                        <ConsumoAlertsDialog alerts={[]} />
                    </div>
                }
            />
            <Separator className="my-4" />

            <Tabs defaultValue="Tabla" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1">
                    <TabsTrigger value="Tabla" className="gap-2 py-3 text-xl">
                        <Icon iconName="mdi:table-filter" className="size-8" />
                        <span className="hidden sm:inline">Tabla</span>
                    </TabsTrigger>
                    <TabsTrigger value="Tabla consumos" className="gap-2 py-3 text-xl">
                        <Icon iconName="mdi:fuel" className="size-8" />
                        <span className="hidden sm:inline">Tabla consumos</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Tabla">
                    {loading ? (
                        <Skeleton className="h-[500]" />
                    ) : (
                        <ConsumosTable
                            currentData={currentData}
                            currentPage={currentPage}
                            endIndex={endIndex}
                            handleSort={handleSort}
                            setCurrentPage={setCurrentPage}
                            sortIcon={SortIcon}
                            sortedData={sortedData}
                            startIndex={startIndex}
                            totalPages={totalPages}
                        />
                    )}
                </TabsContent>
                <TabsContent value="Tabla consumos">
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-gray-500">
                            Próximamente...
                        </h1>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ConsumoTablaPage