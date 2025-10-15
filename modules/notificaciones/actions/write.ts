import { NotificationInterface } from "../types/notifications";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid";

export const writeNotification = async (data: Omit<NotificationInterface, "id" | "icon" | "createdAt">):
    Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
        const newId = uuidv7()
        const now = new Date();

        if (!data.createdBy?.trim() || !data.createdBy)
            throw new Error("El usuario que crea la notificación es requerido");

        if (!data.title?.trim() || !data.title)
            throw new Error("El título de la notificación es requerido");

        const cleanData = Object.fromEntries(
            Object.entries({
                ...data,
                createdAt: now,
                id: newId,
            }).filter(([_, v]) => v !== undefined)
        );

        console.log("🟡 Guardando notificación:", cleanData);

        const notificacionRef = doc(db, "notificaciones", newId);
        await setDoc(notificacionRef, cleanData);

        console.log("✅ Notificación guardada con éxito:", newId);

        return { success: true, id: newId };
    } catch (error) {
        console.error("❌ Error al guardar la notificación:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}