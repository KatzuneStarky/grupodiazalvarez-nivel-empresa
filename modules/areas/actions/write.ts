import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { createDefaultAreaMenus } from "@/modules/menus/functions/generate-defaul-menus";
import { WriteAreaResult } from "@/types/form-result/area-form-result";
import { AreaInput } from "@/types/area";
import { db } from "@/firebase/client";
import { Area } from "../types/areas";
import { v4 as uuidv4 } from "uuid";

export async function writeArea(
    empresaId: string,
    empresaNombre: string,
    areaData: Omit<Area, "id" | "fechaCreacion" | "fechaActualizacion" | "menus">
): Promise<WriteAreaResult> {
    try {
        if (!areaData || Object.keys(areaData).length === 0) {
            throw new Error("Los datos del area no pueden estar vacíos.");
        }

        const newId = uuidv4()
        const areaRef = doc(db, "empresas", empresaId, "areas", newId);
        const empresaRef = doc(db, "empresas", empresaId)

        const now = new Date();
        const defaultMenus = createDefaultAreaMenus(empresaNombre, newId, areaData.nombre);

        await updateDoc(empresaRef, {
            areas: arrayUnion({
                id: newId,
                nombre: areaData.nombre,
                descripcion: areaData.descripcion || "",
                correoContacto: areaData.correoContacto || "",
                responsableId: areaData.responsableId || "",
                empresaId: empresaId,
                fechaCreacion: now,
                fechaActualizacion: now,
                menus: defaultMenus
            }),
        });

        const areaDoc = {
            ...areaData,
            id: newId,
            empresaId,
            fechaCreacion: now,
            fechaActualizacion: now,
        };

        await setDoc(areaRef, areaDoc);

        for (const menu of defaultMenus) {
            const menuRef = doc(db, "empresas", empresaId, "areas", newId, "menus", menu.id);
            await setDoc(menuRef, menu);
        }

        return {
            success: true,
            message: "Registro de area generado correctamente.",
        }
    } catch (error) {
        console.error("Error al registrar el area:", error);
        return {
            success: false,
            message: "Error al registrar el area.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}

export const updateArea = async (empresaId: string, currentEmail: string, area: AreaInput):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const areaRef = collection(db, "empresas", empresaId, "areas");
        const queryData = query(
            areaRef,
            where("correoContacto", "==", currentEmail)
        );
        const querySnapshot = await getDocs(queryData);

        if (querySnapshot.empty) {
            throw new Error("No se encontró el area");
        }

        const updatePromises = querySnapshot.docs.map((docSnap) =>
            updateDoc(docSnap.ref, {
                ...area
            })
        );

        await Promise.all(updatePromises)
        const empresaDocRef = doc(db, "empresas", empresaId);
        const empresaSnap = await getDoc(empresaDocRef);

        if (!empresaSnap.exists()) {
            throw new Error("Empresa no encontrada");
        }

        const empresaData = empresaSnap.data();
        const areas: AreaInput[] = empresaData.areas || [];

        const updatedAreas = areas.map((a) =>
            a.correoContacto === currentEmail
                ? { ...a, ...area }
                : a
        );

        await updateDoc(empresaDocRef, {
            areas: updatedAreas,
        });

        return {
            success: true,
            message: "Area actualizada correctamente."
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al actualizar el area.",
            error: error instanceof Error ? error : new Error("Error desconocido")
        }
    }
}

export const deleteAreaByEmail = async (empresaId: string, email: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const areaRef = collection(db, "empresas", empresaId, "areas");
        const queryData = query(areaRef, where("correoContacto", "==", email));
        const querySnapshot = await getDocs(queryData);

        if (querySnapshot.empty) {
            throw new Error("No se encontró el area");
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
        const areas: AreaInput[] = empresaData.areas || [];

        const updatedAreas = areas.filter(
            (a) => a.correoContacto !== email
        );

        await updateDoc(empresaDocRef, {
            areas: updatedAreas,
        });

        return {
            success: true,
            message: "Area eliminada correctamente."
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al eliminar el area.",
            error: error instanceof Error ? error : new Error("Error desconocido")
        }
    }
}