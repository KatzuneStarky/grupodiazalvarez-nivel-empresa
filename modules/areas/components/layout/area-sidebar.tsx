
"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area"
import { filterMenusByRole } from "@/modules/menus/actions/read"
import { useAreasByEmpresa } from "../../hooks/use-areas"
import { SidebarNavigation } from "./sidebar-navigation"
import { useEmpresa } from "@/context/empresa-context"
import { Separator } from "@/components/ui/separator"
import { useArea } from "@/context/area-context"
import { useAuth } from "@/context/auth-context"
import { RolUsuario } from "@/enum/user-roles"
import { AreaSwitcher } from "./area-switcher"
import { UserProfile } from "./user-profile"
import { useMemo } from "react"
import { usePathname } from "next/navigation"

const AreaSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const { userBdd, logout } = useAuth()
    const { area } = useArea()
    const { empresa } = useEmpresa()
    const { areas } = useAreasByEmpresa(empresa?.id || "")
    const { menus } = useMenusByArea(area?.id)

    const pathname = usePathname()

    const filteredMenus = useMemo(() =>
        filterMenusByRole(menus, userBdd?.rol as RolUsuario)
        , [menus, userBdd?.rol])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AreaSwitcher
                    empresa={empresa}
                    areas={areas || []}
                    currentArea={area}
                    userId={userBdd?.uid}
                />
            </SidebarHeader>

            <Separator className="mb-4" />

            <SidebarContent>
                <SidebarNavigation menus={filteredMenus} pathname={pathname} />
            </SidebarContent>

            <Separator className="mt-4" />

            <SidebarFooter>
                <UserProfile user={userBdd} onLogout={logout} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AreaSidebar
