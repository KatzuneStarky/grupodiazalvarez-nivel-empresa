import { doc, setDoc } from "firebase/firestore";
import { Mecanico } from "../../types/mecanico";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid"

export const writeMecanico = async (data: Omit<Mecanico, "id" | "createdAt" | "updatedAt">):
    Promise<{ success: boolean; data?: Mecanico; message: string; error?: Error }> => {
    try {
        const now = new Date()
        const id = uuidv7()

        if (data.nombre.trim() === "" || data.apellidos.trim() === "") {
            return {
                success: false,
                message: "El nombre y los apellidos son obligatorios",
            }
        }

        const mecanicoRef = doc(db, "mecanicos", id)
        const mecanicoDoc = {
            ...data,
            id,
            createdAt: now,
            updatedAt: now
        }

        await setDoc(mecanicoRef, mecanicoDoc)

        return {
            success: true,
            message: "Mecanico escrito correctamente",
            data: mecanicoDoc
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al escribir el mecanico",
            error: error as Error
        }
    }
}