import { consumoSchema } from "../schema/consumo.schema";
import { ConsumoCombustible } from "../types/consumo";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid";

export const writeConsumo = async (data: Omit<ConsumoCombustible, "id" | "createdAt" | "updatedAt">):
    Promise<{ message: string, data?: ConsumoCombustible, success: boolean, error?: Error }> => {
    try {
        const newId = uuidv7()
        const now = new Date();

        const consumoSchemaData = consumoSchema.safeParse(data)
        if (!consumoSchemaData.success) {
            throw new Error(consumoSchemaData.error.message);
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Los datos del consumo no pueden estar vacíos.");
        }

        if (!data.equipoId || !data.operadorId || !data.viajeId) {
            throw new Error("El equipo, el operador y el viaje son obligatorios.");
        }

        const consumoRef = doc(db, "consumos", newId);
        const consumoData = {
            ...data,
            id: newId,
            createdAt: now,
            updatedAt: now
        }
        await setDoc(consumoRef, consumoData);

        return {
            message: "Consumo creado correctamente",
            data: consumoData,
            success: true
        }
    } catch (error) {
        console.log(error);
        return {
            message: "Error al crear el consumo",
            success: false,
            error: error as Error
        };
    }
}