"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, Filter, Mail, MoreHorizontal, Phone, Search } from "lucide-react"
import { exportUsers } from "@/functions/excel-export/user/export/export-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"
import { RolUsuario } from "@/enum/user-roles"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SystemUser } from "@/types/usuario"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"
import { useArea } from "@/context/area-context"

interface UserManagementProps {
    areaId: string
    empresaId: string
    users: SystemUser[]
    loading: boolean
}

const UserManagement = ({
    areaId,
    empresaId,
    users,
    loading
}: UserManagementProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [roleFilter, setRoleFilter] = useState("all")

    const { area } = useArea()

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const filterUsers = (users: SystemUser[]): SystemUser[] => {
        return users.filter((user) => {
            const matchesSearch =
                user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = roleFilter === "all" || user.rol === roleFilter
            const matchesStatus = statusFilter === "all" || user.estado === statusFilter
            return matchesSearch && matchesRole && matchesStatus
        })
    }

    const filteredUsers = filterUsers(users)
    const roles = users.filter((usuario) => usuario.rol && usuario.rol.length > 0)
    const rolesUnicos = roles.map((usuario) => usuario.rol).flat()
        .filter((role, index, self) => self.indexOf(role) === index)

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Cargando usuarios...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const exportDataUsuarios = (usuarios: SystemUser[]) => {
        try {
            toast.promise(exportUsers(usuarios, area?.nombre || ""), {
                loading: "Exportando usuarios...",
                success: "Usuarios exportados con éxito",
                error: "Error al exportar usuarios"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al exportar usuarios t", {
                description: `${error}`
            })
        }
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div>
                        <CardTitle className="text-xl">Gestión de usuarios</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Administra usuarios y sus roles en esta área</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => exportDataUsuarios(users)}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar usuarios
                        </Button>

                        <Button variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Invitar Usuario
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Busca usuarios mediante su email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-52">
                                <SelectValue placeholder="Rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                {rolesUnicos.map((role) => (
                                    <SelectItem key={role} value={role as string}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-52">
                                <SelectValue placeholder="Estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="suspendido">Suspendido</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">Usuario</TableHead>
                                <TableHead className="font-semibold">Contacto</TableHead>
                                <TableHead className="font-semibold">Rol</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                                <TableHead className="font-semibold">Ultimo acceso</TableHead>
                                <TableHead className="font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Search className="h-12 w-12 text-muted-foreground/50" />
                                            <div>
                                                <p className="text-muted-foreground font-medium">No se encontraron usuarios</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                                                        ? "Intenta ajustar los filtros"
                                                        : "No hay usuarios en esta area"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => {
                                    const lastSessionDate = user.ultimoAcceso instanceof Timestamp
                                        ? user.ultimoAcceso.toDate()
                                        : new Date(user.ultimoAcceso || new Date());

                                    return (
                                        <TableRow key={user.uid} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
                                                        <AvatarFallback className="text-sm font-medium">{getInitials(user.nombre || "")}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.nombre}</p>
                                                        <p className="text-sm text-muted-foreground">ID: {user.uid}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        <span></span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select value={user.rol}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rolesUnicos.map((role) => (
                                                            <SelectItem key={role} value={role as RolUsuario}>
                                                                {role}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.estado === "activo" ? "default" : "secondary"}
                                                    className={user.estado === "activo" ? "bg-green-100 text-green-800" : ""}
                                                >
                                                    {user.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{format(lastSessionDate, "PPP", { locale: es })}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                                                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                                                        <DropdownMenuItem>Reiniciar contraseña</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Desactivar usuario</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserManagement