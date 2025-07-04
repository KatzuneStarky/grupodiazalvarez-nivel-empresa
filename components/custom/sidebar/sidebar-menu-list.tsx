"use client"

import { AreaMenu, AreaSubMenu } from "@/modules/menus/types/menu";
import SidebarMenuItems from "./sidebar-menu-items";

interface SidebarMenuListProps {
    filteredMenus: AreaMenu[];
    expandedMenus: string[];
    toggleExpandMenu: (id: string) => void;
    onNavigate: (link: string) => void;
    selectedSubMenus?: Record<string, AreaSubMenu[]>;
    isCollapsed: boolean;
}

const SidebarMenuList = ({
    expandedMenus,
    filteredMenus,
    isCollapsed,
    onNavigate,
    selectedSubMenus,
    toggleExpandMenu
}: SidebarMenuListProps) => {
    return (
        <nav className="space-y-0.5 px-2">
            {filteredMenus.map((item) => (
                <SidebarMenuItems
                    key={item.id}
                    item={item}
                    isCollapsed={isCollapsed}
                    expanded={expandedMenus.includes(item.id)}
                    toggleExpand={toggleExpandMenu}
                    onNavigate={onNavigate}
                    subMenus={selectedSubMenus?.[item.id] || []}
                />
            ))}
        </nav>
    )
}

export default SidebarMenuList