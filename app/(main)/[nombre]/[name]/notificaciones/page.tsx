"use client"

import NotificationDialogItem from "@/modules/notificaciones/components/notification-dialog-item"
import { NotificationInterface } from "@/modules/notificaciones/types/notifications"
import NotificationItem from "@/modules/notificaciones/components/notification-item"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/context/notification-context"
import { CheckCheck, Filter, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

const NotificacionesPage = () => {
    const [selectedNotification, setSelectedNotification] = useState<NotificationInterface | null>(null)
    const [activeTab, setActiveTab] = useState<"todas" | "no leidas" | "leidas">("todas")
    const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>("")

    const { currentUser, notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()
    const router = useRouter()

    const filteredNotifications = notifications
        .filter((n) => {
            const matchesSearch =
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.message.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesTab =
                activeTab === "todas" ||
                (activeTab === "no leidas" && !n.readBy.includes(currentUser?.uidFirebase || "")) ||
                (activeTab === "leidas" && n.readBy.includes(currentUser?.uidFirebase || ""))

            return matchesSearch && matchesTab
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Notificaciones</h1>
                            <p className="text-sm text-muted-foreground">
                                {unreadCount > 0 ? `${unreadCount} Notificacions no leida${unreadCount > 1 ? "s" : ""}` : "Todas leidas!"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                                    <CheckCheck className="h-4 w-4 mr-2" />
                                    Marcar todas como leidas
                                </Button>
                            )}

                            <Button variant="outline" size="sm" onClick={() => router.back()}>
                                Regresar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar notificaciones..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "todas" | "no leidas" | "leidas")}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="todas">
                                    Todas
                                    <Badge variant="secondary" className="ml-2">
                                        {notifications.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger value="no leidas">
                                    No leidas
                                    {unreadCount > 0 && (
                                        <Badge variant="default" className="ml-2">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="leidas">Leidas</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "Try adjusting your search query" : "You're all caught up!"}
                            </p>
                        </div>
                    ) : (
                        <div className="border border-border rounded-lg overflow-hidden bg-card">
                            <ScrollArea className="h-[calc(100vh-300px)]">
                                <div className="divide-y divide-border">
                                    {filteredNotifications.map((notification) => (
                                        <div key={notification.id} className="relative group">
                                            <NotificationItem
                                                notification={notification}
                                                currentUserId={currentUser?.uidFirebase || ""}
                                                onClick={() => markAsRead(notification.id)}
                                                showFullMessage
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedNotification(notification)
                                                    setDetailDialogOpen(true)
                                                }}
                                            >
                                                Ver Json
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </main>

            <NotificationDialogItem
                notification={selectedNotification}
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
            />
        </div>
    )
}

export default NotificacionesPage