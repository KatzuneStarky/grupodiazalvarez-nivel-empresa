"use client"

import { getNotificationTypeIcon } from "@/functions/get-notification-type-icon"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { NotificationInterface } from "../types/notifications"
import { formatDistanceToNow } from "date-fns"
import Icon from "@/components/global/icon"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
    notification: NotificationInterface
    currentUserId: string
    onClick?: (event: React.MouseEvent) => void
    showFullMessage?: boolean
}

const priorityColors = {
    low: "text-muted-foreground",
    medium: "text-blue-500",
    high: "text-destructive",
}

const NotificationItem = ({
    notification,
    currentUserId,
    onClick,
    showFullMessage = false,
}: NotificationItemProps) => {
    const isUnread = !notification.readBy.includes(currentUserId)
    const priorityColor =
        notification.priority
            ? priorityColors[notification.priority]
            : priorityColors.medium

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-4 hover:bg-accent transition-colors focus:outline-none focus:bg-accent",
                isUnread && "bg-muted/50",
            )}
            aria-label={`${notification.title}. ${isUnread ? "Unread" : "Read"}`}
        >
            <div className="flex gap-3">
                <div className={cn("flex-shrink-0 mt-0.5", priorityColor)}>
                    <Icon iconName={`${getNotificationTypeIcon(notification.type)}`} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn("text-sm font-medium leading-tight", isUnread && "font-semibold")}>
                            {notification.title}
                        </h4>
                        {isUnread && <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" aria-label="Unread" />}
                    </div>

                    <p className={cn("text-sm text-muted-foreground leading-snug", !showFullMessage && "line-clamp-2")}>
                        {notification.message}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground capitalize">
                        <time dateTime={parseFirebaseDate(notification.createdAt).toString()}>
                            {formatDistanceToNow(parseFirebaseDate(notification.createdAt), {
                                addSuffix: true,
                                locale: es
                            })}
                        </time>
                        {notification.priority && notification.priority !== "medium" && (
                            <>
                                <span aria-hidden="true">•</span>
                                <span className={cn("capitalize", priorityColor)}>
                                    Prioridad{" "}
                                    {notification.priority === "high" ? "alta" : "baja"}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </button>
    )
}

export default NotificationItem