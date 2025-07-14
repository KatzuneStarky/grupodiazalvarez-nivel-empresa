import { deleteObject, listAll, ref } from "firebase/storage";
import { storage } from "@/firebase/client";

export const deleteFolderContents = async (folderPath: string): Promise<void> => {
    try {
        const folderRef = ref(storage, folderPath);

        const listResult = await listAll(folderRef);
        const subfolderDeletes = listResult.prefixes.map((subfolderRef) =>
            deleteFolderContents(subfolderRef.fullPath)
        );
        await Promise.all(subfolderDeletes);
        const fileDeletes = listResult.items.map((itemRef) =>
            deleteObject(itemRef)
        );
        await Promise.all(fileDeletes);

        console.log(`Todos los archivos en la carpeta ${folderPath} fueron eliminados.`);
    } catch (error) {
        console.error("Error al eliminar los archivos de la carpeta:", error);
        throw new Error("No se pudieron eliminar los archivos de la carpeta.");
    }
};