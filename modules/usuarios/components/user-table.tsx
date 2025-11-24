"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Eye, MoreHorizontal, UserX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserTableProps } from "../types/user-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemUser } from "@/types/usuario"
import { SortField } from "../types/user"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"

const UserTable = ({
    users,
    selectedUserIds,
    onSelectUser,
    onSelectAll,
    allSelected,
    someSelected,
    onViewUser,
    onEditUser,
    onSuspendUser,
    onSort,
    sortField,
    sortDirection,
}: UserTableProps) => {
    const getStatusBadge = (estado: SystemUser["estado"]) => {
        const variants = {
            activo: "default",
            pendiente: "secondary",
            suspendido: "destructive",
            inactivo: "outline",
        } as const
        const labels = {
            activo: "Activo",
            pendiente: "Pendiente",
            suspendido: "Suspendido",
            inactivo: "Inactivo",
        }
        return <Badge variant={variants[estado]}>{labels[estado]}</Badge>
    }

    const getRegistrationTypeBadge = (tipo: SystemUser["tipoRegistro"]) => {
        const labels: Record<SystemUser["tipoRegistro"], string> = {
            google: "Google",
            email: "Email",
            invitacion: "Invitación",
        }
        return <Badge variant="outline">{labels[tipo]}</Badge>
    }

    const getInitials = (nombre?: string, email?: string) => {
        if (nombre) return `${nombre[0]}`.toUpperCase()
        return email?.charAt(0).toUpperCase() || "U"
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
        return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    }

    const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <Button variant="ghost" onClick={() => onSort(field)} className="h-auto p-0 font-semibold hover:bg-transparent">
            <div className="flex items-center gap-2">
                {children}
                {getSortIcon(field)}
            </div>
        </Button>
    )

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"><Checkbox checked={allSelected} onCheckedChange={onSelectAll} /></TableHead>
                        <TableHead><SortableHeader field="nombre">Usuario</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="estado">Estado</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="tipoRegistro">Tipo de registro</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="rol">Rol</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="creadoEn">Creado</SortableHeader></TableHead>
                        <TableHead><SortableHeader field="ultimoAcceso">Último acceso</SortableHeader></TableHead>
                        <TableHead className="w-[70px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.uid} className={selectedUserIds.has(user.uid) ? "bg-muted/50" : ""}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedUserIds.has(user.uid)}
                                    onCheckedChange={(checked) => onSelectUser(user.uid, checked as boolean)}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.nombre || user.email} />
                                        <AvatarFallback>{getInitials(user.nombre, user.email)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.nombre ? `${user.nombre}` : user.email}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                        {user.empleadoId && (
                                            <p className="text-xs text-muted-foreground font-mono">{user.empleadoId}</p>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.estado)}</TableCell>
                            <TableCell>{getRegistrationTypeBadge(user.tipoRegistro)}</TableCell>
                            <TableCell>
                                {user.rol ? (
                                    <Badge variant="outline" className="text-xs">{user.rol}</Badge>
                                ) : (
                                    <span className="text-muted-foreground">No role</span>
                                )}
                            </TableCell>
                            <TableCell>{format(parseFirebaseDate(user.creadoEn), "dd MMM yyyy", { locale: es })}</TableCell>
                            <TableCell>
                                {user.ultimoAcceso ? (
                                    format(parseFirebaseDate(user.ultimoAcceso), "dd MMM yyyy", { locale: es })
                                ) : (
                                    <span className="text-muted-foreground">Never</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onViewUser(user)}>
                                            <Eye className="mr-2 h-4 w-4" />Ver detalles
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                                            <Edit className="mr-2 h-4 w-4" />Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onSuspendUser(user)} className="text-destructive">
                                            <UserX className="mr-2 h-4 w-4" />Suspender
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default UserTable