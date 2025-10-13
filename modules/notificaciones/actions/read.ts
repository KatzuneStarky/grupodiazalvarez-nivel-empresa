import { db } from "@/firebase/client";
import { doc, collection, getDocs, writeBatch, runTransaction, query, where } from "firebase/firestore";

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
    const notificationRef = doc(db, "notificaciones", notificationId);

    try {
        await runTransaction(db, async (transaction) => {
            const notificationDoc = await transaction.get(notificationRef);
            if (!notificationDoc.exists()) throw new Error("La notificación no existe");

            const data = notificationDoc.data() as { readBy?: string[] };
            const readBy = data.readBy || [];

            if (!readBy.includes(userId)) {
                transaction.update(notificationRef, { readBy: [...readBy, userId] });
            }
        });
    } catch (error) {
        console.error("Error al marcar la notificación como leída: ", error);
        throw new Error("Error al marcar la notificación como leída");
    }
};

export const markAllNotificationsAsRead = async (userId: string) => {
    const notificationsRef = collection(db, "notificaciones");

    try {
        const snapshot = await getDocs(notificationsRef);
        const batch = writeBatch(db);

        snapshot.forEach((doc) => {
            const data = doc.data() as { readBy?: string[] };
            const readBy = data.readBy || [];
            if (!readBy.includes(userId)) {
                batch.update(doc.ref, { readBy: [...readBy, userId] });
            }
        });

        await batch.commit();
        console.log("Todas las notificaciones han sido marcadas como leídas");
    } catch (error) {
        console.error("Error al marcar todas las notificaciones como leídas: ", error);
        throw new Error("Error al marcar todas las notificaciones como leídas");
    }
};