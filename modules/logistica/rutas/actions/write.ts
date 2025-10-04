import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { RutaSchema } from "../schemas/ruta.schema";
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

export const updateRoute = async (rutaData: Omit<Ruta, "id" | "createdAt" | "updatedAt">, rutaId: string): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const rutaSchema = RutaSchema.safeParse(rutaData)

        if (!rutaSchema.success) {
            throw new Error(rutaSchema.error.message);
        }

        if (!rutaData || Object.keys(rutaData).length === 0) {
            throw new Error("Los datos de la ruta no pueden estar vacíos.");
        }

        if (!rutaId || rutaId.trim() === "") {
            throw new Error("El ID de la ruta es requerido.");
        }

        const rutaRef = doc(db, "rutas", rutaId)
        const rutaDoc = {
            ...rutaData,
            updatedAt: new Date(),
        }

        await updateDoc(rutaRef, rutaDoc)

        return {
            success: true,
            message: "La ruta se ha actualizado correctamente",
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

export const deleteRoute = async (rutaId: string): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        if (!rutaId || rutaId.trim() === "") {
            throw new Error("El ID de la ruta es requerido.");
        }

        const rutaRef = doc(db, "rutas", rutaId)

        await deleteDoc(rutaRef)

        return {
            success: true,
            message: "La ruta se ha eliminado correctamente",
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