"use client"

import { Building, Building2, Eye, EyeClosed, GripVertical, Link, Shield, Trash2 } from "lucide-react"
import { AreaMenuSchema, AreaMenuType } from "@/modules/admin-area/schema/menu.schema"
import { updateMenuData, updateMenuVisible } from "@/modules/menus/actions/write"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAllEmpresaData } from "@/hooks/use-all-empresa-data"
import SubmitButton from "@/components/global/submit-button"
import MenuForm from "@/modules/menus/components/menu-form"
import { Menu } from "@/modules/menus/types/menu-sistema"
import { ScrollArea } from "@/components/ui/scroll-area"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/global/icon"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const MenusPage = () => {
    const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null)
    const [expandedAreaId, setExpandedAreaId] = useState<string | null>(null)
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
    const [newMenuDialogOpen, setNewMenuDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { empresasData } = useAllEmpresaData()

    const selectedEmpresa = empresasData?.find((empresa) => empresa.id === expandedCompanyId)
    const selectedArea = selectedEmpresa?.areas?.find((area) => area.id === expandedAreaId)
    const selectedMenuData = selectedArea?.menus?.find((menu) => menu.id === selectedMenu?.id)

    const handleCompanyClick = (companyId: string) => {
        setExpandedCompanyId((prevId) => (prevId === companyId ? null : companyId))
        setExpandedAreaId(null)
    }

    const handleAreaClick = (areaId: string) => {
        setExpandedAreaId((prevId) => (prevId === areaId ? null : areaId))
    }

    const handlUpdateMenuVisible = async (empresaId: string, areaId: string, menuId: string, visible: boolean) => {
        try {
            toast.promise(updateMenuVisible(empresaId, areaId, menuId, visible), {
                loading: 'Actualizando menu...',
                success: 'Menu actualizado correctamente',
                error: 'Error al actualizar menu'
            })
        } catch (error) {
            console.log(error);
            toast.error('Error al actualizar menu')
        }
    }

    const form = useForm<AreaMenuType>({
        resolver: zodResolver(AreaMenuSchema),
        defaultValues: {
            allowedRoles: [],
            name: "",
            link: "",
            areaId: selectedArea?.id || "",
        }
    })

    const onSubmit = (data: AreaMenuType) => {
        try {
            setIsSubmitting(true)

            toast.promise(updateMenuData(
                selectedEmpresa?.id || "",
                selectedArea?.id || "",
                selectedMenu?.id || "",
                {
                    areaId: selectedArea?.id || "",
                    rolesAllowed: data.allowedRoles,
                    title: data.name,
                    path: data.link,
                    icon: data.icon,
                }
            ), {
                loading: "Actualizando menú favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al actualizar el menu.";
                },
            })
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el menu")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-6 px-8">
            <PageTitle
                title="Menus"
                description="Gestion de menus por empresas y areas"
                icon={<Shield className="text-primary size-12" />}
                hasActions={true}
                actions={
                    <Button>
                        <Plus />
                        <span className="ml-2">Nuevo menu</span>
                    </Button>
                }
            />
            <Separator className="my-4" />

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Empresas, areas y menus</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100vh-30rem)]">
                        <ScrollArea className="space-y-2 h-[100vh] p-2">
                            {empresasData.length > 0 ? (
                                empresasData.map((empresa) => {
                                    return (
                                        <div key={empresa.id}>
                                            <button
                                                className="flex w-full items-center cursor-pointer justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors mb-2"
                                                onClick={() => handleCompanyClick(empresa.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Building className="h-5 w-5 text-primary" />
                                                    <div className="text-left">
                                                        <p className="font-medium capitalize">{empresa.nombre}</p>
                                                        <p className="text-xs text-muted-foreground">{empresa?.areas?.length} areas</p>
                                                    </div>
                                                </div>
                                            </button>
                                            {expandedCompanyId === empresa.id && empresa.areas?.length && empresa.areas.length > 0 && (
                                                <div className="space-y-2 p-2">
                                                    {empresa.areas.map((area, index) => (
                                                        <div key={index}>
                                                            <button
                                                                className="flex w-full items-center cursor-pointer justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors mb-2"
                                                                onClick={() => handleAreaClick(area.id)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <Building2 className="h-5 w-5 text-secondary" />
                                                                    <div className="text-left">
                                                                        <p className="font-medium capitalize">{area.nombre}</p>
                                                                        <p className="text-xs text-muted-foreground">{area?.menus?.length} menus</p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                            {expandedAreaId === area.id && area.menus?.length && area.menus.length > 0 && (
                                                                <div className="space-y-2 p-2">
                                                                    {area.menus.map((menu, menuIndex) => (
                                                                        <div key={menuIndex}
                                                                            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors cursor-pointer"
                                                                            onClick={() => setSelectedMenu(menu)}
                                                                        >
                                                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                                                            <Icon iconName={menu.icon || ""} className="h-5 w-5 text-tertiary" />
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="font-medium">{menu.title}</span>
                                                                                    {menu.visible && <Badge variant="outline">Visible</Badge>}
                                                                                </div>
                                                                                <p className="text-sm text-muted-foreground">{menu.path}</p>
                                                                            </div>
                                                                            <Button variant={"ghost"} size="icon" className="h-8 w-8 hover:text-red-500">
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                            }
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-muted-foreground">No hay empresas disponibles.</p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Vista Previa</CardTitle>
                            <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Activar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="grid grid-cols-3 gap-2">
                                {selectedArea?.menus.map((menu) => (
                                    <Card key={menu.id} className={cn(
                                        selectedMenu?.id === menu.id ? "bg-accent" : "opacity-50"
                                    )}>
                                        <CardContent>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Icon iconName={menu.icon || ""} className="size-6 flex-shrink-0" />
                                                    <p className="truncate capitalize">{menu.title}</p>
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(menu.path, "_blank")}>
                                                            <Link className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{menu.path}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{menu.path}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            {selectedMenu && (
                                <div>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="capitalize">{selectedMenu.title}</CardTitle>
                                        {selectedMenu.visible === true ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlUpdateMenuVisible(
                                                    selectedEmpresa?.id || "",
                                                    selectedArea?.id || "",
                                                    selectedMenu.id,
                                                    false
                                                )}
                                            >
                                                <EyeClosed className="mr-2 h-4 w-4" />
                                                Desactivar
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlUpdateMenuVisible(
                                                    selectedEmpresa?.id || "",
                                                    selectedArea?.id || "",
                                                    selectedMenu.id,
                                                    true
                                                )}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Activar
                                            </Button>
                                        )}
                                    </div>

                                    <MenuForm
                                        empresaName={selectedEmpresa?.nombre || ""}
                                        empresaId={selectedEmpresa?.id || ""}
                                        areaName={selectedArea?.nombre || ""}
                                        areaId={selectedArea?.id || ""}
                                        menuId={selectedMenu?.id || ""}
                                        isSubmitting={isSubmitting}
                                        menuData={selectedMenu}
                                        onSubmit={onSubmit}
                                        form={form}
                                        submitButton={
                                            <SubmitButton
                                                isSubmiting={isSubmitting}
                                                loadingText="Guardando..."
                                                text="Guardar cambios"
                                            />
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

export default MenusPage