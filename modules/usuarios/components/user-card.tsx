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
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"

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
        return <Badge variant={variants[estado]} className="text-xs">{labels[estado]}</Badge>
    }

    const getRegistrationTypeBadge = (tipo: SystemUser["tipoRegistro"]) => {
        const labels: Record<SystemUser["tipoRegistro"], string> = {
            google: "Google",
            email: "Email",
            invitacion: "Invitación",
        }
        return <Badge variant="outline" className="text-xs">{labels[tipo]}</Badge>
    }

    const getInitials = (nombre?: string, email?: string) => {
        if (nombre) {
            const parts = nombre.split(" ")
            if (parts.length > 1) {
                return parts.map(p => p[0]).join("").toUpperCase()
            }
            return nombre[0].toUpperCase()
        }
        return email?.charAt(0).toUpperCase() || "U"
    }

    return (
        <div className={variant === "cards" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : ""}>
            {users.map(user => (
                <Card key={user.uid} className="relative">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.nombre || user.email} />
                                <AvatarFallback>{getInitials(user.nombre, user.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium text-sm truncate">{user.nombre ? `${user.nombre}` : user.email}</h3>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                {user.empleadoId && (
                                    <p className="text-xs text-muted-foreground font-mono">{user.empleadoId}</p>
                                )}
                            </div>
                        </div>
                        <Checkbox
                            checked={selectedUserIds.has(user.uid)}
                            onCheckedChange={checked => onSelectUser(user.uid, checked as boolean)}
                        />
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {getStatusBadge(user.estado)}
                            {getRegistrationTypeBadge(user.tipoRegistro)}
                        </div>
                        {user.rol && (
                            <Badge variant="outline" className="text-xs">{user.rol}</Badge>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Created {format(parseFirebaseDate(user.creadoEn), "dd MMM yyyy", { locale: es })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                                Last access: {user.ultimoAcceso ? format(parseFirebaseDate(user.ultimoAcceso), "dd MMM yyyy", { locale: es }) : "Never"}
                            </span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 absolute top-2 right-2">
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
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default UserCards