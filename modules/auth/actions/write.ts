import { WriteUserResult } from "@/types/form-result/user-form-result";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { RolUsuario } from "@/enum/user-roles";
import { SystemUser } from "@/types/usuario";
import { db } from "@/firebase/client";

export async function writeUser(
    uid: string,
    userData: Omit<SystemUser, "id" | "creadoEn" | "actualizadoEn" | "ultimoAcceso">,
    email: string
): Promise<WriteUserResult> {
    try {
        if (!userData || Object.keys(userData).length === 0) {
            throw new Error("Los datos del usuario no pueden estar vacíos.");
        }

        const invitacionRef = doc(db, "invitaciones", email)
        const invitacionDoc = await getDoc(invitacionRef)
        const rol = invitacionDoc.exists() ? invitacionDoc.data().rol : RolUsuario.usuario;

        const userRef = doc(db, "usuarios", uid);

        await setDoc(userRef, {
            ...userData,
            uidFirebase: uid,
            estado: "activo",
            rol: rol as RolUsuario,
            creadoEn: new Date().toISOString(),
            actualizadoEn: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString(),
        });

        await updateDoc(doc(db, "invitaciones", email), { usada: true });

        return {
            success: true,
            message: "Usuario registrado correctamente.",
            rol: rol as RolUsuario
        };
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return {
            success: false,
            message: "Error al registrar el usuario.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}