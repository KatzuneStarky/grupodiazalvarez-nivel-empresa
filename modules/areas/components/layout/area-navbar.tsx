"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode"
import YearCombobox from "@/components/global/year-combobox"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useArea } from "@/context/area-context"

interface AppNavbarProps {
    companyName?: string
}

const AreaNavbar = ({ companyName }: AppNavbarProps) => {
    const { area } = useArea()

    const unreadCount = 0
    const notifications: [{ id: number, title: string, body: string, unread: number, description: string, time: Date }] = [{
        body: "",
        description: "",
        id: 0,
        title: "",
        unread: 0,
        time: new Date()
    }]

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Building2 className="size-4" />
                    </div>
                    <span className="font-semibold text-lg hidden sm:block">{companyName}</span>
                </div>

                <div className="hidden md:flex ml-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${companyName}/${area?.nombre}`}>Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Vista general</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <YearCombobox />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    0
                                </Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            Notificationes
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {unreadCount} nuevas
                                </Badge>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{notification.title}</p>
                                                {notification.unread && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{notification.time.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center justify-center">View all notifications</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AnimatedToggleMode />
            </div>
        </header>
    )
}

export default AreaNavbar