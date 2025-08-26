import { ArchivosVencimiento } from "@/modules/logistica/bdd/equipos/types/archivos-vencimiento";
import { getMetadata, getStorage, listAll, ref, StorageReference } from "firebase/storage";
import { Certificado } from "@/modules/logistica/bdd/equipos/types/certificados";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";

export const subscribeToAllArchivos = (
    callback: (data: (Archivo | Certificado | ArchivosVencimiento)[]) => void
) => {
    const equiposRef = collection(db, "equipos");

    return onSnapshot(equiposRef, async (equiposSnapshot) => {
        const equiposPromises = equiposSnapshot.docs.map(async (equipoDoc) => {
            const equipoId = equipoDoc.id;

            const archivosRef = collection(db, `equipos/${equipoId}/archivos`);
            const certificadosRef = collection(db, `equipos/${equipoId}/certificados`);
            const archivosVencimientoRef = collection(db, `equipos/${equipoId}/archivosVencimiento`);

            const [archivosSnapshot, certificadosSnapshot, archivosVencimientoSnapshot] = await Promise.all([
                getDocs(archivosRef),
                getDocs(certificadosRef),
                getDocs(archivosVencimientoRef),
            ]);

            const archivos: Archivo[] = archivosSnapshot.docs.map(doc => ({ ...doc.data(), equipoId } as Archivo));
            const certificados: Certificado[] = certificadosSnapshot.docs.map(doc => ({ ...doc.data(), equipoId } as Certificado));
            const archivosVencimiento: ArchivosVencimiento[] = archivosVencimientoSnapshot.docs.map(doc => ({ ...doc.data(), equipoId } as ArchivosVencimiento));

            return [...archivos, ...certificados, ...archivosVencimiento];
        });

        const allArchivos = (await Promise.all(equiposPromises)).flat();

        callback(allArchivos);
    });
};

export async function getTotalStorageUsage(folder?: string): Promise<number> {
    const storage = getStorage();
    const storageRef = ref(storage, folder || "");
    let totalSize = 0;

    async function calculateFolderSize(folderRef: StorageReference): Promise<void> {
        try {
            const { items, prefixes } = await listAll(folderRef);

            const metadataPromises = items.map(async (item) => {
                try {
                    const metadata = await getMetadata(item);
                    return metadata.size;
                } catch (error) {
                    console.error(`Error obteniendo metadatos para ${item.fullPath}:`, error);
                    return 0;
                }
            });

            const sizes = await Promise.all(metadataPromises);
            totalSize += sizes.reduce((acc, size) => acc + size, 0);

            await Promise.all(prefixes.map(calculateFolderSize));
        } catch (error) {
            console.error(`Error listando el contenido de ${folderRef.fullPath}:`, error);
        }
    }

    await calculateFolderSize(storageRef);
    return totalSize;
}

export async function getTotalStorageUsageEquipo(folder?: string): Promise<number> {
    const storage = getStorage();
    if (!folder) return 0;
    const storageRef = ref(storage, folder);
    let totalSize = 0;

    async function calculateFolderSize(folderRef: StorageReference): Promise<void> {
        try {
            const { items, prefixes } = await listAll(folderRef);

            const metadataPromises = items.map(async (item) => {
                try {
                    const metadata = await getMetadata(item);
                    return metadata.size;
                } catch (error) {
                    console.error(`Error obteniendo metadatos para ${item.fullPath}:`, error);
                    return 0;
                }
            });

            const sizes = await Promise.all(metadataPromises);
            totalSize += sizes.reduce((acc, size) => acc + size, 0);

            await Promise.all(prefixes.map(calculateFolderSize));
        } catch (error) {
            console.error(`Error listando el contenido de ${folderRef.fullPath}:`, error);
        }
    }

    await calculateFolderSize(storageRef);
    return totalSize;
}

export type StorageUsage = { archivos: number; archivosVencimiento: number; certificado: number };

export async function getStorageUsagePerSubfolder(folder?: string): Promise<Record<string, StorageUsage>> {
    const storage = getStorage();
    const storageRef = ref(storage, folder || "");
    const subfolderSizes: Record<string, StorageUsage> = {};

    async function calculateSubfolderSizes(folderRef: StorageReference): Promise<void> {
        try {
            const { prefixes } = await listAll(folderRef);

            const folderSizePromises = prefixes.map(async (prefix) => {
                try {
                    const [archivos, archivosVencimiento, certificado] = await Promise.all([
                        getTotalStorageUsage(`${prefix.fullPath}/archivos`),
                        getTotalStorageUsage(`${prefix.fullPath}/archivosVencimiento`),
                        getTotalStorageUsage(`${prefix.fullPath}/certificados`)
                    ]);

                    subfolderSizes[prefix.fullPath] = { archivos, archivosVencimiento, certificado };
                } catch (error) {
                    console.error(`Error obteniendo datos de ${prefix.fullPath}:`, error);
                }
            });

            await Promise.all(folderSizePromises);
        } catch (error) {
            console.error(`Error listando el contenido de ${folderRef.fullPath}:`, error);
        }
    }

    await calculateSubfolderSizes(storageRef);
    return subfolderSizes;
}

export async function getStorageUsagePerSubfolderEquipo(folder: string, eId: string): Promise<StorageUsage | null> {
    if (!folder || !eId) {
        console.error("Ruta inválida para obtener almacenamiento.");
        return null;
    }

    const storage = getStorage();
    const equipoPath = `${folder}/${eId}`;
    const storageRef = ref(storage, equipoPath);

    try {
        const [archivos, archivosVencimiento, certificado] = await Promise.all([
            getTotalStorageUsageEquipo(`${equipoPath}/archivos`).catch(() => 0),
            getTotalStorageUsageEquipo(`${equipoPath}/archivosVencimiento`).catch(() => 0),
            getTotalStorageUsageEquipo(`${equipoPath}/certificados`).catch(() => 0)
        ]);

        return { archivos, archivosVencimiento, certificado };
    } catch (error) {
        console.error(`Error obteniendo almacenamiento para equipo ${eId}:`, error);
        return null;
    }
}