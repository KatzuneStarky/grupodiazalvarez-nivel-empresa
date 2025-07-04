"use client"

import { menusAdministracion } from "@/modules/menus/constants/menus-administracion"
import SidebarMenuList from "./sidebar/sidebar-menu-list"
import { ChevronRight, Menu } from "lucide-react"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { useState } from "react"

interface SidebarProps {
    isOpen: boolean
    isCollapsed: boolean
    toggleCollapsed: () => void
}

const Sidebar = ({
    toggleCollapsed,
    isCollapsed,
    isOpen
}: SidebarProps) => {
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(true)
    const router = useRouter()

    const sidebarWidth = isCollapsed ? "w-16" : "w-64"
    const menusAdmin = menusAdministracion

    const handleNavigation = (link: string) => {
        router.push(link);
    };

    const toggleExpandMenu = (menuId: string) => {
        setExpandedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId]
        );
    };

    return (
        <motion.aside
            className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col border-r-2 border-slate-200 
                transition-all ${sidebarWidth} bg-card`}
            initial={false}
            animate={{
                width: isCollapsed ? 64 : 256,
                x: isOpen ? 0 : -300,
            }}
            transition={{ type: "spring", damping: 10, stiffness: 200 }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapsed}
                className="absolute -right-3 top-3 z-50 hidden h-6 w-6 rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:items-center lg:justify-center"
            >
                <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`} />
            </Button>

            <div className="p-3">
                {isAdmin ? (
                    <div className={`${isCollapsed ? "flex items-center justify-center" : "text-center"}`}>
                        {isCollapsed ? (<Menu />) : "Menu administracion"}
                    </div>
                ) : (
                    <div>
                        {/** <AreasDropDown isCollapsed={isCollapsed} /> */}
                    </div>
                )}
            </div>

            <Separator className="mb-1" />

            <div className={`flex flex-col h-full border-r ${sidebarWidth} transition-all duration-300`}>
                <div className="flex-grow overflow-y-auto py-1">
                    <SidebarMenuList
                        filteredMenus={isAdmin ? menusAdmin : []}
                        expandedMenus={expandedMenus}
                        toggleExpandMenu={toggleExpandMenu}
                        onNavigate={handleNavigation}
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>

            <Separator className="mt-1" />
            <div className="py-3">
                {/** <UserMenu isCollapsed={isCollapsed} /> */}
            </div>
        </motion.aside>
    )
}

export default Sidebar