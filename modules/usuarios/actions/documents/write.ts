import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FileItem } from "../../types/file-item";
import { db } from "@/firebase/client";
import { v4 as uuidv4 } from "uuid";
import { Tag } from "emblor";

export const writeNewFolder = async (folderName: string, userId: string, description: string, tags: Tag[], parentId?: string):
    Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const newId = uuidv4()
        const now = new Date();

        if (!userId) throw new Error("El usuario no puede estar vacío");
        if (!folderName.trim()) throw new Error("El nombre del folder no puede estar vacío");

        const folderRef = doc(db, "usuarios", userId, "items", newId);

        if (parentId) {
            const parentRef = doc(db, "usuarios", userId, "items", parentId);
            await updateDoc(parentRef, {
                children: arrayUnion({
                    id: newId,
                    name: folderName,
                    type: "folder",
                    ownerId: userId,
                    parentId: parentId,
                    uploadedAt: now,
                    lastModified: now,
                    tags,
                    description,
                    version: 1,
                    archived: false,
                    isFavorite: false,
                    children: []
                } as FileItem)
            });
        } else {
            await setDoc(folderRef, {
                id: newId,
                name: folderName,
                type: "folder",
                ownerId: userId,
                parentId: parentId || null,
                uploadedAt: now,
                lastModified: now,
                tags,
                description,
                version: 1,
                archived: false,
                isFavorite: false,
                children: []
            } as FileItem);
        }

        return {
            success: true,
            message: "Folder generado correctamente"
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Error al generar el folder",
            error: error as Error
        }
    }
}