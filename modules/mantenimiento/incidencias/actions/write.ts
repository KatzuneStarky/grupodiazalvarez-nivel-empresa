import { IncidenciaSchema } from "../schema/incidencia.schema";
import { Incidencia } from "../types/incidencias";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid";

export const writeIncidencia = async (incidencia: Omit<Incidencia, "id" | "creadtedAt" | "updatedAt">, equipoId: string):
    Promise<{ success: boolean; message: string; data?: Incidencia; error?: string }> => {
    try {
        const newId = uuidv7()
        const now = new Date()

        {/**
            const incidenciaSchema = IncidenciaSchema.safeParse(incidencia)
        if (!incidenciaSchema.success) {
            throw new Error(incidenciaSchema.error.message);
        }

        if (!incidencia || Object.keys(incidencia).length === 0) {
            throw new Error("Los datos de la incidencia no pueden estar vacíos.");
        } */}

        {/**
            if (!incidencia.equipoId || !incidencia.operadorId) {
            return {
                success: false,
                message: "Error al escribir la incidencia",
                error: "No se proporciono el equipoId o el operadorId"
            }
        } */}

        const incidenciaRef = doc(db, "equipos", equipoId, "incidencias", newId)
        await setDoc(incidenciaRef, {
            ...incidencia,
            id: newId,
            createAt: now,
            updateAt: now,
        })

        if (incidencia.evidencias?.length) {
            const evidenciaWrite = incidencia.evidencias.map((evidencia) => {
                const evidenciaId = uuidv7()
                return setDoc(doc(db, "equipos", equipoId, "incidencias", newId, "evidencias", evidenciaId), {
                    ...evidencia,
                    id: evidenciaId,
                    createAt: now,
                    updateAt: now,
                })
            })
            await Promise.all(evidenciaWrite)
        }

        return {
            success: true,
            message: "Incidencia escrita correctamente",
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Error al escribir la incidencia",
            error: error as string
        };
    }
}