"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area"
import { useUsuarios } from "@/modules/usuarios/hooks/use-usuarios"
import { Menu } from "@/modules/menus/types/menu-sistema"
import { Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RolUsuario } from "@/enum/user-roles"
import { Input } from "@/components/ui/input"
import CreateAreaMenuForm from "./menu-form"
import MenuOrder from "./menu-order"
import { useState } from "react"

interface MenuManagementProps {
    areaId: string
    empresaId: string
    empresaName: string
    onMenuCountChange: (count: number) => void
}

const MenuManagement = ({ areaId, empresaId, empresaName, onMenuCountChange }: MenuManagementProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [roleFilter, setRoleFilter] = useState<RolUsuario | string>("all")
    const { usuarios } = useUsuarios()
    const { menus, loading, error } = useMenusByArea(areaId);

    const usuariosEmpresaArea = usuarios.filter((usuario) => usuario.empresaId === empresaId)
    const roles = usuariosEmpresaArea.filter((usuario) => usuario.rol && usuario.rol.length > 0)
    const rolesUnicos = roles.map((usuario) => usuario.rol).flat()
        .filter((role, index, self) => self.indexOf(role) === index)

    const filterMenuItems = (items: Menu[]): Menu[] => {
        return items.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = roleFilter === "all" || item.rolesAllowed && item.rolesAllowed.includes(roleFilter as RolUsuario)
            return matchesSearch && matchesRole
        })
    }

    const topLevelMenus = menus.filter((item) => !item.id)
    const filteredMenus = filterMenuItems(menus)

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div>
                        <CardTitle className="text-xl">Administracion de menus</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Administre los menus y submenus de esta area
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="shadow-sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregue un nuevo menu
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    Crea un nuevo menu
                                </DialogTitle>
                                <DialogDescription>
                                    Agrega un nuevo link a tu área,
                                    ten en cuenta que se debe contactar
                                    al administrador para tener en cuenta los cambios.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateAreaMenuForm
                                areaId={areaId}
                                empresaName={empresaId}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Busque menus..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-40 capitalize">
                                <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                {rolesUnicos.map((r) => (
                                    <SelectItem
                                        key={r}
                                        value={r as string}
                                        className="capitalize">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <MenuOrder
                        areaId={areaId || ""}
                        empresaId={empresaId || ""}
                        empresaName={empresaName || ""}
                        menus={filteredMenus}
                        loading={loading}
                        error={error || null}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default MenuManagement