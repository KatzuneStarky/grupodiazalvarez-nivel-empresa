import { RutaSchema } from "../schemas/ruta.schema";
import { doc, setDoc } from "firebase/firestore";
import { Ruta } from "../../equipos/types/rutas";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeRoute = async (rutaData: Omit<Ruta, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const newId = uuidv4()
        const now = new Date();
        const rutaSchema = RutaSchema.safeParse(rutaData)

        if (!rutaSchema.success) {
            throw new Error(rutaSchema.error.message);
        }

        if (!rutaData || Object.keys(rutaData).length === 0) {
            throw new Error("Los datos de la ruta no pueden estar vacíos.");
        }

        if (!rutaData.idCliente || rutaData.idCliente.trim() === "") {
            throw new Error("El ID del cliente es requerido.");
        }

        const rutaRef = doc(db, "rutas", newId)
        const rutaDoc = {
            ...rutaData,
            id: newId,
            createdAt: now,
            updatedAt: now,
        }

        await setDoc(rutaRef, rutaDoc)

        return {
            success: true,
            message: "La ruta se ha creado correctamente",
        }
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error instanceof Error ? error.message : "Error desconocido",
            error: error as Error
        }
    }
}