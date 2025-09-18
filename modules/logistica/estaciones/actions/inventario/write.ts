import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { InventarioEstaciones } from "../../types/inventarios";
import { db } from "@/firebase/client";

export type InventarioEstacionInput = {
    estacion: string;
    inventarioMagna: number;
    pVentasDiarias: number;
    inventarioPremium: number;
    pVentasDiarias2: number;
    inventarioDiesel: number;
    pVentasDiarias3: number;
};

export const createInventarioEstacion = async (
    estacionData: InventarioEstacionInput
): Promise<void> => {
    try {
        const calcDiasInventario = (inventario: number, ventasDiarias: number) =>
            ventasDiarias !== 0 ? inventario / ventasDiarias : 0;

        const dInventariados1 = calcDiasInventario(estacionData.inventarioMagna, estacionData.pVentasDiarias);
        const dInventariados2 = calcDiasInventario(estacionData.inventarioPremium, estacionData.pVentasDiarias2);
        const dInventariados3 = calcDiasInventario(estacionData.inventarioDiesel, estacionData.pVentasDiarias3);

        const inventarioRef = collection(db, "inventarioEstaciones");
        await addDoc(inventarioRef, {
            ...estacionData,
            dInventariados1,
            dInventariados2,
            dInventariados3,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creando el inventario de estación:", error);
        throw new Error("Error creando el inventario de estación");
    }
};

export const updateInventarioEstacion = async (
    estacionData: InventarioEstaciones
): Promise<void> => {
    try {
        const q = query(
            collection(db, "inventarioEstaciones"),
            where("estacion", "==", estacionData.estacion)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No se encontró el documento con esa estación.");
            return;
        }

        const docId = querySnapshot.docs[0].id;

        const dInventariados1 = estacionData.pVentasDiarias !== 0
            ? estacionData.inventarioMagna / estacionData.pVentasDiarias
            : 0;

        const dInventariados2 = estacionData.pVentasDiarias2 !== 0
            ? estacionData.inventarioPremium / estacionData.pVentasDiarias2
            : 0;

        const dInventariados3 = estacionData.pVentasDiarias3 !== 0
            ? estacionData.inventarioDiesel / estacionData.pVentasDiarias3
            : 0;

        const inventarioRef = doc(db, "inventarioEstaciones", docId);

        await updateDoc(inventarioRef, {
            inventarioMagna: estacionData.inventarioMagna,
            pVentasDiarias: estacionData.pVentasDiarias,
            dInventariados1,
            inventarioPremium: estacionData.inventarioPremium,
            pVentasDiarias2: estacionData.pVentasDiarias2,
            dInventariados2,
            inventarioDiesel: estacionData.inventarioDiesel,
            pVentasDiarias3: estacionData.pVentasDiarias3,
            dInventariados3,
            updateAt: serverTimestamp(),
        });

        console.log("Inventario de estación actualizado correctamente.");
    } catch (error) {
        console.error("Error actualizando el inventario de estación:", error);
        throw new Error("Error actualizando el inventario de estación");
    }
};