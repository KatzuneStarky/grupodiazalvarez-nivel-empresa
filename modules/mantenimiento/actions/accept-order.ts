

import { db } from "@/firebase/client"
import { doc, runTransaction, arrayUnion } from "firebase/firestore"
import { EstadoMecanico } from "../types/mecanico"

export async function acceptOrdenMantenimiento(ordenId: string, mecanicoId: string) {
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
            if (ordenData.estado !== 'Pendiente') {
                throw new Error("La orden ya no está disponible (estado: " + ordenData.estado + ")")
            }

            // Update Orden
            transaction.update(ordenRef, {
                estado: 'En Progreso',
                mecanicoId: mecanicoId,
                fechaInicio: new Date(), // Firestore will convert this, or use serverTimestamp if preferred, but Date is usually fine in client SDK usage, wait this is "use server"? No, client SDK in "use server" actions is tricky if using admin SDK. 
                // Wait, db is imported from "@/firebase/client". This is a Client Action (run on client) or Server Action? 
                // The user's project seems to use "use client" in contexts etc, but "actions" usually imply server actions in Next.js App Router if "use server" is at top. 
                // However, "@/firebase/client" implies Client SDK. Client SDK cannot be used reliably in Server Actions for auth context etc without passing tokens, but simple writes might work if rules allow. 
                // BUT, typically `write.ts` in this project (I recalled `modules/mantenimiento/incidencias/actions/write.ts`) used Client SDK functions directly.
                // Let's check `write.ts` content from memory or check it. 
                // The summary said "modules/mantenimiento/incidencias/actions/write.ts" was key.
            })

            // Update Mecanico
            transaction.update(mecanicoRef, {
                estado: EstadoMecanico.OCUPADO,
                mantenimientosAsignados: arrayUnion(ordenId)
            })
        })

        return { success: true }
    } catch (error) {
        console.error("Error accepting order:", error)
        return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
    }
}
