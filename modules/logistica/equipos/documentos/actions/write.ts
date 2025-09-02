import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFileType } from "@/functions/get-file-type";
import { db, storage } from "@/firebase/client";
import { FileType } from "@/types/file-types";

export type FileCategory = "archivos" | "archivosVencimiento" | "certificados";

type CategoryMap = {
    archivos: Archivo;
    archivosVencimiento: ArchivosVencimiento;
    certificados: Certificado;
};

export async function uploadFiles<K extends FileCategory>(
    files: File[],
    equipoId: string,
    category: K
): Promise<[CategoryMap[K][], { success: boolean, message: string, error?: Error }]> {
    const uploadPromises = files.map(async (file) => {
        const { type: fileType } = getFileType(file.name);
        const fileRef = ref(storage, `equipos/${equipoId}/${category}/${file.name}`);

        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        const docRef = await addDoc(collection(db, `equipos/${equipoId}/${category}`), {
            nombre: file.name,
            ruta: downloadURL,
            tipo: fileType as FileType,
            extension: file.name.split(".").pop() ?? "",
            peso: file.size,
            equipoId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await updateDoc(docRef, { id: docRef.id });

        return {
            id: docRef.id,
            nombre: file.name,
            ruta: downloadURL,
            tipo: fileType as FileType,
            extension: file.name.split(".").pop() ?? "",
            peso: file.size,
            equipoId,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as CategoryMap[K];
    });

    const uploadResults = await Promise.allSettled(uploadPromises);
    const successful = uploadResults
        .filter((r): r is PromiseFulfilledResult<Awaited<CategoryMap[K]>> => r.status === "fulfilled")
        .map((r) => r.value);

    const failed = uploadResults
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => r.reason);

    return [
        successful,
        {
            success: failed.length === 0,
            message: failed.length === 0
                ? `Se han subido ${successful.length} archivos al equipo con id: ${equipoId}`
                : `Se subieron ${successful.length} archivos, pero ${failed.length} fallaron`,
            error: failed.length > 0 ? new Error("Algunos archivos no se pudieron subir") : undefined,
        },
    ];
}