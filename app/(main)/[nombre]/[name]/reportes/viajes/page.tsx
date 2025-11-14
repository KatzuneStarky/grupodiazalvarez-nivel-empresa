"use client"

import ReporteViajesActionsSheet from "@/modules/logistica/reportes-viajes/components/reporte-viajes-actions-sheet"
import { useReporteViajesFilters } from "@/modules/logistica/reportes-viajes/hooks/use-reporte-viajes-filters"
import { exportReporteViajes } from "@/functions/excel-export/reportes-viajes/export/export-reporte-viajes"
import ReporteViajesFilters from "@/modules/logistica/reportes-viajes/components/reporte-viajes-filters"
import ReporteViajesTable from "@/modules/logistica/reportes-viajes/components/reporte-viajes-table"
import { exportCollectionToJson } from "@/functions/json-export/export-collection-to-json"
import { ReporteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes"
import { importJsonToCollection } from "@/functions/json-import/import-json-to-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { downloadJson } from "@/functions/json-export/download-json"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/global/icon"
import { toast } from "sonner"
import ReporteViajesPagination from "@/modules/logistica/reportes-viajes/components/reporte-viajes-pagination"
import { Card } from "@/components/ui/card"
import ReporteViajesCard from "@/modules/logistica/reportes-viajes/components/reporte-viajes-card"

const ReporteViajesPage = () => {
    const {
        seleccionarMunicipio,
        uniqueMunicipalities,
        setSelectedProducto,
        setSelectedCliente,
        setSelectMunicipio,
        selectedProducto,
        setSelectedYear,
        selectedCliente,
        setSelectedMes,
        uniqueProducts,
        setCurrentPage,
        uniqueClients,
        paginatedData,
        setSearchTerm,
        selectedYear,
        clearFilters,
        uniqueYears,
        selectedMes,
        currentPage,
        handleSort,
        searchTerm,
        totalPages,
        area,
    } = useReporteViajesFilters()

    const getStatusBadge = (faltantes?: string) => {
        if (!Number(faltantes)) return <Badge variant="secondary">Sin datos</Badge>
        if (Number(faltantes) > 0) return <Badge variant="destructive">Sobrante: +{faltantes}L</Badge>
        if (Number(faltantes) < 0) return <Badge variant="outline">Faltante: {faltantes}L</Badge>
        return <Badge variant="default">Exacto</Badge>
    }

    const importViajesDataJson = async (data: ReporteViajes[]) => {
        try {
            toast.promise(importJsonToCollection<ReporteViajes>(data, "reporteViajes", {
                convertDates: true,
                overwrite: true,
            }), {
                loading: "Importando datos...",
                success: "Datos importados con éxito",
                error: "Error al importar datos"
            })
        } catch (error) {

        }
    }

    const exportReportesViajesAction = async (reportes: ReporteViajes[]) => {
        try {
            toast.promise(exportReporteViajes(reportes, area?.nombre || ""), {
                loading: "Exportando reportes de viajes...",
                success: {
                    message: "Reportes de viajes exportados correctamente",
                    description: `Archivo descargado como: reporte_viajes_${area?.nombre}_${new Date().toLocaleDateString()}.xlsx`
                },
                error: "Error al exportar reportes de viajes"
            })
        } catch (error) {

        }
    }

    const exportReporteViajesDataJson = async () => {
        try {
            const viajes = await exportCollectionToJson<ReporteViajes>("reporteViajes");
            downloadJson(viajes, "Reporte viajes");

            toast.success("Datos exportados con éxito")
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    return (
        <div className="container mx-auto px-8 py-6">
            <PageTitle
                title="Reporte de Viajes"
                description="Gestión de reportes de transporte de combustible"
                icon={
                    <Icon iconName="oui:app-reporting" className="w-12 h-12 text-primary" />
                }
                hasActions={true}
                actions={
                    <>
                        <ReporteViajesActionsSheet />
                    </>
                }
            />
            <Separator className="my-4" />
            <ReporteViajesFilters
                setSelectedMunicipio={setSelectMunicipio}
                setSelectedProduct={setSelectedProducto}
                selectedMunicipio={seleccionarMunicipio}
                uniqueMunicipios={uniqueMunicipalities}
                setSelectedClient={setSelectedCliente}
                selectedProduct={selectedProducto}
                handleClearFilters={clearFilters}
                setSelectedMonth={setSelectedMes}
                setSelectedYear={setSelectedYear}
                selectedClient={selectedCliente}
                uniqueProducts={uniqueProducts}
                setSearchTerm={setSearchTerm}
                uniqueClients={uniqueClients}
                selectedMonth={selectedMes}
                selectedYear={selectedYear}
                uniqueYears={uniqueYears}
                searchTerm={searchTerm}
            />

            <Tabs defaultValue="Tabla" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1">
                    <TabsTrigger value="Tabla" className="gap-2 py-3 text-xl">
                        <Icon iconName="mdi:table-filter" className="size-8" />
                        <span className="hidden sm:inline">Vista tabla</span>
                    </TabsTrigger>
                    <TabsTrigger value="Tarjetas" className="gap-2 py-3 text-xl">
                        <Icon iconName="heroicons:square-3-stack-3d-16-solid" className="size-8" />
                        <span className="hidden sm:inline">Vista tarjeta</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Tabla">
                    <Card className="pt-4 px-6">
                        <ReporteViajesTable
                            getStatusBadge={getStatusBadge}
                            paginatedData={paginatedData}
                            handleSort={handleSort}
                            sortDirection="asc"
                            sortField="Fecha"
                        />

                        <ReporteViajesPagination
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </Card>
                </TabsContent>
                <TabsContent value="Tarjetas">
                    <Card className="pt-4 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedData.map((reporte, index) => (
                                <ReporteViajesCard
                                    getStatusBadge={getStatusBadge}
                                    report={reporte}
                                    key={index}
                                />
                            ))}
                        </div>
                        <ReporteViajesPagination
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ReporteViajesPage