"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getNotificationTypeIcon } from "@/functions/get-notification-type-icon"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { NotificationInterface } from "../types/notifications"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/global/icon"
import { es } from "date-fns/locale"

interface NotificationDetailDialogProps {
    notification: NotificationInterface | null
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const NotificationDialogItem = ({
    notification,
    onOpenChange,
    open
}: NotificationDetailDialogProps) => {
    if (!notification) return null
    const icon = getNotificationTypeIcon(notification.type)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] h-full">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Icon iconName={icon || ""} className="h-5 w-5" />
                        <DialogTitle>{notification.title}</DialogTitle>
                    </div>
                    <DialogDescription className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="capitalize">
                            {notification.type}
                        </Badge>
                        {notification.priority && (
                            <Badge variant={notification.priority === "high" ? "destructive" : "secondary"} className="capitalize">
                                Prioridad{" "}
                                {notification.priority === "high" ? "alta" : "baja"}
                            </Badge>
                        )}
                        {notification.systemGenerated && <Badge variant="secondary">System Generated</Badge>}
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(parseFirebaseDate(notification.createdAt), { addSuffix: true, locale: es })}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] p-4">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Notificacion</h4>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                    </div>

                    {notification.actionUrl && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Action URL</h4>
                            <a
                                href={notification.actionUrl}
                                className="text-sm text-blue-500 hover:underline break-all"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {notification.actionUrl}
                            </a>
                        </div>
                    )}

                    {notification && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Datos de la notificacion</h4>
                            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                                {notification.dialogData ? JSON.stringify(JSON.parse(notification.dialogData), null, 2) : "No hay datos para mostrar"}
                            </pre>
                        </div>
                    )}

                    <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">Notificacion completa</h4>
                        <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                            {JSON.stringify({
                                ...notification,
                                dialogData: "",
                                priority: notification.priority === "low" ? "baja" : notification.priority === "medium" ? "media" : "baja",
                                createdAt: format(parseFirebaseDate(notification.createdAt), "PPP", { locale: es }),
                            }, null, 2)}
                        </pre>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default NotificationDialogItem