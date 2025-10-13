"use client"

import NotificationsNavbar from "@/modules/notificaciones/components/notifications-navbar"
import { NotificationInterface } from "@/modules/notificaciones/types/notifications"
import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import { getNotificationTypeIcon } from "@/functions/get-notification-type-icon"
import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode"
import { useNotifications } from "@/context/notification-context"
import YearCombobox from "@/components/global/year-combobox"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Building2, Clock, Wifi } from "lucide-react"
import { useIpAddress } from "@/context/ip-context"
import { useTime } from "@/context/time-context"
import { useDate } from "@/context/date-context"

interface AppNavbarProps {
    companyName?: string
}

const notificationProp: NotificationInterface[] = [
    {
        id: "1",
        title: "Notificación 1",
        message: "Mensaje de la notificación 1",
        type: NotificationType.Message,
        createdAt: new Date(),
        readBy: ["1"],
        actionUrl: "",
        createdBy: "1",
        dialogData: "",
        expiresAt: new Date(),
        icon: getNotificationTypeIcon(NotificationType.Message),
        priority: "medium",
        relatedId: "1",
        systemGenerated: false,
        visibleTo: ["1"]
    }
]

const AreaNavbar = ({ companyName }: AppNavbarProps) => {
    const { unreadCount, currentUser, markAsRead } = useNotifications()
    const { ipAddress, isLoading, error } = useIpAddress()
    const { formattedTime } = useTime()
    const { formattedDate } = useDate()


    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />

                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Building2 className="size-4" />
                    </div>
                    <span className="font-semibold text-lg hidden sm:block">{companyName}</span>
                </div>

                <div className="hidden md:flex ml-4">
                </div>
            </div>

            <div className="hidden items-center gap-4 text-sm font-medium text-black dark:text-white md:flex">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(formattedDate).toLocaleDateString()}, {formattedTime}
                </div>
                <div className="flex items-center gap-1 mr-1">
                    {isLoading ? (
                        <span className="animate-pulse">Cargando IP...</span>
                    ) : error ? (
                        <span className="text-red-500">Error: {error}</span>
                    ) : ipAddress ? (
                        <>
                            <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-300 mr-1" />
                            <span>{ipAddress}</span>
                        </>
                    ) : (
                        <span></span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <YearCombobox />
                <NotificationsNavbar 
                    currentUserId={currentUser?.id || ""}
                    notifications={notificationProp}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                    maxDisplayed={5}
                />
                <AnimatedToggleMode />
            </div>
        </header>
    )
}

export default AreaNavbar