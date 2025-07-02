import { WriteAreaResult } from "@/types/form-result/area-form-result";
import { doc, setDoc } from "firebase/firestore";
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
        const areaRef = doc(db, "areas", newId);
        await setDoc(areaRef, {
            ...areaData,
            id: newId,
            empresaId: empresaId,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
        })

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