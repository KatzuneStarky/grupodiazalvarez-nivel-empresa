"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, ChevronDown, ChevronRight, Cog, ExternalLink, File, LogOut, UserCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area"
import { filterMenusByRole } from "@/modules/menus/actions/read"
import { useAreasByEmpresa } from "../../hooks/use-areas"
import { useEmpresa } from "@/context/empresa-context"
import { Separator } from "@/components/ui/separator"
import { useLastArea } from "@/hooks/use-last-area"
import { useArea } from "@/context/area-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { RolUsuario } from "@/enum/user-roles"
import Icon from "@/components/global/icon"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Area } from "../../types/areas"

const AreaSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const { userBdd, logout } = useAuth()
    const { updateArea } = useLastArea(userBdd?.uidFirebase);
    const { area } = useArea()
    const { empresa } = useEmpresa()
    const { areas } = useAreasByEmpresa(empresa?.id || "")
    const { menus } = useMenusByArea(area?.id)
    const filteredMenus = filterMenusByRole(menus, userBdd?.rol as RolUsuario)
    const orderedAreas = areas?.sort((a, b) => a.nombre.localeCompare(b.nombre))
    const [selectedArea, setSelectedArea] = useState<Area | null>()
    const router = useRouter()

    useEffect(() => {
        if (orderedAreas && orderedAreas.length > 0 && !selectedArea) {
            setSelectedArea(orderedAreas[0]);
        }
    }, [orderedAreas]);

    useEffect(() => {
        if (selectedArea && userBdd?.uidFirebase) {
            updateArea(selectedArea.id);
        }
    }, [selectedArea, userBdd?.uidFirebase, updateArea]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Building2 className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold capitalize">
                                            {area?.nombre}
                                        </span>
                                        <span className="truncate text-xs">{area?.correoContacto}</span>
                                    </div>
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                align="start"
                                side="bottom"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="text-xs text-muted-foreground">Areas de {empresa?.nombre}</DropdownMenuLabel>
                                {orderedAreas?.map((area) => (
                                    <DropdownMenuItem key={area.id} onClick={() => {
                                        setSelectedArea(area)
                                        router.replace(`/${empresa?.nombre}/${area.nombre}`);
                                        router.refresh();
                                    }} className="gap-2 p-2">
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            <Building2 className="size-4 shrink-0" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium capitalize">{area.nombre}</span>
                                            <span className="truncate text-xs text-muted-foreground">{area.correoContacto}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <Separator className="mb-4" />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredMenus.map((item) => (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.title === "Dashboard"}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <Icon iconName={item.icon} />}
                                                <span className="capitalize">{item.title}</span>
                                                {item.subMenus && item.subMenus?.length > 0 && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90" asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                                <a href={item.path}>
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span className="sr-only">Go to {item.title}</span>
                                                </a>
                                            </Button>
                                        </SidebarMenuAction>
                                        {item.subMenus?.length ? (
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subMenus.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={subItem.path}>
                                                                    {subItem.icon && <Icon iconName={subItem.icon} />}
                                                                    <span className="capitalize">{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        ) : null}
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <Separator className="mt-4" />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={userBdd?.avatarUrl} alt="User" />
                                        <AvatarFallback className="rounded-lg">{userBdd?.nombre?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{userBdd?.nombre}</span>
                                        <span className="truncate text-xs">{userBdd?.email}</span>
                                    </div>
                                    <ChevronDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={userBdd?.avatarUrl} alt="User" />
                                            <AvatarFallback className="rounded-lg">{userBdd?.nombre?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{userBdd?.nombre}</span>
                                            <span className="truncate text-xs">{userBdd?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/usuario/${userBdd?.nombre}`)}>
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/usuario/${userBdd?.nombre}/documentos`)}>
                                    <File className="mr-2 h-4 w-4" />
                                    Mis documentos
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Cog className="mr-2 h-4 w-4" />
                                    Configuracion
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Salir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AreaSidebar