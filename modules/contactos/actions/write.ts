import { WriteContactoResult } from "@/types/form-result/contacto-form-result";
import { ContactInfo } from "@/modules/empresas/types/contactos";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export async function WriteContacto(
    empresaId: string,
    conctatoData: Omit<ContactInfo, "id">
): Promise<WriteContactoResult> {
    try {
        if (!conctatoData || Object.keys(conctatoData).length === 0) {
            throw new Error("Los datos del contacto no pueden estar vacíos.");
        }

        const uid = uuidv4()
        const contactoRef = doc(db, "contactos", uid)

        await setDoc(contactoRef, {
            ...conctatoData,
            id: uid,
            empresaId: empresaId
        })

        return {
            success: true,
            message: "Contacto registrado correctamente."
        }
    } catch (error) {
        console.error("Error al registrar el contacto:", error);
        return {
            success: false,
            message: "Error al registrar el contacto.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}