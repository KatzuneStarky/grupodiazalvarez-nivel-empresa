"use client"

import { markAllNotificationsAsRead, markNotificationAsRead } from "@/modules/notificaciones/actions/read";
import { NotificationsContextProps } from "@/modules/notificaciones/types/notifications-context";
import { useAllNotifications } from "@/modules/notificaciones/hooks/use-notificaciones";
import { NotificationInterface } from "@/modules/notificaciones/types/notifications";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { useArea } from "./area-context";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";

const NotificationContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider
    = ({ children }: { children: React.ReactNode }) => {
        const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
        const { notifications: fetchedNotifications, hasMore, loadMore } = useAllNotifications({})

        const { userBdd } = useAuth()
        
        const { area } = useArea()

        const fetchNotifications = async () => {
            if (!area?.id) return;
            setNotifications(fetchedNotifications);
        };

        useEffect(() => {
            fetchNotifications();
        }, [area?.id]);

        const markAsRead = async (id: string) => {
            if (!userBdd?.uidFirebase) return;
            await markNotificationAsRead(id, userBdd?.uidFirebase || "");
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, readBy: Array.from(new Set([...notif.readBy, userBdd?.uidFirebase || ""])) } : notif
                )
            );
        };

        const markAllAsRead = async () => {
            if (!userBdd?.uidFirebase) return;
            await markAllNotificationsAsRead(userBdd?.uidFirebase || "");
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, readBy: Array.from(new Set([...notif.readBy, userBdd?.uidFirebase || ""])) }))
            );
        };

        const unreadCount = notifications.filter((notif) => !notif.readBy.includes(userBdd?.uidFirebase || "")).length;
        const sortedNotifications = [...notifications].sort((a, b) => parseFirebaseDate(b.createdAt).getTime() - parseFirebaseDate(a.createdAt).getTime());

        return (
            <NotificationContext.Provider
                value={{
                    notifications: sortedNotifications,
                    unreadCount,
                    currentUser: userBdd,
                    markAllAsRead,
                    markAsRead,
                    reloadNotifications: fetchNotifications,
                    hasMore,
                    loadMore
                }}
            >
                {children}
            </NotificationContext.Provider>
        );
    }

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within a NotificationsProvider");
    return context;
};