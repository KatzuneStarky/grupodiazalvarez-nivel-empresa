import { WriteEmpresaResult } from "@/types/form-result/empresa-form-result";
import { collection, doc, setDoc } from "firebase/firestore";
import { Empresa } from "../types/empresas";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";

export async function writeEmpresa(
    empresaData:
        Omit<Empresa, "id" | "fechaCreacion" | "fechaActualizacion">
): Promise<WriteEmpresaResult> {
    try {
        if (!empresaData || Object.keys(empresaData).length === 0) {
            throw new Error("Los datos de la empresa no pueden estar vacíos.");
        }

        const empresaId = uuidv4();
        const empresaRef = doc(db, "empresas", empresaId);

        await setDoc(empresaRef, {
            ...empresaData,
            fechaActualizacion: new Date().toISOString(),
        })

        if (empresaData.contactos && empresaData.contactos.length > 0) {
            for (const contacto of empresaData.contactos) {
                const contactoId = uuidv4();
                const contactoRef = doc(
                    collection(db, `empresas/${empresaId}/contactos`),
                    contactoId
                );

                await setDoc(contactoRef, {
                    ...contacto,
                    id: contactoId,
                    empresaId,
                });
            }
        }

        if (empresaData.areas && empresaData.areas.length > 0) {
            for (const area of empresaData.areas) {
                const areaId = uuidv4();
                const areaRef = doc(
                    collection(db, `empresas/${empresaId}/areas`),
                    areaId
                );

                await setDoc(areaRef, {
                    ...area,
                    id: areaId,
                    empresaId: empresaId,
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                });
            }
        }

        return {
            success: true,
            message: "Registro de empresa generado correctamente.",
        };
    } catch (error) {
        console.error("Error al registrar la empresa:", error);
        return {
            success: false,
            message: "Error al registrar la empresa.",
            error: error instanceof Error ? error : new Error("Error desconocido"),
        };
    }
}