import { EquiposSchema } from "../schemas/equipo.schema";
import { Equipo } from "../../bdd/equipos/types/equipos";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeEquipo = async (
    equipoData: Omit<Equipo, "id" | "createdAt" | "updatedAt" | "tanque" | "mantenimiento" | "Revisiones" | "archivos" | "Certificado" | "ArchivosVencimiento">
): Promise<{ success: boolean, message: string, id?: string, error?: Error }> => {
    try {
        const newId = uuidv4()
        const now = new Date();
        const equipoSchema = EquiposSchema.safeParse(equipoData)
        if (!equipoSchema.success) {
            throw new Error(equipoSchema.error.message);
        }

        if (!equipoData || Object.keys(equipoData).length === 0) {
            throw new Error("Los datos del equipo no pueden estar vacíos.");
        }

        if (!equipoData.numEconomico || equipoData.numEconomico.trim() === "") {
            throw new Error("El numero economico del equipo es requerido.");
        }

        const equipoRef = doc(db, "equipos", newId)
        const equipoDoc = {
            ...equipoData,
            id: newId,
            createdAt: now,
            updatedAt: now,
        }

        await setDoc(equipoRef, equipoDoc)

        return {
            id: newId,
            success: true,
            message: "El equipo se ha creado correctamente",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al validar los datos",
            error: error as Error
        }
    }
}

export const updateEquipo = async (
    equipoData: Omit<Equipo, "id" | "createdAt" | "updatedAt" | "tanque" | "mantenimiento" | "Revisiones" | "archivos" | "Certificado" | "ArchivosVencimiento">,
    id: string
): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const now = new Date();
        const equipoSchema = EquiposSchema.safeParse(equipoData)
        if (!equipoSchema.success) {
            throw new Error(equipoSchema.error.message);
        }

        if (!equipoData || Object.keys(equipoData).length === 0) {
            throw new Error("Los datos del equipo no pueden estar vacíos.");
        }

        if (!equipoData.numEconomico || equipoData.numEconomico.trim() === "") {
            throw new Error("El numero economico del equipo es requerido.");
        }

        const equipoRef = doc(db, "equipos", id)
        const equipoDoc = {
            ...equipoData,
            updatedAt: now,
        }

        await updateDoc(equipoRef, equipoDoc)

        return {
            success: true,
            message: "El equipo se ha actualizado correctamente",
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al validar los datos",
            error: error as Error
        }
    }
}