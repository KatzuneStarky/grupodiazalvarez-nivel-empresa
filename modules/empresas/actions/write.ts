import { createDefaultAreaMenus } from "@/modules/menus/functions/generate-defaul-menus";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { WriteEmpresaResult } from "@/types/form-result/empresa-form-result";
import { deleteFolderContents } from "@/actions/folder/write";
import { Empresa } from "../types/empresas";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export async function writeEmpresa(
    empresaData:
        Omit<Empresa, "id" | "fechaCreacion" | "fechaActualizacion">
): Promise<WriteEmpresaResult> {
    try {
        if (!empresaData || Object.keys(empresaData).length === 0) {
            throw new Error("Los datos de la empresa no pueden estar vacíos.");
        }

        const empresaId = uuidv4();
        const empresaRef = doc(db, "empresas", empresaId);
        const now = new Date();
        const nowISO = now.toISOString();

        await setDoc(empresaRef, {
            ...empresaData,
            fechaCreacion: nowISO,
            fechaActualizacion: nowISO,
        });

        if (empresaData.contactos?.length > 0) {
            const contactoWrites = empresaData.contactos.map((contacto) => {
                const contactoId = uuidv4();
                const contactoRef = doc(
                    collection(db, `empresas/${empresaId}/contactos`),
                    contactoId
                );

                return setDoc(contactoRef, {
                    ...contacto,
                    id: contactoId,
                    empresaId,
                });
            });

            await Promise.all(contactoWrites);
        }

        if (empresaData.areas && empresaData.areas.length > 0) {
            for (const area of empresaData.areas) {
                const areaId = uuidv4();
                const areaRef = doc(db, "empresas", empresaId, "areas", areaId);

                const defaultMenus = createDefaultAreaMenus(empresaData.nombre, areaId, area.nombre);

                await setDoc(areaRef, {
                    ...area,
                    id: areaId,
                    empresaId,
                    fechaCreacion: now,
                    fechaActualizacion: now,
                    menus: defaultMenus,
                });

                for (const menu of defaultMenus) {
                    const menuRef = doc(db, "empresas", empresaId, "areas", areaId, "menus", menu.id);
                    await setDoc(menuRef, menu);
                }
            }
        }

        return {
            success: true,
            message: "Registro de empresa generado correctamente.",
        };
    } catch (error) {
        console.error("Error al registrar la empresa:", error);
        return {
            success: false,
            message: "Error al registrar la empresa.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}

export const deleteEmpresaById = async (empresaId: string, empresaName: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const empresaRef = doc(db, "empresas", empresaId);
        const areasRef = collection(empresaRef, "areas");
        const contactosRef = collection(empresaRef, "contactos");

        const areasSnapshot = await getDocs(areasRef);
        const areaDeletes = areasSnapshot.docs.map((areaDoc) =>
            deleteDoc(areaDoc.ref)
        );
        await Promise.all(areaDeletes);

        const contactosSnapshot = await getDocs(contactosRef);
        const contactoDeletes = contactosSnapshot.docs.map((contactoDoc) =>
            deleteDoc(contactoDoc.ref)
        );
        await Promise.all(contactoDeletes);

        await deleteFolderContents(`/empresas/${empresaName}`)
        await deleteDoc(empresaRef);

        return {
            success: false,
            message: "Empresa eliminada correctamente."
        };
    } catch (error) {
        console.error("Error al eliminar la empresa:", error);
        return {
            success: false,
            message: "Error al eliminar la empresa.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}