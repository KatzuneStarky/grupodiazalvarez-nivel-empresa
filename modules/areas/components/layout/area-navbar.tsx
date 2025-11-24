"use client"

import NotificationsNavbar from "@/modules/notificaciones/components/notifications-navbar"
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

const AreaNavbar = ({ companyName }: AppNavbarProps) => {
    const { unreadCount, currentUser, markAsRead, notifications, loadMore } = useNotifications()
    const { ipAddress, isLoading, error } = useIpAddress()
    const { formattedTime } = useTime()
    const { formattedDate } = useDate()

    return (
        <header
            className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4"
            aria-label="Barra de navegación principal"
        >
            {/* Logo y empresa */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />

                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Building2 className="size-4" />
                    </div>
                    <span className="font-semibold text-lg hidden sm:block">{companyName}</span>
                </div>
            </div>

            {/* Información del sistema */}
            <nav
                className="hidden items-center gap-4 text-sm font-medium text-foreground md:flex"
                aria-label="Información del sistema"
            >
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formattedDate}, {formattedTime}</span>
                </div>

                <div className="h-4 w-px bg-border" aria-hidden="true" />

                <div className="flex items-center gap-1.5">
                    {isLoading ? (
                        <span className="animate-pulse text-muted-foreground">Cargando IP...</span>
                    ) : error ? (
                        <span className="text-destructive">Error: {error}</span>
                    ) : ipAddress ? (
                        <>
                            <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{ipAddress}</span>
                        </>
                    ) : null}
                </div>
            </nav>

            {/* Acciones del usuario */}
            <div className="flex items-center gap-2">
                <YearCombobox />
                <div className="h-4 w-px bg-border hidden sm:block" aria-hidden="true" />
                <NotificationsNavbar
                    currentUserId={currentUser?.uid || ""}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                    maxDisplayed={5}
                    loadMore={loadMore}
                />
                <AnimatedToggleMode />
            </div>
        </header>
    )
}

export default AreaNavbar