"use client"

import { Calendar, ChevronDown, ChevronUp, Download, Edit, Eye, Filter, Fuel, Grid3X3, MapPin, MoreHorizontal, Search, Table, Trash2, Truck, Upload, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { exportReporteViajes } from "@/functions/excel-export/reportes-viajes/export/export-reporte-viajes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UploadViajesDialog from "@/modules/logistica/reportes-viajes/components/upload-viajes-dialog"
import { useReporteViajes } from "@/modules/logistica/reportes-viajes/hooks/use-reporte-viajes"
import { ReporteViajes } from "@/modules/logistica/reportes-viajes/types/reporte-viajes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { formatNumber } from "@/utils/format-number"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { toast } from "sonner"

export type SortField = "Fecha" | "Cliente" | "LitrosA20" | "Flete"
export type SortDirection = "asc" | "desc"
export type ViewMode = "table" | "card"
const ITEMS_PER_PAGE = 10

const ReporteViajesPage = () => {
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>("all")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [selectedProduct, setSelectedProduct] = useState<string>("all")
    const [selectedClient, setSelectedClient] = useState<string>("all")
    const [selectedMonth, setSelectedMonth] = useState<string>("all")
    const [selectedYear, setSelectedYear] = useState<string>("all")
    const [sortField, setSortField] = useState<SortField>("Fecha")
    const [viewMode, setViewMode] = useState<ViewMode>("table")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string>("")

    const { reporteViajes } = useReporteViajes()
    const { area } = useArea()

    const uniqueMonths
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Mes))].sort(), [reporteViajes])
    const uniqueYears
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Year?.toString()))].filter(Boolean).sort(), [reporteViajes])
    const uniqueProducts
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Producto))].sort(), [reporteViajes])
    const uniqueClients
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Cliente))].sort(), [reporteViajes])
    const uniqueMunicipalities
        = useMemo(() => [...new Set(reporteViajes.map((report) => report.Municipio))].sort(), [reporteViajes])

    const filteredAndSortedData = useMemo(() => {
        const filtered = reporteViajes.filter((report) => {
            const matchesSearch =
                !searchTerm ||
                report.Cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.Producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.Operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.Municipio.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesMonth = selectedMonth === "all" || report.Mes === selectedMonth
            const matchesYear = selectedYear === "all" || report.Year?.toString() === selectedYear
            const matchesProduct = selectedProduct === "all" || report.Producto === selectedProduct
            const matchesClient = selectedClient === "all" || report.Cliente === selectedClient
            const matchesMunicipality = selectedMunicipality === "all" || report.Municipio === selectedMunicipality

            return matchesSearch && matchesMonth && matchesYear && matchesProduct && matchesClient && matchesMunicipality
        })

        filtered.sort((a, b) => {
            let aValue: any = a[sortField]
            let bValue: any = b[sortField]

            if (sortField === "Fecha") {
                aValue = new Date(aValue).getTime()
                bValue = new Date(bValue).getTime()
            } else if (typeof aValue === "string") {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (sortDirection === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return filtered
    }, [
        searchTerm,
        selectedMonth,
        selectedYear,
        selectedProduct,
        selectedClient,
        selectedMunicipality,
        sortField,
        sortDirection,
        reporteViajes
    ])

    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedMonth("all")
        setSelectedYear("all")
        setSelectedProduct("all")
        setSelectedClient("all")
        setSelectedMunicipality("all")
        setCurrentPage(1)
    }

    const getStatusBadge = (faltantes?: string) => {
        if (!Number(faltantes)) return <Badge variant="secondary">Sin datos</Badge>
        if (Number(faltantes) > 0) return <Badge variant="destructive">Sobrante: +{faltantes}L</Badge>
        if (Number(faltantes) < 0) return <Badge variant="outline">Faltante: {faltantes}L</Badge>
        return <Badge variant="default">Exacto</Badge>
    }

    const groupedData = useMemo(() => {
        const groups: { [key: string]: ReporteViajes[] } = {}
        filteredAndSortedData.forEach((report) => {
            const key = `${report.Mes} ${report.Year}`
            if (!groups[key]) groups[key] = []
            groups[key].push(report)
        })
        return groups
    }, [filteredAndSortedData, reporteViajes])

    const exportReportesViajesAction = async(reportes: ReporteViajes[]) => {
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

    return (
        <div className="space-y-6 p-6 container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Reportes de Viajes</h1>
                    <p className="text-muted-foreground">Gestión de reportes de transporte de combustible</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
                        <Table className="h-4 w-4 mr-2" />
                        Tabla
                    </Button>
                    <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Tarjetas
                    </Button>
                    <UploadViajesDialog />
                    <Button variant="outline" size="sm" onClick={() => exportReportesViajesAction(reporteViajes)}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar CSV
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros y Búsqueda
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente, producto, operador o municipio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los meses</SelectItem>
                                {uniqueMonths.map((month) => (
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

                        <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Municipio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los municipios</SelectItem>
                                {uniqueMunicipalities.map((municipality) => (
                                    <SelectItem key={municipality} value={municipality}>
                                        {municipality}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex justify-between items-center">
                            <Button variant="outline" onClick={clearFilters}>
                                Limpiar filtros
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                {filteredAndSortedData.length} de {reporteViajes.length} reportes
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {viewMode === "table" ? (
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        <div>
                            <TableComponent className="overflow-hidden">
                                <TableHeader className="sticky top-0 bg-background">
                                    <TableRow>
                                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("Cliente")}>
                                            <div className="flex items-center gap-2">
                                                Cliente
                                                {sortField === "Cliente" &&
                                                    (sortDirection === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ))}
                                            </div>
                                        </TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Equipo</TableHead>
                                        <TableHead>Operador</TableHead>
                                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("Fecha")}>
                                            <div className="flex items-center gap-2">
                                                Fecha
                                                {sortField === "Fecha" &&
                                                    (sortDirection === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ))}
                                            </div>
                                        </TableHead>
                                        <TableHead>Municipio</TableHead>
                                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("LitrosA20")}>
                                            <div className="flex items-center gap-2">
                                                Litros A20
                                                {sortField === "LitrosA20" &&
                                                    (sortDirection === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ))}
                                            </div>
                                        </TableHead>
                                        <TableHead>Litros Descargados</TableHead>
                                        <TableHead>M3</TableHead>
                                        <TableHead>Temp °C</TableHead>
                                        <TableHead>Incremento %</TableHead>
                                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("Flete")}>
                                            <div className="flex items-center gap-2">
                                                Flete
                                                {sortField === "Flete" &&
                                                    (sortDirection === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ))}
                                            </div>
                                        </TableHead>
                                        <TableHead>Factura Pemex</TableHead>
                                        <TableHead>Estado A20</TableHead>
                                        <TableHead>Estado Natural</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length >= 1 ? paginatedData.map((report, index) => {
                                        const fecha
                                            = report?.Fecha instanceof Timestamp
                                                ? report?.Fecha.toDate()
                                                : new Date(report?.Fecha || new Date());

                                        return (
                                            <TableRow key={report.id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                                                <TableCell className="font-medium">{report.Cliente}</TableCell>
                                                <TableCell>{report.Producto}</TableCell>
                                                <TableCell>{report.Equipo}</TableCell>
                                                <TableCell>{report.Operador}</TableCell>
                                                <TableCell>{format(fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                                                <TableCell>{report.Municipio}</TableCell>
                                                <TableCell>{report.LitrosA20?.toLocaleString()}</TableCell>
                                                <TableCell>{report.LitrosDescargadosEstaciones?.toLocaleString()}</TableCell>
                                                <TableCell>{report.M3}</TableCell>
                                                <TableCell>{report.Temp}°</TableCell>
                                                <TableCell>{report.Incremento}%</TableCell>
                                                <TableCell>${report.Flete?.toLocaleString()}</TableCell>
                                                <TableCell>{report.FacturaPemex}</TableCell>
                                                <TableCell>{getStatusBadge(formatNumber(report.FALTANTESYOSOBRANTESA20 || 0))}</TableCell>
                                                <TableCell>{getStatusBadge(formatNumber(report.FALTANTESYOSOBRANTESALNATURAL || 0))}</TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver detalles
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : (
                                        <TableRow className="">
                                            <TableCell colSpan={16} className="text-center text-2xl p-14">
                                                <Truck className="h-6 w-6 inline-block mr-2" />
                                                No hay viajes disponibles
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </TableComponent>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 p-4 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedData).map(([period, reports]) => {
                        return (
                            <div key={period}>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    {period}
                                    <Badge variant="secondary">{reports.length} viajes</Badge>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {reports.map((report) => {
                                        const fecha = parseFirebaseDate(report.Fecha)

                                        return (
                                            <Card key={report.id} className="hover:shadow-lg transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-lg">{report.Cliente}</CardTitle>
                                                        {getStatusBadge(Number(report.FALTANTESYOSOBRANTESA20 ?? 0).toFixed(2).toString())}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {format(fecha, "dd/MM/yyyy", { locale: es })}
                                                    </p>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Fuel className="h-4 w-4 text-muted-foreground" />
                                                            <span>{report.Producto}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Truck className="h-4 w-4 text-muted-foreground" />
                                                            <span>{report.Equipo}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <span>{report.Operador}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                                            <span>{report.Municipio}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-center text-sm bg-muted/30 p-2 rounded">
                                                        <div>
                                                            <p className="font-semibold">{report.LitrosA20?.toLocaleString()}</p>
                                                            <p className="text-muted-foreground text-xs">Litros A20</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{report.LitrosDescargadosEstaciones?.toLocaleString()}</p>
                                                            <p className="text-muted-foreground text-xs">Descargados</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{report.M3}</p>
                                                            <p className="text-muted-foreground text-xs">M3</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">${report.Flete?.toLocaleString()}</p>
                                                            <p className="text-muted-foreground text-xs">Flete</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                                        <div>
                                                            <p className="font-semibold">{report.Temp}°C</p>
                                                            <p className="text-muted-foreground">Temperatura</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{report.Incremento}%</p>
                                                            <p className="text-muted-foreground">Incremento</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">#{report.FacturaPemex}</p>
                                                            <p className="text-muted-foreground">Factura</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-muted-foreground">Estado A20:</span>
                                                            {getStatusBadge(Number(report.FALTANTESYOSOBRANTESA20 ?? 0).toFixed(2).toString())}
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-muted-foreground">Estado Natural:</span>
                                                            {getStatusBadge(Number(report.FALTANTESYOSOBRANTESALNATURAL ?? 0).toFixed(2).toString())}
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-2">{report.DescripcionDelViaje}</p>

                                                    <div className="flex justify-end items-center pt-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Ver detalles
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive">
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ReporteViajesPage