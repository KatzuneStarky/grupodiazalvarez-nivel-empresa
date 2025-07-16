"use client"

import { SystemUser } from "@/types/usuario"
import { UserCardsProps } from "../types/user-cards"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, Eye, MoreHorizontal, UserX } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const UserCards = ({
    users,
    selectedUserIds,
    onSelectUser,
    onViewUser,
    onEditUser,
    onSuspendUser,
    variant = "cards",
}: UserCardsProps) => {
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

        return (
            <Badge variant={variants[estado]} className="text-xs">
                {labels[estado]}
            </Badge>
        )
    }

    const getRegistrationTypeBadge = (tipo: SystemUser["tipoRegistro"]) => {
        const labels = {
            google: "Google",
            email: "Email",
        }
        return (
            <Badge variant="outline" className="text-xs">
                {labels[tipo]}
            </Badge>
        )
    }

    const getInitials = (nombre?: string, email?: string) => {
        if (nombre) {
            return `${nombre[0]}`.toUpperCase()
        }
        if (nombre) {
            return nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
        }
        return email?.charAt(0).toUpperCase() || "U"
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
                <Card
                    key={user.id}
                    className={
                        `hover:shadow-md transition-shadow 
                        ${selectedUserIds.has(user.id) ? "bg-muted/50 border-primary" : ""}`
                    }
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    checked={selectedUserIds.has(user.id)}
                                    onCheckedChange={(checked) => onSelectUser(user.id, checked as boolean)}
                                />
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.nombre || user.email} />
                                    <AvatarFallback>{getInitials(user.nombre, user.email)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm truncate">
                                        {user.nombre ? `${user.nombre}` : user.nombre || user.email}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    {user.empleadoId && <p className="text-xs text-muted-foreground font-mono">{user.empleadoId}</p>}
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onViewUser(user)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onSuspendUser(user)} className="text-destructive">
                                        <UserX className="mr-2 h-4 w-4" />
                                        Suspend
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {getStatusBadge(user.estado)}
                                {getRegistrationTypeBadge(user.tipoRegistro)}
                            </div>

                            {user.rol && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Role</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {user.rol}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>Created {format(user.creadoEn, "dd MMM yyyy", { locale: es })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>Last access: {user.ultimoAcceso ? format(user.ultimoAcceso, "dd MMM yyyy", { locale: es }) : "Never"}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default UserCards