"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
    isOpen: boolean
    isCollapsed: boolean
    toggleCollapsed: () => void
}

const CBSSidebar = ({
    toggleCollapsed,
    isCollapsed,
    isOpen
}: SidebarProps) => {
    const router = useRouter();
    //const { openMenus, toggleMenu, filteredMenus } = useMenuScrollArea();
    //const { selectedSubMenus, isLoading } = useMenuContext();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const sidebarWidth = isCollapsed ? "w-16" : "w-64"

    const handleNavigation = (link: string) => {
        router.push(link);
    };

    const toggleExpandMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    {/**
        const handleMenuClick = (item: AreaMenu, e: React.MouseEvent) => {
        const isChevronClick = (e.target as HTMLElement).closest('.chevron-container');

        if (selectedSubMenus[item.id]?.length > 0) {
            if (isChevronClick || isCollapsed) {
                toggleExpandMenu(item.id);
            } else {
                if (item.link) {
                    handleNavigation(item.link);
                }
            }
        } else {
            if (item.link) {
                handleNavigation(item.link);
            }
        }
    };

    const renderMenuIcon = (item: AreaMenu, isCollapsed: boolean) => (
        <Icon
            iconName={item.icon}
            className={`h-5 w-5 ${isCollapsed ? "mx-auto" : ""}`}
        />
    );

    const renderMenuName = (item: AreaMenu, isCollapsed: boolean) => (
        !isCollapsed && <span>{item.name.toUpperCase()}</span>
    );

    const renderSubMenuItems = (subItems: AreaSubMenu[]) => (
        subItems.map((subItem) => (
            <motion.button
                key={subItem.id}
                className="w-full rounded-md px-2 py-1.5 text-left transition-colors 
                hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 
                dark:hover:text-slate-300 flex items-center text-xs cursor-pointer"
                onClick={() => handleNavigation(subItem.link)}
            >
                {subItem.icon && (
                    <span className="mr-2">
                        <Icon iconName={subItem.icon} />
                    </span>
                )}
                {subItem.name.toUpperCase()}
            </motion.button>
        ))
    ); */}

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
                {/** <AreasDropDown isCollapsed={isCollapsed} /> */}
            </div>
            <Separator className="mb-1" />
            <div className={`flex flex-col h-full border-r ${sidebarWidth} transition-all duration-300`}>
                <div className="flex-grow overflow-y-auto py-1">
                    <nav className="space-y-0.5 px-2">
                        {/**
                         * {filteredMenus.map((item) => (
                            <div key={item.id} className="py-0.5">
                                <div className="relative group">
                                    <Button
                                        variant="ghost"
                                        className={`flex w-full items-center justify-between px-2 py-2 
                                        ${isCollapsed ? "justify-center px-0" : ""} cursor-pointer`}
                                        onClick={(e) => handleMenuClick(item, e)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {renderMenuIcon(item, isCollapsed)}
                                            {renderMenuName(item, isCollapsed)}
                                        </div>

                                        {!isCollapsed && selectedSubMenus[item.id]?.length > 0 && (
                                            <div className="chevron-container flex items-center">
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expandedMenus.includes(item.id) ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </div>
                                        )}

                                        {isCollapsed && selectedSubMenus[item.id]?.length > 0 && (
                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        )}
                                    </Button>
                                </div>

                                {!isCollapsed && selectedSubMenus[item.id]?.length > 0 && (
                                    <AnimatePresence>
                                        {expandedMenus.includes(item.id) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-6 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800"
                                            >
                                                {renderSubMenuItems(selectedSubMenus[item.id])}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        ))}
                         */}
                    </nav>
                </div>
            </div>
            <Separator className="mt-1" />
            <div className="py-3">
                {/** <UserMenu isCollapsed={isCollapsed} /> */}
            </div>
        </motion.aside>
    )
}

export default CBSSidebar