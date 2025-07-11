"use client"

import { Building2, Calendar, FileText, Filter, Globe, Mail, MapPin, Phone, Search, SortAsc, SortDesc, Trash, Users, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EstadoEmpresa } from "@/modules/administracion/enum/estado-empresa"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TipoEmpresa } from "@/modules/administracion/enum/tipo-empresa"
import { Empresa } from "@/modules/empresas/types/empresas"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import EditAreaModal from "./edit-area-modal"
import { CustomAlertDialog } from "@/components/custom/custom-alert-dialog"
import { toast } from "sonner"
import { deleteAreaByEmail } from "../actions/write"


interface CompanyAreasListProps {
    empresas: Empresa[]
    loading?: boolean
}

type SortOption = "company-name" | "area-name" | "creation-date" | "none"
type SortDirection = "asc" | "desc"

const AreasList = ({
    empresas,
    loading
}: CompanyAreasListProps) => {
    const [selectedResponsible, setSelectedResponsible] = useState<string>("all")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
    const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
    const [selectedEstado, setSelectedEstado] = useState<string>("all")
    const [selectedTipo, setSelectedTipo] = useState<string>("all")
    const [sortBy, setSortBy] = useState<SortOption>("none")
    const [searchCompany, setSearchCompany] = useState("")
    const [searchArea, setSearchArea] = useState("")

    const router = useRouter()

    const industries = useMemo(() => {
        const uniqueIndustries = new Set(empresas.map((empresa) => empresa.industria).filter(Boolean))
        return Array.from(uniqueIndustries)
    }, [empresas])

    const responsibleUsers = useMemo(() => {
        const users = new Set<string>()
        empresas.forEach((empresa) => {
            empresa.areas?.forEach((area) => {
                if (area.responsableId) {
                    users.add(area.responsableId)
                }
            })
        })
        return Array.from(users)
    }, [empresas])

    const estados = Object.values(EstadoEmpresa)
    const tipos = Object.values(TipoEmpresa)

    const filteredAndSortedEmpresas = useMemo(() => {
        const filtered = empresas.filter((empresa) => {
            const matchesCompanyName = empresa.nombre.toLowerCase().includes(searchCompany.toLowerCase())
            const matchesIndustry = selectedIndustry === "all" || empresa.industria === selectedIndustry
            const matchesEstado = selectedEstado === "all" || empresa.estado === selectedEstado
            const matchesTipo = selectedTipo === "all" || empresa.tipo === selectedTipo
            const matchesAreaName =
                !searchArea || empresa.areas?.some((area) => area.nombre.toLowerCase().includes(searchArea.toLowerCase()))
            const matchesResponsible =
                selectedResponsible === "all" || empresa.areas?.some((area) => area.responsableId === selectedResponsible)

            return (
                matchesCompanyName && matchesIndustry && matchesEstado && matchesTipo && matchesAreaName && matchesResponsible
            )
        })

        if (sortBy !== "none") {
            filtered.sort((a, b) => {
                let comparison = 0

                if (sortBy === "company-name") {
                    comparison = a.nombre.localeCompare(b.nombre)
                } else if (sortBy === "area-name") {
                    const aFirstArea = a.areas?.[0]?.nombre || ""
                    const bFirstArea = b.areas?.[0]?.nombre || ""
                    comparison = aFirstArea.localeCompare(bFirstArea)
                } else if (sortBy === "creation-date") {
                    comparison = a.fechaCreacion.getTime() - b.fechaCreacion.getTime()
                }

                return sortDirection === "desc" ? -comparison : comparison
            })
        }

        return filtered
    }, [
        empresas,
        searchCompany,
        searchArea,
        selectedIndustry,
        selectedResponsible,
        selectedEstado,
        selectedTipo,
        sortBy,
        sortDirection,
    ])

    const toggleSort = (option: SortOption) => {
        if (sortBy === option) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortBy(option)
            setSortDirection("asc")
        }
    }

    const clearFilters = () => {
        setSearchCompany("")
        setSearchArea("")
        setSelectedIndustry("all")
        setSelectedResponsible("all")
        setSelectedEstado("all")
        setSelectedTipo("all")
        setSortBy("none")
    }

    const getEstadoBadgeVariant = (estado: EstadoEmpresa) => {
        switch (estado) {
            case EstadoEmpresa.Activa:
                return "default"
            case EstadoEmpresa.Cerrada:
                return "secondary"
            case EstadoEmpresa.Suspendida:
                return "destructive"
            default:
                return "outline"
        }
    }

    const deleteArea = async (empresaId: string, email: string) => {
        try {
            toast.promise(
                deleteAreaByEmail(empresaId, email), {
                loading: "Eliminando el area, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return `Area eliminada satisfactoriamente.`;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al eliminar el area.";
                },
            })

            router.refresh()
        } catch (error) {

        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10" />
                    ))}
                </div>
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-8 w-3/4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Skeleton className="h-24" />
                                        <Skeleton className="h-24" />
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
                                {[...Array(3)].map((_, j) => (
                                    <Card key={j}>
                                        <CardHeader>
                                            <Skeleton className="h-6 w-2/3" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-16" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros y Búsqueda
                        </div>

                        <Button onClick={() => router.push("/administracion/areas/nuevo")}>
                            <Building2 />
                            Crear nueva area
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar empresa</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nombre de empresa..."
                                    value={searchCompany}
                                    onChange={(e) => setSearchCompany(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar área</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nombre de área..."
                                    value={searchArea}
                                    onChange={(e) => setSearchArea(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Industria</label>
                            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las industrias</SelectItem>
                                    {industries.map((industry) => (
                                        <SelectItem key={industry} value={industry || ""}>
                                            {industry}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    {estados.map((estado) => (
                                        <SelectItem key={estado} value={estado} className="capitalize">
                                            {estado}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo</label>
                            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    {tipos.map((tipo) => (
                                        <SelectItem key={tipo} value={tipo} className="capitalize">
                                            {tipo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Responsable</label>
                            <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {responsibleUsers.map((user) => (
                                        <SelectItem key={user} value={user} className="capitalize">
                                            {user}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSort("company-name")}
                            className="flex items-center gap-1"
                        >
                            Ordenar por empresa
                            {sortBy === "company-name" &&
                                (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSort("area-name")}
                            className="flex items-center gap-1"
                        >
                            Ordenar por área
                            {sortBy === "area-name" &&
                                (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSort("creation-date")}
                            className="flex items-center gap-1"
                        >
                            Ordenar por fecha
                            {sortBy === "creation-date" &&
                                (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                        </Button>

                        <Button variant="destructive" size="sm" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Limpiar filtros
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-8">
                {filteredAndSortedEmpresas.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No se encontraron empresas</h3>
                            <p className="text-muted-foreground text-center">
                                No hay empresas que coincidan con los filtros seleccionados.
                            </p>
                            <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                                Limpiar filtros
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredAndSortedEmpresas.map((empresa) => {
                        const fechaDeCreacion
                            = empresa.fechaCreacion instanceof Timestamp
                                ? empresa.fechaCreacion.toDate()
                                : new Date(empresa.fechaCreacion || new Date());

                        const fechaActualizacion = new Date(empresa.fechaActualizacion)

                        const fechaDeCierre
                            = empresa.fechaCierre instanceof Timestamp
                                ? empresa.fechaCierre.toDate()
                                : new Date(empresa.fechaCierre || new Date());

                        return (
                            <div key={empresa.id} className="space-y-4">
                                <Card className="border-2">
                                    <CardHeader>
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={empresa.logoUrl || "/placeholder.svg"} alt={empresa.nombre} />
                                                    <AvatarFallback className="text-lg">
                                                        {empresa.nombre.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <CardTitle className="text-2xl">{empresa.nombre}</CardTitle>
                                                        <Badge variant={getEstadoBadgeVariant(empresa.estado)}>{empresa.estado}</Badge>
                                                        {empresa.tipo && <Badge variant="outline">{empresa.tipo}</Badge>}
                                                    </div>

                                                    {empresa.razonSocial && empresa.razonSocial !== empresa.nombre && (
                                                        <p className="text-muted-foreground mb-2">{empresa.razonSocial}</p>
                                                    )}

                                                    {empresa.descripcion && (
                                                        <p className="text-sm text-muted-foreground mb-3">{empresa.descripcion}</p>
                                                    )}

                                                    <div className="flex flex-wrap gap-2">
                                                        {empresa.industria && <Badge variant="secondary">{empresa.industria}</Badge>}
                                                        {empresa.numeroEmpleados && (
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {empresa.numeroEmpleados} empleados
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline">{empresa.areas?.length || 0} áreas</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Contact Information */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                                    Información de Contacto
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <a href={`mailto:${empresa.email}`} className="text-primary hover:underline">
                                                            {empresa.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <a href={`tel:${empresa.telefono}`} className="hover:text-primary">
                                                            {empresa.telefono}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <span>{empresa.direccion}</span>
                                                    </div>
                                                    {empresa.direccionWeb && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                                            <a
                                                                href={
                                                                    empresa.direccionWeb.startsWith("http")
                                                                        ? empresa.direccionWeb
                                                                        : `https://${empresa.direccionWeb}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline"
                                                            >
                                                                {empresa.direccionWeb}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Legal Information */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                                    Información Legal
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-mono">{empresa.rfc}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>Creada: {format(fechaDeCreacion, "dd/mm/yyyy", { locale: es })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>Actualizada: {format(fechaActualizacion, "dd/mm/yyyy", { locale: es })}</span>
                                                    </div>
                                                    {empresa.fechaCierre && (
                                                        <div className="flex items-center gap-2 text-sm text-destructive">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Cerrada: {format(fechaDeCierre, "dd/mm/yyyy", { locale: es })}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                                    Configuración
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${empresa.configuraciones.notificacionesEmail ? "bg-green-500" : "bg-gray-300"}`}
                                                        />
                                                        <span>Notificaciones por email</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${empresa.configuraciones.reportesAutomaticos ? "bg-green-500" : "bg-gray-300"}`}
                                                        />
                                                        <span>Reportes automáticos</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${empresa.configuraciones.accesoPublico ? "bg-green-500" : "bg-gray-300"}`}
                                                        />
                                                        <span>Acceso público</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {empresa.areas && empresa.areas.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <div className="h-px bg-border flex-1" />
                                            <span className="px-3 bg-background">Áreas ({empresa.areas.length})</span>
                                            <div className="h-px bg-border flex-1" />
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {empresa.areas
                                                .filter((area) => !searchArea || area.nombre.toLowerCase().includes(searchArea.toLowerCase()))
                                                .filter(
                                                    (area) => selectedResponsible === "all" || area.responsableId === selectedResponsible,
                                                )
                                                .map((area, index) => (
                                                    <Card key={index} className="border-l-4 border-l-primary">
                                                        <CardHeader className="pb-3">
                                                            <CardTitle className="text-lg flex items-center gap-2">
                                                                <Building2 className="h-4 w-4" />
                                                                {area.nombre}
                                                            </CardTitle>
                                                            {area.descripcion && <p className="text-sm text-muted-foreground">{area.descripcion}</p>}
                                                        </CardHeader>

                                                        <CardContent className="space-y-4 flex-1">
                                                            {area.correoContacto && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                                    <a href={`mailto:${area.correoContacto}`} className="text-primary hover:underline">
                                                                        {area.correoContacto}
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {
                                                                /**
                                                                 * {area.responsableId && (
                                                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarImage src={area.responsable.avatar || "/placeholder.svg"} />
                                                                            <AvatarFallback className="text-xs">
                                                                                {area.responsable.nombre.substring(0, 2).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-medium">{area.responsable.nombre}</p>
                                                                            <p className="text-xs text-muted-foreground">Responsable</p>
                                                                            <a
                                                                                href={`mailto:${area.responsable.email}`}
                                                                                className="text-xs text-primary hover:underline"
                                                                            >
                                                                                {area.responsable.email}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
        
                                                                {area.usuarios && area.usuarios.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        <h5 className="text-sm font-medium flex items-center gap-1">
                                                                            <Users className="h-4 w-4" />
                                                                            Equipo ({area.usuarios.length})
                                                                        </h5>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {area.usuarios.slice(0, 5).map((usuario) => (
                                                                                <Avatar key={usuario.id} className="h-6 w-6">
                                                                                    <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                                                                                    <AvatarFallback className="text-xs">
                                                                                        {usuario.nombre.substring(0, 2).toUpperCase()}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                            ))}
                                                                            {area.usuarios.length > 5 && (
                                                                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                                                    <span className="text-xs">+{area.usuarios.length - 5}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                 */
                                                            }
                                                        </CardContent>

                                                        <CardFooter className="flex items-center justify-end gap-2">
                                                            <EditAreaModal area={area} empresaId={empresa.id} />

                                                            <CustomAlertDialog
                                                                action={() => deleteArea(empresa.id, area.correoContacto || "")}
                                                                description="¿Estás seguro de querer eliminar esta area?"
                                                                title="Eliminar area"
                                                            >
                                                                <Button variant={"destructive"}>
                                                                    <Trash className="w-4 h-4 mr-2" />
                                                                    Eliminar
                                                                </Button>
                                                            </CustomAlertDialog>
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {(!empresa.areas || empresa.areas.length === 0) && (
                                    <div>
                                        <Card className="border-dashed">
                                            <CardContent className="flex flex-col items-center justify-center py-8">
                                                <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-muted-foreground text-center">Esta empresa no tiene áreas registradas.</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <Card>
                <CardContent className="py-4">
                    <div className="text-sm text-muted-foreground text-center">
                        Mostrando <span className="font-medium">{filteredAndSortedEmpresas.length}</span> de{" "}
                        <span className="font-medium">{empresas.length}</span> empresas
                        {filteredAndSortedEmpresas.length > 0 && (
                            <>
                                {" "}
                                con un total de{" "}
                                <span className="font-medium">
                                    {filteredAndSortedEmpresas.reduce((acc, empresa) => acc + (empresa.areas?.length || 0), 0)}
                                </span>{" "}
                                áreas
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AreasList