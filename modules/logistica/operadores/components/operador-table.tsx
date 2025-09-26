"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Operador } from "../../bdd/operadores/types/operadores"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import OperadorDetails from "./operador-details"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import OperatorActions from "./operator-actions"

type SortField = "nombres" | "numLicencia"

interface OperadorTableProps {
    handleSort: (field: SortField) => void
    SortIcon: React.ElementType<{ field: SortField }>
    paginatedOperators: Operador[]
    getInitials: (nombres: string, apellidos: string) => string
}

const OperadorTable = ({
    paginatedOperators,
    handleSort,
    SortIcon,
    getInitials
}: OperadorTableProps) => {
    return (
        <Card className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Foto</TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => handleSort("nombres" as SortField)}
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
                                onClick={() => handleSort("numLicencia" as SortField)}
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
                                <OperatorActions 
                                    operador={operator}
                                    className="flex gap-2"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default OperadorTable