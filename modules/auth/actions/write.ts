import { WriteUserResult } from "@/types/form-result/user-form-result";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { RolUsuario } from "@/enum/user-roles";
import { SystemUser } from "@/types/usuario";
import { db } from "@/firebase/client";

export async function writeUser(
    uid: string,
    userData: Omit<SystemUser, "id" | "creadoEn" | "actualizadoEn" | "ultimoAcceso">,
    email: string,
    invitacionId: string
): Promise<WriteUserResult> {
    try {
        if (!userData || Object.keys(userData).length === 0) {
            throw new Error("Los datos del usuario no pueden estar vacíos.");
        }

        const invitacionRef = doc(db, "invitaciones", invitacionId)
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

        await updateDoc(doc(db, "invitaciones", invitacionId), { usada: true });

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

export const updateRolUsuario = async (uid: string, rol: RolUsuario):
    Promise<{ success: boolean, message: string, nuevoRol?: RolUsuario, error?: Error }> => {
    try {
        if (!uid) {
            throw new Error("El uid no puede estar vacio.");
        }

        const userRef = doc(db, "usuarios", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return {
                success: false,
                message: "No se encontró el usuario.",
            };
        }

        await updateDoc(userRef, {
            rol: rol,
            actualizadoEn: new Date().toISOString(),
        });

        return {
            success: true,
            message: "Rol de usuario modificado satisfactoriamente",
            nuevoRol: rol,
        };
    } catch (error) {
        console.error("Error al modificar el rol de usuario:", error);
        return {
            success: false,
            message: "Error al modificar el rol de usuario.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}