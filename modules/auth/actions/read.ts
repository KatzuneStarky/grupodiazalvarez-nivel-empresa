import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export const getUserById = async (uid: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const userRef = doc(db, "usuarios", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return {
                success: false,
                message: "No se encontró el usuario.",
            };
        }
        const userData = userSnap.data();
        return {
            success: true,
            message: "Usuario encontrado.",
        };
    } catch (error) {
        console.error("Error al encontrar al usuario:", error);
        return {
            success: false,
            message: "Error al encontrar al usuario.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}