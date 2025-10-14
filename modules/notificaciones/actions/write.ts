import { NotificationInterface } from "../types/notifications";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid";

export const writeNotification = async (data: Omit<NotificationInterface, "id" | "icon" | "createdAt">) => {
    try {
        const newId = uuidv7()
        const now = new Date();

        if (!data.createdBy?.trim() || !data.createdBy)
            throw new Error("El usuario que crea la notificación es requerido");

        if (!data.title?.trim() || !data.title)
            throw new Error("El título de la notificación es requerido");

        const notificacionRef = doc(db, "notificaciones", newId)
        const notificacionDoc = {
            ...data,
            createdAt: now,
            id: newId
        }

        await setDoc(notificacionRef, notificacionDoc)
    } catch (error) {
        console.log(error);
    }
}