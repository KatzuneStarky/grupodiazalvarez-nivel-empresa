import { TanquesSchema } from "../schemas/tanques.schema";
import { Tanque } from "../../bdd/equipos/types/tanque";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeTanque = async (tanqueData: Omit<Tanque, "id" | "createdAt" | "updatedAt">, equipoId: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const newId = uuidv4()
        const now = new Date();
        const tanqueSchema = TanquesSchema.safeParse(tanqueData)

        if (!tanqueSchema.success) {
            throw new Error(tanqueSchema.error.message);
        }

        if (!tanqueSchema || Object.keys(tanqueSchema).length === 0) {
            throw new Error("Los datos del tanque no pueden estar vacíos.");
        }

        if (!tanqueData.equipoId || tanqueData.equipoId.trim() === "") {
            throw new Error("El id del equipo es requerido.");
        }

        const tanqueRef = doc(db, "equipos", equipoId, "tanques", newId)

        const tanqueDoc = {
            ...tanqueData,
            id: newId,
            createdAt: now,
            updatedAt: now,
        }

        await setDoc(tanqueRef, tanqueDoc)

        return {
            success: true,
            message: "El tanque se ha creado correctamente",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al validar los datos",
            error: error as Error
        }
    }
}