"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SortField, useEquiposFilter } from "@/modules/logistica/equipos/hooks/use-equipos-filter"
import { exportCollectionToJson } from "@/functions/json-export/export-collection-to-json"
import { exportEquipos } from "@/functions/excel-export/equipos/export/export-equipos"
import NoEquiposFilter from "@/modules/logistica/equipos/components/no-equipos-filter"
import { Filter, Import, Plus, Search, SortAsc, SortDesc, Truck } from "lucide-react"
import { importJsonToCollection } from "@/functions/json-import/import-json-to-data"
import { EstadoEquipos } from "@/modules/logistica/bdd/equipos/enum/estado-equipos"
import EquiposGrid from "@/modules/logistica/equipos/components/equipos-grid"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { downloadJson } from "@/functions/json-export/download-json"
import ImportDialog from "@/components/global/import-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useDirectLink } from "@/hooks/use-direct-link"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { IconFileExport } from "@tabler/icons-react"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const RegistroEquiposPage = () => {
    const { directLink } = useDirectLink("equipos")
    const { area } = useArea()
    const router = useRouter()

    const {
        clearFilters,
        equipos,
        estadoFilter,
        getEstadoBadgeVariant,
        grupoUnidadFilter,
        handleCardClick,
        marcaFilter,
        modeloFilter,
        searchTerm,
        selectedEquipo,
        setEstadoFilter,
        setGrupoUnidadFilter,
        setMarcaFilter,
        setModeloFilter,
        setSearchTerm,
        setTipoUnidadFilter,
        sortField,
        sortOrder,
        tipoUnidadFilter,
        toggleSort,
        uniqueGruposUnidad,
        uniqueMarcas,
        uniqueModelos,
        uniqueTiposUnidad,
        isLoading,
        filteredAndSortedEquipos,
        openDialog,
        setSelectedEquipo
    } = useEquiposFilter()

    const totalEquipos = equipos.length
    const activeEquipos = equipos.filter((e) => e.estado === EstadoEquipos.DISPONIBLE).length
    const inMaintenanceEquipos = equipos.filter((e) => e.estado === EstadoEquipos.EN_TALLER).length
    const inavtiveEquipos = equipos.filter((e) => e.estado === EstadoEquipos.FUERA_DE_SERVICIO).length

    const importEquiposDataJson = async (data: Equipo[]) => {
        try {
            toast.promise(importJsonToCollection<Equipo>(data, "equipos", {
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

    const exportEquiposData = async () => {
        try {
            toast.promise(exportEquipos(equipos, area?.nombre || ""), {
                loading: "Exportando datos...",
                success: "Datos exportados con éxito",
                error: "Error al exportar datos"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    const exportEquiposDataJson = async () => {
        try {
            const equipos = await exportCollectionToJson<Equipo>("equipos");
            downloadJson(equipos, "Parque vehicular");

            toast.success("Datos exportados con éxito")
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar datos")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <PageTitle
                        icon={<Truck className="h-12 w-12 text-primary" />}
                        title="Parque vehicular"
                        description="Administración y gestion de vehículos"
                        hasActions={true}
                        actions={
                            <>
                                <ImportDialog<Equipo>
                                    onImport={importEquiposDataJson}
                                    title="Import Users"
                                    triggerLabel="Import Users"
                                />
                                <Button className="sm:w-auto" onClick={() => exportEquiposData()}>
                                    <IconFileExport className="w-4 h-4 mr-2" />
                                    Exportar Datos
                                </Button>
                                <Button className="sm:w-auto" onClick={() => exportEquiposDataJson()}>
                                    <Icon iconName="si:json-fill" className="w-4 h-4 mr-2" />
                                    Exportar Json
                                </Button>
                                <Button
                                    className="sm:w-auto"
                                    onClick={() => router.push(`${directLink}/registros/nuevo`)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Registrar Vehículo
                                </Button>
                            </>
                        }
                    />

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{totalEquipos}</div>
                            <div className="text-blue-100">Flota total</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{activeEquipos}</div>
                            <div className="text-green-100">Unidades disponibles</div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{inMaintenanceEquipos}</div>
                            <div className="text-yellow-100">En mantenimiento</div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                            <div className="text-2xl font-bold">{inavtiveEquipos}</div>
                            <div className="text-red-100">Unidades no disponibles</div>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Buscar por número económico, marca, modelo o placas..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-card border-border"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="shrink-0 border-border hover:bg-accent/10 bg-transparent"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Limpiar filtros
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                <Select value={marcaFilter} onValueChange={setMarcaFilter}>
                                    <SelectTrigger className="bg-card border-border w-full">
                                        <SelectValue placeholder="Marca" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="all">Todas las marcas</SelectItem>
                                        {uniqueMarcas.map((marca) => (
                                            <SelectItem key={marca} value={marca}>
                                                {marca}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={modeloFilter} onValueChange={setModeloFilter}>
                                    <SelectTrigger className="bg-card border-border w-full">
                                        <SelectValue placeholder="Modelo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="all">Todos los modelos</SelectItem>
                                        {uniqueModelos.map((modelo) => (
                                            <SelectItem key={modelo} value={modelo}>
                                                {modelo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={tipoUnidadFilter} onValueChange={setTipoUnidadFilter}>
                                    <SelectTrigger className="bg-card border-border w-full">
                                        <SelectValue placeholder="Tipo de unidad" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="all">Todos los tipos</SelectItem>
                                        {uniqueTiposUnidad.map((tipo) => (
                                            <SelectItem key={tipo} value={tipo || ""}>
                                                {tipo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={grupoUnidadFilter} onValueChange={setGrupoUnidadFilter}>
                                    <SelectTrigger className="bg-card border-border w-full">
                                        <SelectValue placeholder="Grupo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="all">Todos los grupos</SelectItem>
                                        {uniqueGruposUnidad.map((grupo) => (
                                            <SelectItem key={grupo} value={grupo}>
                                                {grupo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                                    <SelectTrigger className="bg-card border-border w-full">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        {Object.values(EstadoEquipos).map((estado) => (
                                            <SelectItem key={estado} value={estado}>
                                                {estado}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-sm text-muted-foreground">Ordenar por:</span>
                                {(
                                    [
                                        ["numEconomico", "Número"],
                                        ["year", "Año"],
                                        ["marca", "Marca"],
                                        ["modelo", "Modelo"],
                                    ] as [SortField, string][]
                                ).map(([field, label]) => (
                                    <Button
                                        key={field}
                                        variant={sortField === field ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleSort(field)}
                                        className={`text-xs ${sortField === field ? "bg-primary text-primary-foreground" : "border-border hover:bg-accent/10"}`}
                                    >
                                        {label}
                                        {sortField === field &&
                                            (sortOrder === "asc" ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <EquiposGrid
                    equipos={filteredAndSortedEquipos}
                    loading={isLoading}
                    handleCardClick={handleCardClick}
                    selectedEquipo={selectedEquipo}
                    setSelectedEquipo={setSelectedEquipo}
                    getEstadoBadgeVariant={getEstadoBadgeVariant}
                    url={directLink}
                />

                <NoEquiposFilter
                    clearFilters={clearFilters}
                    filteredAndSortedEquipos={filteredAndSortedEquipos}
                />
            </div>
        </div>
    )
}

export default RegistroEquiposPage