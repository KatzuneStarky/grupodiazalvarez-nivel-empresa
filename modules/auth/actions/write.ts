import { WriteUserResult } from "@/types/form-result/user-form-result";
import { doc, setDoc } from "firebase/firestore";
import { SystemUser } from "@/types/usuario";
import { db } from "@/firebase/client";

export async function writeUser(
    uid: string,
    userData: Omit<SystemUser, "id" | "creadoEn" | "actualizadoEn" | "ultimoAcceso">,
): Promise<WriteUserResult> {
    try {
        if (!userData || Object.keys(userData).length === 0) {
            throw new Error("Los datos del usuario no pueden estar vacíos.");
        }

        const userRef = doc(db, "usuarios", uid);

        await setDoc(userRef, {
            ...userData,
            uidFirebase: uid,
            estado: "activo",
            creadoEn: new Date().toISOString(),
            actualizadoEn: new Date().toISOString(),
            ultimoAcceso: new Date().toISOString(),
        });

        return {
            success: true,
            message: "Usuario registrado correctamente.",
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