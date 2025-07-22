import { doc, getDoc, setDoc } from "firebase/firestore";
import { RolUsuario } from "@/enum/user-roles";
import { db } from "@/firebase/client";

export const inviteNewUser = async (email: string): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        if (!email || email.trim() === "") {
            throw new Error("El email de la invitacion no puede estar vacio.");
        }

        const invitationRef = doc(db, "invitaciones", email);
        const invitationSnap = await getDoc(invitationRef);

        if (invitationSnap.exists()) {
            return {
                success: false,
                message: "Ya existe una invitación para este correo.",
            };
        }

        await setDoc(invitationRef, {
            email,
            rol: RolUsuario.usuario,
            creadaEn: new Date(),
            usada: false,
        });

        return {
            success: true,
            message: "Invitación registrada correctamente.",
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