import { DocumentData, QueryDocumentSnapshot, collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { NotificationInterface } from "../types/notifications";
import { NotificationType } from "../enum/notification-type";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/firebase/client";

interface UseNotificationsOptions {
    type?: NotificationType;
    itemsPerPage?: number;
}

export const useAllNotifications = ({ type, itemsPerPage }: UseNotificationsOptions) => {
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const fetchNotifications = useCallback(async (startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
        if (!hasMore) return;

        try {
            const notificationsRef = collection(db, "notificaciones");
            let q = query(
                notificationsRef,
                orderBy("createdAt", "desc"),
            );

            if (type) q = query(q, where("type", "==", type));

            if (startAfterDoc) q = query(q, startAfter(startAfterDoc));

            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const fetched: NotificationInterface[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<NotificationInterface, "id">),
                readBy: (doc.data() as any).readBy || [],
            }));

            setNotifications((prev) => (startAfterDoc ? [...prev, ...fetched] : fetched));
            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError(err instanceof Error ? err.message : "Error fetching notifications");
            setLoading(false);
        }
    }, [type, itemsPerPage, hasMore]);

    useEffect(() => {
        setNotifications([]);
        setHasMore(true);
        setLoading(true);
        fetchNotifications();
    }, [type, fetchNotifications]);

    const loadMore = () => {
        if (lastVisible) fetchNotifications(lastVisible);
    };


    return {
        notifications,
        loading,
        error,
        hasMore,
        loadMore,
    };
};