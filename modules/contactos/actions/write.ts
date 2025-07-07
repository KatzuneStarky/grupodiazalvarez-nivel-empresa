import { WriteContactoResult } from "@/types/form-result/contacto-form-result";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { ContactInfo } from "@/modules/empresas/types/contactos";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export async function writeContacto(
    empresaId: string,
    contactoData: Omit<ContactInfo, "id">
): Promise<WriteContactoResult> {
    try {
        if (!contactoData || Object.keys(contactoData).length === 0) {
            throw new Error("Los datos del contacto no pueden estar vacíos.");
        }

        const uid = uuidv4();
        const contactoRef = doc(db, "empresas", empresaId, "contactos", uid);
        const empresaRef = doc(db, "empresas", empresaId)

        await updateDoc(empresaRef, {
            contactos: arrayUnion({
                ...contactoData,
                id: uid,
            }),
        });

        await setDoc(contactoRef, {
            ...contactoData,
            id: uid,
            empresaId: empresaId,
        });

        return {
            success: true,
            message: "Contacto registrado correctamente.",
        };
    } catch (error) {
        console.error("Error al registrar el contacto:", error);
        return {
            success: false,
            message: "Error al registrar el contacto.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}