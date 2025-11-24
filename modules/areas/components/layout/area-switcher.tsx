"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Empresa } from "@/modules/empresas/types/empresas"
import { Building2, ChevronDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useLastArea } from "@/hooks/use-last-area"
import { useRouter } from "next/navigation"
import { Area } from "../../types/areas"

interface AreaSwitcherProps {
    empresa: Empresa | null
    areas: Area[]
    currentArea: Area | null
    userId?: string
}

export const AreaSwitcher = ({ empresa, areas, currentArea, userId }: AreaSwitcherProps) => {
    const router = useRouter()
    const { updateArea } = useLastArea(userId);
    const [selectedArea, setSelectedArea] = useState<Area | null>(currentArea)

    const orderedAreas = useMemo(() =>
        areas?.sort((a, b) => a.nombre.localeCompare(b.nombre)) || []
        , [areas])

    useEffect(() => {
        if (orderedAreas.length > 0 && !selectedArea) {
            setSelectedArea(orderedAreas[0]);
        }
    }, [orderedAreas, selectedArea]);

    useEffect(() => {
        if (selectedArea && userId) {
            updateArea(selectedArea.id);
        }
    }, [selectedArea, userId, updateArea]);

    const handleAreaChange = (area: Area) => {
        setSelectedArea(area)
        router.replace(`/${empresa?.nombre}/${area.nombre}`);
        router.refresh();
    }

    return (
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
                                    {currentArea?.nombre || selectedArea?.nombre}
                                </span>
                                <span className="truncate text-xs">{currentArea?.correoContacto || selectedArea?.correoContacto}</span>
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
                        {orderedAreas.map((area) => (
                            <DropdownMenuItem
                                key={area.id}
                                onClick={() => handleAreaChange(area)}
                                className="gap-2 p-2"
                            >
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
    )
}
