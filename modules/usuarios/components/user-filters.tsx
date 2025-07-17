"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CalendarIcon, ChevronDown, Download, Filter, Search, Upload, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUsuariosFilters } from "../hooks/use-usuarios-filters"
import GenerateUserDialog from "./generate-user-dialog"
import { Calendar } from "@/components/ui/calendar"
import { type UserFilters } from "../types/user"
import { Button } from "@/components/ui/button"
import { ArrayRoles } from "@/enum/user-roles"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface EnhancedUserFiltersProps {
    filters: UserFilters
    onFiltersChange: (filters: UserFilters) => void
    onClearFilters: () => void
    onExportUsers: () => void
    onImportUsers: () => void
    onCreateUser: () => void
    totalUsers: number
    filteredUsers: number
}

const UserFilters = ({
    filters,
    onFiltersChange,
    onClearFilters,
    onExportUsers,
    onImportUsers,
    onCreateUser,
    totalUsers,
    filteredUsers,
}: EnhancedUserFiltersProps) => {
    const {
        activeFilterCount,
        hasActiveFilters,
        isAdvancedOpen,
        setIsAdvancedOpen,
        updateFilter
    } = useUsuariosFilters(filters, onFiltersChange)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Usuarios</h3>
                    <Badge variant="secondary">
                        {filteredUsers} de {totalUsers}
                    </Badge>
                    {hasActiveFilters && (
                        <Badge variant="outline">
                            {activeFilterCount} filtro{activeFilterCount !== 1 ? "s" : ""} activos
                        </Badge>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={onImportUsers} className="flex items-center gap-2 bg-transparent">
                        <Upload className="h-4 w-4" />
                        Importar
                    </Button>
                    <Button variant="outline" onClick={onExportUsers} className="flex items-center gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                    <GenerateUserDialog />
                </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar por nombre, correo electrónico o ID de empleado..."
                            value={filters.search}
                            onChange={(e) => updateFilter("search", e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={filters.estado} onValueChange={(value) => updateFilter("estado", value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="suspendido">Suspendido</SelectItem>
                            <SelectItem value="inactivo">Inactivo</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.tipoRegistro} onValueChange={(value) => updateFilter("tipoRegistro", value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Tipo de registro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            <SelectItem value="google">Google</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                    </Select>

                    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <Filter className="h-4 w-4" />
                                Avanzado
                                <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`} />
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>

                    {hasActiveFilters && (
                        <Button variant="outline" onClick={onClearFilters} className="flex items-center gap-2 bg-transparent">
                            <X className="h-4 w-4" />
                            Limpiar filtros
                        </Button>
                    )}
                </div>

                <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                    <CollapsibleContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <Select value={filters.rol} onValueChange={(value) => updateFilter("rol", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los roles</SelectItem>
                                    {ArrayRoles.map((rol) => (
                                        <SelectItem key={rol.value} value={rol.value} className="capitalize">
                                            {rol.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Departmento"
                                value={filters.departamento}
                                onChange={(e) => updateFilter("departamento", e.target.value)}
                            />

                            <Input
                                placeholder="Posicion"
                                value={filters.cargo}
                                onChange={(e) => updateFilter("cargo", e.target.value)}
                            />

                            <Input
                                placeholder="ID empresa"
                                value={filters.empresaId}
                                onChange={(e) => updateFilter("empresaId", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Created From</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.fechaCreacionDesde ? format(filters.fechaCreacionDesde, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.fechaCreacionDesde}
                                            onSelect={(date) => updateFilter("fechaCreacionDesde", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Created To</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.fechaCreacionHasta ? format(filters.fechaCreacionHasta, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.fechaCreacionHasta}
                                            onSelect={(date) => updateFilter("fechaCreacionHasta", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Access From</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.ultimoAccesoDesde ? format(filters.ultimoAccesoDesde, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.ultimoAccesoDesde}
                                            onSelect={(date) => updateFilter("ultimoAccesoDesde", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Access To</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.ultimoAccesoHasta ? format(filters.ultimoAccesoHasta, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.ultimoAccesoHasta}
                                            onSelect={(date) => updateFilter("ultimoAccesoHasta", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}

export default UserFilters