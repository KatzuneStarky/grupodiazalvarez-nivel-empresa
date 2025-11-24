"use client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
import { ChevronRight, ExternalLink } from "lucide-react"
import { Menu } from "@/modules/menus/types/menu-sistema"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"

interface SidebarNavigationProps {
    menus: Menu[]
    pathname: string
}

export const SidebarNavigation = ({ menus, pathname }: SidebarNavigationProps) => {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {menus.map((item) => (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={
                                item.title === "Dashboard" ||
                                item.subMenus?.some((sub) => pathname.includes(sub.path))
                            }
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
    )
}
