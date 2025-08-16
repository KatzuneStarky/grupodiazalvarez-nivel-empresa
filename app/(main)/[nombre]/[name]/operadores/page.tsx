"use client"

import { Calendar, ChevronDown, ChevronUp, CreditCard, Edit, Mail, MapPin, MoreHorizontal, Phone, Search, Shield, Trash2, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useOperadores } from "@/modules/logistica/bdd/operadores/hooks/use-estaciones"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/utils/format-file-date"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SortField = "nombres" | "numLicencia"
type SortOrder = "asc" | "desc"

const OperadoresPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState<SortField>("nombres")
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const { operadores, isLoading, error } = useOperadores()

    const filteredAndSortedOperators = useMemo(() => {
        const filtered = operadores.filter((operator) => {
            const fullName = `${operator.nombres} ${operator.apellidos}`.toLowerCase()
            const search = searchTerm.toLowerCase()
            return fullName.includes(search) || operator.numLicencia.toLowerCase().includes(search)
        })

        filtered.sort((a, b) => {
            const aValue = sortField === "nombres" ? `${a.nombres} ${a.apellidos}` : a[sortField]
            const bValue = sortField === "nombres" ? `${b.nombres} ${b.apellidos}` : b[sortField]

            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue)
            } else {
                return bValue.localeCompare(aValue)
            }
        })

        return filtered
    }, [searchTerm, sortField, sortOrder])

    const paginatedOperators = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredAndSortedOperators.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredAndSortedOperators, currentPage])

    const getInitials = (nombres: string, apellidos: string) => {
        return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null
        return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    }

    const totalPages = Math.ceil(filteredAndSortedOperators.length / itemsPerPage)

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Operadores</h1>
                    <p className="text-muted-foreground">Administra los operadores de transporte de combustible</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o número de licencia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOperators.map((operator) => (
                    <Card
                        key={operator.id}
                        className="transition-all duration-300 border-0 shadow-md hover:shadow-xl"
                    >
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                            <div className="flex items-start space-x-4">
                                <div className="relative">
                                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                                        <AvatarImage
                                            src={operator.image || "/placeholder.svg"}
                                            alt={`${operator.nombres} ${operator.apellidos}`}
                                        />
                                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                            {getInitials(operator.nombres, operator.apellidos)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                        <Shield className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">{operator.nombres}</CardTitle>
                                    <CardTitle className="text-lg font-semibold text-gray-700 mb-2">{operator.apellidos}</CardTitle>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="truncate">{operator.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                                        <span>{operator.telefono}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">Licencia</span>
                                    </div>
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        {operator.numLicencia}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Tipo:</span>
                                    <Badge variant="outline" className="text-xs">
                                        {operator.tipoLicencia}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Emisor:</span>
                                    <span className="text-xs font-medium text-gray-700">{operator.emisor}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">Información Personal</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="bg-white border rounded-lg p-2">
                                        <div className="text-gray-500 mb-1">NSS</div>
                                        <div className="font-mono font-medium text-gray-800">{operator.nss}</div>
                                    </div>
                                    <div className="bg-white border rounded-lg p-2">
                                        <div className="text-gray-500 mb-1">Tipo de Sangre</div>
                                        <Badge variant="destructive" className="text-xs font-bold">
                                            {operator.tipoSangre}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                    <span className="text-sm font-medium text-gray-700">Dirección</span>
                                </div>
                                <div className="bg-white border rounded-lg p-3">
                                    <div className="text-sm text-gray-800 font-medium mb-1">
                                        {operator.calle} #{operator.externo}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {operator.colonia} • CP {operator.cp}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Actualizado: {formatDate(operator.updatedAt)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {/**
                                 * <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Ver Detalles
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Detalles del Operador</DialogTitle>
                                        </DialogHeader>
                                        <OperatorDetails operator={operator} />
                                    </DialogContent>
                                </Dialog>
                                 */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="bg-gray-50 border-gray-200 hover:bg-gray-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
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
                ))}
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Foto</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("nombres")}
                                    className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                    Nombre Completo
                                    <SortIcon field="nombres" />
                                </Button>
                            </TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("numLicencia")}
                                    className="h-auto p-0 font-semibold hover:bg-transparent"
                                >
                                    Licencia
                                    <SortIcon field="numLicencia" />
                                </Button>
                            </TableHead>
                            <TableHead>Tipo Licencia</TableHead>
                            <TableHead>Tipo Sangre</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedOperators.map((operator) => (
                            <TableRow key={operator.id}>
                                <TableCell>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={operator.image || "/placeholder.svg"}
                                            alt={`${operator.nombres} ${operator.apellidos}`}
                                        />
                                        <AvatarFallback>{getInitials(operator.nombres, operator.apellidos)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {operator.nombres} {operator.apellidos}
                                </TableCell>
                                <TableCell>{operator.telefono}</TableCell>
                                <TableCell>{operator.email}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{operator.numLicencia}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{operator.tipoLicencia}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="destructive">{operator.tipoSangre}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {/**
                                         * <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Detalles del Operador</DialogTitle>
                                                </DialogHeader>
                                                <OperatorDetails operator={operator} />
                                            </DialogContent>
                                        </Dialog>
                                         */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    )
}

export default OperadoresPage