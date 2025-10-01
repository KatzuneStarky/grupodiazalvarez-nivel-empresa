import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { Clientes } from "../../bdd/clientes/types/clientes";
import { ClienteSchema } from "../schemas/client.schema";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const WriteCliente = async (clienteData: Omit<Clientes, "id" | "createdAt" | "updatedAt">):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const newId = uuidv4()
        const now = new Date();

        const clienteSchema = ClienteSchema.safeParse(clienteData)
        if (!clienteSchema.success) {
            throw new Error(clienteSchema.error.message);
        }

        if (!clienteData || Object.keys(clienteData).length === 0) {
            throw new Error("Los datos del cliente no pueden estar vacíos.");
        }

        if (!clienteData.nombreFiscal || clienteData.nombreFiscal.trim() === "") {
            throw new Error("El nombre fiscal del cliente es requerido.");
        }

        const clientesRef = doc(db, "clientes", newId)
        const clienteDoc = {
            ...clienteData,
            id: newId,
            createdAt: now,
            updatedAt: now,
        }

        await setDoc(clientesRef, clienteDoc)

        return {
            success: true,
            message: "Cliente guardado con éxito"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al guardar el cliente",
            error: error as Error
        }
    }
}

export const UpdateCliente = async (clienteData: Omit<Clientes, "id" | "createdAt" | "updatedAt">, clienteId: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const now = new Date();

        const clienteSchema = ClienteSchema.safeParse(clienteData)
        if (!clienteSchema.success) {
            throw new Error(clienteSchema.error.message);
        }

        if (!clienteData || Object.keys(clienteData).length === 0) {
            throw new Error("Los datos del cliente no pueden estar vacíos.");
        }

        if (!clienteData.nombreFiscal || clienteData.nombreFiscal.trim() === "") {
            throw new Error("El nombre fiscal del cliente es requerido.");
        }

        const clientesRef = doc(db, "clientes", clienteId)
        const clienteDoc = {
            ...clienteData,
            updatedAt: now,
        }

        await updateDoc(clientesRef, clienteDoc)

        return {
            success: true,
            message: "Cliente actualizado con éxito"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al actualizar el cliente",
            error: error as Error
        }
    }
}

export const DeleteCliente = async (clienteId: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const clientesRef = doc(db, "clientes", clienteId)
        await deleteDoc(clientesRef)

        return {
            success: true,
            message: "Cliente eliminado con éxito"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al eliminar el cliente",
            error: error as Error
        }
    }
}