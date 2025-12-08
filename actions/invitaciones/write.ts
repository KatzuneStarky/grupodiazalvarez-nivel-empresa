import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
            ...(data.areaId && { areaId: data.areaId }),
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

export const updateUsedInvitation = async (invitationId: string): Promise<{ success: boolean, message: string }> => {
    try {
        const invitationRef = doc(db, "invitaciones", invitationId);
        const invitationSnap = await getDoc(invitationRef);

        if (!invitationSnap.exists()) {
            return {
                success: false,
                message: "La invitación no existe.",
            };
        }

        await setDoc(invitationRef, { usada: true }, { merge: true });

        return {
            success: true,
            message: "Invitación marcada como usada correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar la invitación:", error);
        return {
            success: false,
            message: "Error al actualizar la invitación.",
        };
    }
};

export const deleteInvitation = async (invitationId: string): Promise<{ success: boolean, message: string }> => {
    try {
        const invitationRef = doc(db, "invitaciones", invitationId);
        await deleteDoc(invitationRef);

        return {
            success: true,
            message: "Invitación eliminada correctamente.",
        };
    } catch (error) {
        console.error("Error al eliminar la invitación:", error);
        return {
            success: false,
            message: "Error al eliminar la invitación.",
        };
    }
};