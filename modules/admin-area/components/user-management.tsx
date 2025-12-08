"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Check, ChevronsUpDown, Download, Filter, Mail, MoreHorizontal, Phone, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { exportUsers } from "@/functions/excel-export/user/export/export-users"
import InviteUserDialog from "./invite-user-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrayRoles, RolUsuario } from "@/enum/user-roles"
import { doc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SystemUser } from "@/types/usuario"
import { db } from "@/firebase/client"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
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
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [openRoleFilterPopover, setOpenRoleFilterPopover] = useState(false)
    const [openRolePopover, setOpenRolePopover] = useState<string | null>(null)
    const [openStatusPopover, setOpenStatusPopover] = useState<string | null>(null)
    const [updatingUser, setUpdatingUser] = useState<string | null>(null)

    const { area } = useArea()

    const updateUserRole = async (userId: string, newRole: RolUsuario) => {
        setUpdatingUser(userId)
        try {
            const userRef = doc(db, "usuarios", userId)
            await updateDoc(userRef, {
                rol: newRole,
                actualizadoEn: new Date().toISOString()
            })
            toast.success("Rol actualizado", {
                description: `El rol del usuario ha sido actualizado a ${newRole}`
            })
        } catch (error) {
            console.error("Error updating role:", error)
            toast.error("Error al actualizar rol", {
                description: "No se pudo actualizar el rol del usuario"
            })
        } finally {
            setUpdatingUser(null)
            setOpenRolePopover(null)
        }
    }

    const updateUserStatus = async (userId: string, newStatus: string) => {
        setUpdatingUser(userId)
        try {
            const userRef = doc(db, "usuarios", userId)
            await updateDoc(userRef, {
                estado: newStatus,
                actualizadoEn: new Date().toISOString()
            })
            toast.success("Estado actualizado", {
                description: `El estado del usuario ha sido cambiado a ${newStatus}`
            })
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Error al actualizar estado", {
                description: "No se pudo actualizar el estado del usuario"
            })
        } finally {
            setUpdatingUser(null)
            setOpenStatusPopover(null)
        }
    }

    const toggleRoleFilter = (role: string) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        )
    }

    const clearRoleFilters = () => {
        setSelectedRoles([])
    }

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
            const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.rol as string)
            const matchesStatus = statusFilter === "all" || user.estado === statusFilter
            return matchesSearch && matchesRole && matchesStatus
        })
    }

    const filteredUsers = filterUsers(users)

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

                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => exportDataUsuarios(users)} className="flex-1 sm:flex-none">
                            <Download className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Exportar usuarios</span>
                        </Button>

                        <InviteUserDialog empresaId={empresaId} areaId={areaId} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                            <Popover open={openRoleFilterPopover} onOpenChange={setOpenRoleFilterPopover}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full sm:w-52 justify-between"
                                    >
                                        {selectedRoles.length === 0 ? (
                                            "Todos los roles"
                                        ) : selectedRoles.length === 1 ? (
                                            <span className="truncate">{selectedRoles[0]}</span>
                                        ) : (
                                            `${selectedRoles.length} roles seleccionados`
                                        )}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-52 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar rol..." className="h-9" />
                                        <CommandList className="max-h-[200px]">
                                            <CommandEmpty>No se encontró el rol.</CommandEmpty>
                                            <CommandGroup>
                                                {selectedRoles.length > 0 && (
                                                    <CommandItem
                                                        onSelect={clearRoleFilters}
                                                        className="text-sm text-muted-foreground"
                                                    >
                                                        <span className="mr-2">✕</span>
                                                        Limpiar filtros
                                                    </CommandItem>
                                                )}
                                                {ArrayRoles.map((role) => (
                                                    <CommandItem
                                                        key={role.value}
                                                        value={role.value}
                                                        onSelect={() => toggleRoleFilter(role.value)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedRoles.includes(role.value) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <span className="truncate">{role.label}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                                <SelectItem value="suspendido">Suspendido</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-lg overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold min-w-[200px]">Usuario</TableHead>
                                <TableHead className="font-semibold min-w-[180px] hidden md:table-cell">Contacto</TableHead>
                                <TableHead className="font-semibold min-w-[180px]">Rol</TableHead>
                                <TableHead className="font-semibold min-w-[100px]">Estado</TableHead>
                                <TableHead className="font-semibold min-w-[150px] hidden lg:table-cell">Ultimo acceso</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Acciones</TableHead>
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
                                                    {searchTerm || selectedRoles.length > 0 || statusFilter !== "all"
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
                                            <TableCell className="hidden md:table-cell">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        <span className="truncate max-w-[150px]">{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        <span>
                                                            {user.contacto?.telefonoMovil || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Popover
                                                    open={openRolePopover === user.uid}
                                                    onOpenChange={(open) => setOpenRolePopover(open ? user.uid : null)}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            size="sm"
                                                            aria-expanded={openRolePopover === user.uid}
                                                            className="w-full max-w-[160px] justify-between text-xs sm:text-sm"
                                                            disabled={updatingUser === user.uid}
                                                        >
                                                            {updatingUser === user.uid ? (
                                                                <span className="flex items-center gap-2">
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                                                                    <span className="hidden sm:inline">Actualizando...</span>
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <span className="truncate">{user.rol || "Seleccionar"}</span>
                                                                    <ChevronsUpDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-[200px] p-0"
                                                        align="start"
                                                        side="bottom"
                                                        sideOffset={4}
                                                    >
                                                        <Command>
                                                            <CommandInput placeholder="Buscar rol..." className="h-9" />
                                                            <CommandList className="max-h-[200px]">
                                                                <CommandEmpty>No se encontró el rol.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {ArrayRoles.map((role) => (
                                                                        <CommandItem
                                                                            key={role.value}
                                                                            value={role.value}
                                                                            onSelect={() => {
                                                                                if (role.value !== user.rol) {
                                                                                    updateUserRole(user.uid, role.value as RolUsuario)
                                                                                } else {
                                                                                    setOpenRolePopover(null)
                                                                                }
                                                                            }}
                                                                            className="text-xs sm:text-sm"
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0",
                                                                                    user.rol === role.value ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <span className="truncate">{role.label}</span>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                            <TableCell>
                                                <Popover
                                                    open={openStatusPopover === user.uid}
                                                    onOpenChange={(open) => setOpenStatusPopover(open ? user.uid : null)}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Badge
                                                            variant={user.estado === "activo" ? "default" : "secondary"}
                                                            className={cn(
                                                                "cursor-pointer transition-all hover:scale-105",
                                                                user.estado === "activo"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                    : user.estado === "inactivo"
                                                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                                        : "bg-red-100 text-red-800 hover:bg-red-200",
                                                                updatingUser === user.uid && "opacity-50 pointer-events-none"
                                                            )}
                                                        >
                                                            {updatingUser === user.uid ? (
                                                                <span className="flex items-center gap-1">
                                                                    <div className="animate-spin rounded-full h-2 w-2 border-b border-current"></div>
                                                                    ...
                                                                </span>
                                                            ) : (
                                                                user.estado
                                                            )}
                                                        </Badge>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-40 p-1" align="start" side="bottom">
                                                        <div className="flex flex-col gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={cn(
                                                                    "justify-start text-xs",
                                                                    user.estado === "activo" && "bg-green-50"
                                                                )}
                                                                onClick={() => updateUserStatus(user.uid, "activo")}
                                                                disabled={updatingUser === user.uid || user.estado === "activo"}
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                                                Activo
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={cn(
                                                                    "justify-start text-xs",
                                                                    user.estado === "inactivo" && "bg-yellow-50"
                                                                )}
                                                                onClick={() => updateUserStatus(user.uid, "inactivo")}
                                                                disabled={updatingUser === user.uid || user.estado === "inactivo"}
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                                                                Inactivo
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={cn(
                                                                    "justify-start text-xs",
                                                                    user.estado === "suspendido" && "bg-red-50"
                                                                )}
                                                                onClick={() => updateUserStatus(user.uid, "suspendido")}
                                                                disabled={updatingUser === user.uid || user.estado === "suspendido"}
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                                                Suspendido
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="whitespace-nowrap">{format(lastSessionDate, "PPP", { locale: es })}</span>
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