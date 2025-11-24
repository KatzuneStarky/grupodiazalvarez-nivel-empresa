import { db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";

export const updateUserProfile = async (uid: string, data: { nombre: string }) => {
    try {
        const userRef = doc(db, "usuarios", uid);
        await updateDoc(userRef, {
            nombre: data.nombre,
            actualizadoEn: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error };
    }
};
