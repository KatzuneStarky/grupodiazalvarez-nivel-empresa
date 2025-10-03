import { EstacionDeServicioSchema } from "../schemas/estacion-servicio.schema";
import { EstacionServicio } from "../types/estacion";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeEstacion = async (
    dataEstacion: Omit<EstacionServicio, "id" | "createdAt" | "updatedAt">
): Promise<{ message: string, success: boolean, error?: string }> => {
    try {
        const newId = uuidv4()
        const now = new Date();

        const estacionSchema = EstacionDeServicioSchema.safeParse(dataEstacion)
        if (!estacionSchema.success) {
            const errorMessages = estacionSchema.error.errors.map(err => err.message).join(", ");
            throw new Error(`Errores de validación: ${errorMessages}`);
        }

        if (!dataEstacion || Object.keys(dataEstacion).length === 0) {
            throw new Error("Los datos de la estación no pueden estar vacíos.");
        }

        if (!dataEstacion.nombre || dataEstacion.nombre.trim() === "") {
            throw new Error("El nombre de la estación es requerido.");
        }

        const estacionesRef = doc(db, "estacionServicio", newId)
        const estacionDoc = {
            ...dataEstacion,
            id: newId,
            createdAt: now,
            updatedAt: now,
        }

        await setDoc(estacionesRef, estacionDoc)
        return {
            message: "Estación de servicio guardada con éxito",
            success: true
        }
    } catch (error) {
        console.log(error);
        return {
            message: "Error al guardar la estación de servicio",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

export const updateEstacion = async (dataEstacion: Omit<EstacionServicio, "id" | "createdAt" | "updatedAt">, estacionId: string):
    Promise<{ message: string, success: boolean, error?: string }> => {
    try {
        const estacionSchema = EstacionDeServicioSchema.safeParse(dataEstacion)
        if (!estacionSchema.success) {
            const errorMessages = estacionSchema.error.errors.map(err => err.message).join(", ");
            throw new Error(`Errores de validación: ${errorMessages}`);
        }

        if (!dataEstacion || Object.keys(dataEstacion).length === 0) {
            throw new Error("Los datos de la estación no pueden estar vacíos.");
        }

        if (!dataEstacion.nombre || dataEstacion.nombre.trim() === "") {
            throw new Error("El nombre de la estación es requerido.");
        }

        const estacionesRef = doc(db, "estacionServicio", estacionId)
        const estacionDoc = {
            ...dataEstacion,
            updatedAt: new Date(),
        }

        await updateDoc(estacionesRef, estacionDoc)

        return {
            message: "Estación de servicio actualizada con éxito",
            success: true
        }
    } catch (error) {
        console.log(error);
        return {
            message: "Error al actualizar la estación de servicio",
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}