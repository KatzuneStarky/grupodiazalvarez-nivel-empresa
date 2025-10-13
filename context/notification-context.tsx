"use client"

import { markAllNotificationsAsRead, markNotificationAsRead } from "@/modules/notificaciones/actions/read";
import { NotificationsContextProps } from "@/modules/notificaciones/types/notifications-context";
import { useAllNotifications } from "@/modules/notificaciones/hooks/use-notificaciones";
import { NotificationInterface } from "@/modules/notificaciones/types/notifications";
import { createContext, useContext, useEffect, useState } from "react";
import { SystemUser } from "@/types/usuario";
import { useAuth } from "./auth-context";
import { useArea } from "./area-context";

const NotificationContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider
    = ({ children }: { children: React.ReactNode }) => {
        const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
        const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
        const { notifications: fetchedNotifications } = useAllNotifications({})

        const { userBdd } = useAuth()
        const { area } = useArea()

        const fetchNotifications = async () => {
            if (!area?.id) return;
            setNotifications(fetchedNotifications);
        };

        useEffect(() => {
            if (!userBdd?.id) return;
            setCurrentUser(userBdd)
        }, [userBdd]);

        useEffect(() => {
            fetchNotifications();
        }, [area?.id]);

        const markAsRead = async (id: string) => {
            if (!currentUser?.id) return;
            await markNotificationAsRead(id, userBdd?.id || "");
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, readBy: Array.from(new Set([...notif.readBy, userBdd?.id || ""])) } : notif
                )
            );
        };

        const markAllAsRead = async () => {
            if (!currentUser?.id) return;
            await markAllNotificationsAsRead(userBdd?.id || "");
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, readBy: Array.from(new Set([...notif.readBy, userBdd?.id || ""])) }))
            );
        };

        const unreadCount = notifications.filter((notif) => !notif.readBy.includes(currentUser?.id || "")).length;
        const sortedNotifications = [...notifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return (
            <NotificationContext.Provider
                value={{
                    notifications: sortedNotifications,
                    unreadCount,
                    currentUser,
                    markAllAsRead,
                    markAsRead,
                    reloadNotifications: fetchNotifications,
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