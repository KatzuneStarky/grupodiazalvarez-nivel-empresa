"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbNav } from "@/modules/admin-area/components/breadcrumb-nav"
import UserManagement from "@/modules/admin-area/components/user-management"
import MenuManagement from "@/modules/admin-area/components/menu-management"
import { StatsCards } from "@/modules/admin-area/components/stats-cards"
import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area"
import QuickActions from "@/modules/admin-area/components/quick-actions"
import { useUsuarios } from "@/modules/usuarios/hooks/use-usuarios"
import { Building2, Clock, MapPin } from "lucide-react"
import { useEmpresa } from "@/context/empresa-context"
import { useArea } from "@/context/area-context"
import { useTime } from "@/context/time-context"
import { useDate } from "@/context/date-context"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const AdministracionPage = () => {
    const [activeUsers, setActiveUsers] = useState(0)
    const [menuCount, setMenuCount] = useState(0)
    const [userCount, setUserCount] = useState(0)

    const { usuarios, loading: userLoading } = useUsuarios()
    const { empresa } = useEmpresa()
    const { area } = useArea()
    const { menus } = useMenusByArea(area?.id);
    const { formattedTime } = useTime()
    const { formattedDate } = useDate()

    const usuariosEmpresActual = usuarios.filter((u) => u.empresaId === empresa?.id)

    useEffect(() => {
        setMenuCount(menus.length)
        setUserCount(usuariosEmpresActual.length)
        setActiveUsers(usuariosEmpresActual.filter((u) => u.estado === "activo").length)
    }, [menus])

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="space-y-6">
                    <BreadcrumbNav companyName={empresa?.nombre || ""} areaName={area?.nombre || ""} />

                    <Card className="shadow-lg border-0">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-bold">
                                        Panel de administracion
                                    </CardTitle>
                                    <p className="text-muted-foreground text-lg">Administre sus menus y usuarios</p>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{formattedDate} {formattedTime}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{empresa?.nombre}</p>
                                            <p className="text-xs text-muted-foreground">Compañia</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Area actual</p>
                                            <p className="text-xs text-muted-foreground">{area?.nombre}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="outline" className="px-3 py-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {area?.nombre}
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1">
                                    {menuCount} Menus
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1">
                                    {userCount} Usuarios
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1">
                                    {activeUsers} Usuarios Activos
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <StatsCards menuCount={menuCount} userCount={userCount} activeUsers={activeUsers} />
                <QuickActions areaId={area?.id || ""} empresaName={empresa?.nombre || ""} />

                <div className="space-y-8">
                    <MenuManagement
                        areaId={area?.id || ""}
                        empresaId={empresa?.id || ""}
                        empresaName={empresa?.nombre || ""}
                        onMenuCountChange={setMenuCount}
                    />

                    <UserManagement
                        areaId={area?.id || ""}
                        empresaId={empresa?.id || ""}
                        users={usuariosEmpresActual}
                        loading={userLoading}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdministracionPage