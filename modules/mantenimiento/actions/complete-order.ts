import { doc, runTransaction, arrayRemove, arrayUnion } from "firebase/firestore"
import { EstadoMecanico } from "../types/mecanico"
import { db } from "@/firebase/client"

export async function completeOrdenMantenimiento(ordenId: string, mecanicoId: string, mantenimientoId: string) {
    try {
        await runTransaction(db, async (transaction) => {
            const ordenRef = doc(db, "ordenes-mantenimiento", ordenId)
            const mecanicoRef = doc(db, "mecanicos", mecanicoId)

            const ordenDoc = await transaction.get(ordenRef)
            const mecanicoDoc = await transaction.get(mecanicoRef)

            if (!ordenDoc.exists()) {
                throw new Error("Orden no encontrada")
            }

            if (!mecanicoDoc.exists()) {
                throw new Error("Mecánico no encontrado")
            }

            const ordenData = ordenDoc.data()
            if (ordenData.estado !== 'En Progreso') {
                throw new Error("La orden debe estar en progreso para completarla (estado actual: " + ordenData.estado + ")")
            }

            // Update Orden - marcar como completada
            transaction.update(ordenRef, {
                estado: 'Completada',
                fechaTerminacion: new Date(),
                mantenimientoId: mantenimientoId, // Vincular con el mantenimiento creado
            })

            // Update Mecanico
            const mecanicoData = mecanicoDoc.data()
            const mantenimientosAsignados = mecanicoData.mantenimientosAsignados || []

            // Remover esta orden de las asignadas y agregar el mantenimiento al historial
            transaction.update(mecanicoRef, {
                mantenimientosAsignados: arrayRemove(ordenId),
                historial: arrayUnion(mantenimientoId), // Agregar al historial del mecánico
            })

            // Si no tiene más órdenes asignadas, cambiar estado a DISPONIBLE
            if (mantenimientosAsignados.length <= 1) {
                transaction.update(mecanicoRef, {
                    estado: EstadoMecanico.DISPONIBLE
                })
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error completing order:", error)
        return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
    }
}
