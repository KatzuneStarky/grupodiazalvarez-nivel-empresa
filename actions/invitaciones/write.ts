import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { Invitacion } from "@/types/invitacion";
import { db } from "@/firebase/client";
import { v7 } from "uuid"

export const inviteNewUser = async (data: Omit<Invitacion, "id" | "creadaEn" | "expiraEn" | "usada">):
    Promise<{ success: boolean, message: string, resultId?: string, error?: Error }> => {
    try {
        const newId = v7()

        if (!data.email || data.email.trim() === "") {
            throw new Error("El email de la invitacion no puede estar vacio.");
        }

        const q = query(collection(db, "invitaciones"), where("email", "==", data.email), where("usada", "==", false));
        const existing = await getDocs(q);
        if (!existing.empty) {
            return {
                success: false,
                message: "Ya existe una invitación activa para este correo.",
            };
        }

        const invitationRef = doc(db, "invitaciones", newId);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        await setDoc(invitationRef, {
            id: newId,
            email: data.email,
            rol: data.rol,
            empresaId: data.empresaId,
            empresaName: data.empresaName,
            creadaEn: new Date(),
            expiraEn: expirationDate,
            usada: false,
        });

        return {
            success: true,
            message: "Invitación registrada correctamente.",
            resultId: newId
        };
    } catch (error) {
        console.error("Error al registrar la invitación:", error);
        return {
            success: false,
            message: "Error al registrar la invitación.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}