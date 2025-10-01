import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Operador } from "../../bdd/operadores/types/operadores"
import { OperadoresSchema } from "../schemas/operadores.schema";
import { deleteFolderContents } from "@/actions/folder/write";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeOperador = async (data: Omit<Operador, "id" | "createdAt" | "updatedAt">):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const newId = uuidv4()
        const now = new Date();
        const operadorSchema = OperadoresSchema.safeParse(data)
        if (!operadorSchema.success) {
            throw new Error(operadorSchema.error.message);
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Los datos del operador no pueden estar vacíos.");
        }

        if (!data.nombres || data.nombres.trim() === "") {
            throw new Error("El nombre del operador es requerido.");
        }

        const operadorRef = doc(db, "operadores", newId)
        const operadorDoc = {
            ...data,
            id: newId,
            createdAt: now,
            updatedAt: now,
        }

        await setDoc(operadorRef, operadorDoc)

        return {
            success: true,
            message: "El operador se ha creado correctamente",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al validar los datos",
            error: error as Error
        }
    }

}

export const updateOperador = async (data: Omit<Operador, "id" | "createdAt" | "updatedAt">, operadorId: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const now = new Date();
        const operadorSchema = OperadoresSchema.safeParse(data)
        if (!operadorSchema.success) {
            throw new Error(operadorSchema.error.message);
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Los datos del operador no pueden estar vacíos.");
        }

        if (!data.nombres || data.nombres.trim() === "") {
            throw new Error("El nombre del operador es requerido.");
        }

        const operadorRef = doc(db, "operadores", operadorId)
        const operadorDoc = {
            ...data,
            updatedAt: now,
        }

        await updateDoc(operadorRef, operadorDoc)

        return {
            success: true,
            message: "El operador se ha actualizado correctamente",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al validar los datos",
            error: error as Error
        }
    }

}

export const deleteOperador = async (operadorId: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const operadorRef = doc(db, "operadores", operadorId)
        const operadorDoc = await getDoc(operadorRef)
        
        if (!operadorDoc.exists()) {
            throw new Error("El operador no existe");
        }
        await deleteFolderContents(`/operador/${operadorId}`)
        await deleteDoc(operadorRef)

        return {
            success: true,
            message: "El operador se ha eliminado correctamente",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al eliminar el operador",
            error: error as Error
        }
    }

}