import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { ContactInfo, ContactInfoInput } from "@/modules/empresas/types/contactos";
import { WriteContactoResult } from "@/types/form-result/contacto-form-result";
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

export const deleteContactoByEmail = async (empresaId: string, email: string) => {
    const contactoRef = collection(db, "empresas", empresaId, "contactos");
    const queryData = query(contactoRef, where("email", "==", email));
    const querySnapshot = await getDocs(queryData);

    if (querySnapshot.empty) {
        throw new Error("No se encontró el contacto");
    }
    const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(docSnap.ref)
    );

    await Promise.all(deletePromises);
    const empresaDocRef = doc(db, "empresas", empresaId);
    const empresaSnap = await getDoc(empresaDocRef);

    if (!empresaSnap.exists()) {
        throw new Error("Empresa no encontrada");
    }

    const empresaData = empresaSnap.data();
    const contactos: ContactInfo[] = empresaData.contactos || [];

    const updatedContactos = contactos.filter(
        (contacto) => contacto.email !== email
    );

    await updateDoc(empresaDocRef, {
        contactos: updatedContactos,
    });
}

export const updateContacto
    = async (empresaId: string, contacto: ContactInfoInput): Promise<{ success: boolean, message: string, error?: Error }> => {
        try {
            const contactoRef = collection(db, "empresas", empresaId, "contactos");
            const queryData = query(contactoRef, where("email", "==", contacto.email));
            const querySnapshot = await getDocs(queryData);

            if (querySnapshot.empty) {
                throw new Error("No se encontró el contacto");
            }
            const updatePromises = querySnapshot.docs.map((docSnap) =>
                updateDoc(docSnap.ref, {
                    ...contacto
                })
            );

            await Promise.all(updatePromises)
            const empresaDocRef = doc(db, "empresas", empresaId);
            const empresaSnap = await getDoc(empresaDocRef);

            if (!empresaSnap.exists()) {
                throw new Error("Empresa no encontrada");
            }

            const empresaData = empresaSnap.data();
            const contactos: ContactInfo[] = empresaData.contactos || [];

            const updatedContactos = contactos.map((c) =>
                c.email === contacto.email ? { ...c, ...contacto } : c
            );

            await updateDoc(empresaDocRef, {
                contactos: updatedContactos,
            });

            return {
                success: true,
                message: "Contacto actualizado satisfactoriamente"
            }
        } catch (error) {
            return {
                success: false,
                message: "Error al actualizar el contacto.",
                error: error instanceof Error ? error : new Error("Error desconocido")
            }
        }
    }