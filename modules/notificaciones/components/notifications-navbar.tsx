"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NotificationDialogItem from "./notification-dialog-item"
import { NotificationInterface } from "../types/notifications"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDirectLink } from "@/hooks/use-direct-link"
import NotificationItem from "./notification-item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { useState } from "react"

interface NavbarNotificationProps {
    notifications: NotificationInterface[]
    currentUserId: string
    onMarkAsRead: (id: string) => void
    maxDisplayed?: number
    unreadCount: number
    loadMore: () => void
}

const NotificationsNavbar = ({
    notifications,
    currentUserId,
    onMarkAsRead,
    maxDisplayed = 5,
    unreadCount,
    loadMore
}: NavbarNotificationProps) => {
    const [selectedNotification, setSelectedNotification] = useState<NotificationInterface | null>(null)
    const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)

    const { directLink } = useDirectLink("/notificaciones")
    const router = useRouter()
    const maxNotifications = notifications.slice(0, maxDisplayed)

    const moreNotifications = () => {
        if (notifications > maxNotifications) {
            loadMore()
        }
    }

    return (
        <>
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

                                <Button
                                    className="w-full text-sm mt-4"
                                    onClick={() => router.push(directLink)}
                                >
                                    <Bell className="h-8 w-8" />
                                    Ver otras notificaciones
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="h-[400px]">
                            <div className="divide-y divide-border">
                                {maxNotifications.map((notification) => (
                                    <div key={notification.id} className="relative group">
                                        <NotificationItem
                                            notification={notification}
                                            currentUserId={currentUserId}
                                            onClick={() => onMarkAsRead(notification.id)}
                                        />
                                        <Button
                                            size="sm"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedNotification(notification)
                                                setDetailDialogOpen(true)
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
                        <div className="flex items-center justify-center p-4 border-t border-border gap-2">
                            <Button onClick={() => moreNotifications()} className="text-sm">
                                Cargar mas
                            </Button>

                            <Button className="text-sm" onClick={() => router.push(directLink)}
                            >
                                Ver todo
                            </Button>
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <NotificationDialogItem 
                notification={selectedNotification}
                onOpenChange={setDetailDialogOpen}
                open={detailDialogOpen}
            />
        </>
    )
}

export default NotificationsNavbar