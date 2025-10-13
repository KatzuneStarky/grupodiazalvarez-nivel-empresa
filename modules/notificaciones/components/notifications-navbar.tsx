"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationInterface } from "../types/notifications"
import { ScrollArea } from "@/components/ui/scroll-area"
import NotificationItem from "./notification-item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

interface NavbarNotificationProps {
    notifications: NotificationInterface[]
    currentUserId: string
    onMarkAsRead: (id: string) => void
    maxDisplayed?: number
    unreadCount: number
}

const NotificationsNavbar = ({
    notifications,
    currentUserId,
    onMarkAsRead,
    maxDisplayed = 5,
    unreadCount
}: NavbarNotificationProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold text-sm">Notificaciones</h3>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {unreadCount} nueva{unreadCount === 0 || unreadCount > 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="rounded-full bg-muted p-3">
                                <Bell className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-sm">No hay notificaciones</p>
                                <p className="text-xs text-muted-foreground">
                                    ¡Ya estás al día! Te avisaremos cuando llegue algo nuevo.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="relative group">
                                    <NotificationItem
                                        notification={notification}
                                        currentUserId={currentUserId}
                                        //onClick={(e) => handleNotificationClick(notification, e)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            //setSelectedNotification(notification)
                                            //setDetailDialogOpen(true)
                                            //setOpen(false)
                                        }}
                                    >
                                        Ver datos
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                {notifications.length > 0 && (
                    <div className="p-2 border-t border-border">
                        <Button
                            variant="ghost"
                            className="w-full text-sm"
                            onClick={() => {
                                //setOpen(false)
                                //onViewAll()
                            }}
                        >
                            Ver todas las notificaciones
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationsNavbar