"use client"

import { AreaMenu, AreaSubMenu } from "@/modules/menus/types/menu";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/global/icon";

interface SidebarMenuItemProps {
    item: AreaMenu;
    isCollapsed: boolean;
    expanded: boolean;
    toggleExpand: (menuId: string) => void;
    onNavigate: (link: string) => void;
    subMenus: AreaSubMenu[];
}

const SidebarMenuItems = ({
    expanded,
    isCollapsed,
    item,
    onNavigate,
    subMenus,
    toggleExpand
}: SidebarMenuItemProps) => {
    const hasSubMenus = subMenus?.length > 0;

    return (
        <div className="py-0.5">
            <div className="relative group">
                <Button
                    variant="ghost"
                    className={`flex w-full items-center justify-between px-2 py-2 ${isCollapsed ? "justify-center px-0" : ""
                        } cursor-pointer`}
                    onClick={(e) => {
                        const isChevronClick = (e.target as HTMLElement).closest(
                            ".chevron-container"
                        );
                        if (hasSubMenus) {
                            if (isChevronClick || isCollapsed) {
                                toggleExpand(item.id);
                            } else if (item.link) {
                                onNavigate(item.link);
                            }
                        } else if (item.link) {
                            onNavigate(item.link);
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Icon
                            iconName={item.icon}
                            className={`h-5 w-5 ${isCollapsed ? "mx-auto" : ""}`}
                        />
                        {!isCollapsed && <span>{item.name.toUpperCase()}</span>}
                    </div>

                    {!isCollapsed && hasSubMenus && (
                        <div className="chevron-container flex items-center">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                    )}

                    {isCollapsed && hasSubMenus && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 
                            opacity-0 group-hover:opacity-100">
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    )}
                </Button>
            </div>

            {!isCollapsed && hasSubMenus && (
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-6 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800"
                        >
                            {subMenus.map((subItem) => (
                                <motion.button
                                    key={subItem.id}
                                    className="w-full rounded-md px-2 py-1.5 text-left transition-colors 
                                    hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 
                                    dark:hover:text-slate-300 flex items-center text-xs cursor-pointer"
                                    onClick={() => onNavigate(subItem.link)}
                                >
                                    {subItem.icon && (
                                        <span className="mr-2">
                                            <Icon iconName={subItem.icon} />
                                        </span>
                                    )}
                                    {subItem.name.toUpperCase()}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

export default SidebarMenuItems