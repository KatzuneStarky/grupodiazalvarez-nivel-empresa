import { ProductoInventario } from "../types/producto-inventario";
import { InventarioSchema } from "../schema/inventario.schema";
import { Inventario } from "../types/inventario";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export const writeInventario = async (inventarioData: Omit<Inventario, "id">):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const inventarioId = uuidv4()
        const now = new Date();

        const inventarioSchema = InventarioSchema.safeParse(inventarioData)
        if (!inventarioSchema.success) {
            throw new Error(inventarioSchema.error.message);
        }

        if (!inventarioData || Object.keys(inventarioData).length === 0) {
            throw new Error("Los datos del inventario no pueden estar vacíos.");
        }

        const inventarioRef = doc(db, "inventario_taller", inventarioId)
        await setDoc(inventarioRef, {
            ...inventarioData,
            id: inventarioId,
            createdAt: now,
            updatedAt: now
        })

        if (inventarioData.productos?.length) {
            const productosWrite = inventarioData.productos.map((producto) => {
                const productoId = uuidv4()
                return setDoc(doc(db, "inventario_taller", inventarioId, "productos", productoId), {
                    ...producto,
                    id: productoId,
                    inventarioId: inventarioId,
                    createdAt: now,
                    updatedAt: now,
                })
            })
            await Promise.all(productosWrite)
        }

        return {
            success: true,
            message: "Inventario guardado correctamente"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al guardar el inventario",
            error: error as Error
        }
    }
}