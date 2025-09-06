import { MantenimientoInput } from "@/modules/logistica/bdd/equipos/types/mantenimiento";
import { MantenimientoSchema } from "../schemas/mantenimiento.schema";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeMantenimiento = async (
    mantenimientoData: Omit<MantenimientoInput, "id" | "createAt" | "updateAt">,
    equipoId: string
): Promise<{ success: boolean, message: string, error?: Error, id?: string }> => {
    try {
        const mantenimientoId = uuidv4()
        const now = new Date();

        const mantenimientoSchema = MantenimientoSchema.safeParse(mantenimientoData)
        if (!mantenimientoSchema.success) {
            throw new Error(mantenimientoSchema.error.message);
        }

        if (!mantenimientoData || Object.keys(mantenimientoData).length === 0) {
            throw new Error("Los datos del mantenimiento no pueden estar vacíos.");
        }

        if (!equipoId) throw new Error("El id del equipo es requerido")

        const mantenimientoRef = doc(db, "equipos", equipoId, "mantenimientos", mantenimientoId)
        await setDoc(mantenimientoRef, {
            ...mantenimientoData,
            id: mantenimientoId,
            createAt: now,
            updateAt: now,
        })

        if (mantenimientoData.mantenimientoData?.length) {
            const mantenimientoDataWrite = mantenimientoData.mantenimientoData.map((mantenimientoData) => {
                const mantenimientoDataId = uuidv4()
                return setDoc(doc(db, "equipos", equipoId, "mantenimientos", mantenimientoId, "mantenimientoData", mantenimientoDataId), {
                    ...mantenimientoData,
                    id: mantenimientoDataId,
                    createAt: now,
                    updateAt: now,
                })
            })
            await Promise.all(mantenimientoDataWrite)
        }

        if (mantenimientoData.Evidencia?.length) {
            const evidenciaWrite = mantenimientoData.Evidencia.map((evidencia) => {
                const evidenciaId = uuidv4()
                return setDoc(doc(db, "equipos", equipoId, "mantenimientos", mantenimientoId, "evidencias", evidenciaId), {
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
            message: "Mantenimiento guardado con éxito",
            id: mantenimientoId
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al guardar el mantenimiento",
            error: error as Error
        }
    }
}