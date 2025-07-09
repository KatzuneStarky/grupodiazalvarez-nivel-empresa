import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { WriteAreaResult } from "@/types/form-result/area-form-result";
import { AreaInput } from "@/types/area";
import { db } from "@/firebase/client";
import { Area } from "../types/areas";
import { v4 as uuidv4 } from "uuid";

export async function writeArea(
    empresaId: string,
    areaData: Omit<Area, "id" | "fechaCreacion" | "fechaActualizacion">
): Promise<WriteAreaResult> {
    try {
        if (!areaData || Object.keys(areaData).length === 0) {
            throw new Error("Los datos del area no pueden estar vacíos.");
        }

        const newId = uuidv4()
        const areaRef = doc(db, "empresas", empresaId, "areas", newId);
        const empresaRef = doc(db, "empresas", empresaId)

        await updateDoc(empresaRef, {
            areas: arrayUnion({
                ...areaData,
                id: newId,
            }),
        });

        await setDoc(areaRef, {
            ...areaData,
            id: newId,
            empresaId: empresaId,
        });

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

export const updateArea = async(empresaId: string, area: AreaInput): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        return {
            success: true,
            message: ""
        }
    } catch (error) {
        return {
            success: false,
            message: "",
            error: error instanceof Error ? error : new Error("Error desconocido")
        }
    }
}

export const deleteArea = async() => {

}