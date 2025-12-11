import { OrdenMantenimiento } from "@/modules/mantenimiento/types/orden-mantenimiento";
import { Incidencia } from "../types/incidencias";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid";

export const writeIncidencia = async (incidencia: Omit<Incidencia, "id" | "creadtedAt" | "updatedAt">, equipoId: string):
    Promise<{ success: boolean; message: string; data?: Incidencia; error?: string }> => {
    try {
        const newId = uuidv7()
        const now = new Date()

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

        const ordenId = uuidv7()
        const ordenRef = doc(db, "ordenes-mantenimiento", ordenId)

        const ordenData: OrdenMantenimiento = {
            id: ordenId,
            incidenciaId: newId,
            equipoId: equipoId,
            estado: 'Pendiente',
            prioridad: incidencia.severidad,
            descripcionProblema: incidencia.descripcion,
            fechaCreacion: now,
            createAt: now,
            updateAt: now,
        }

        await setDoc(ordenRef, ordenData)

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