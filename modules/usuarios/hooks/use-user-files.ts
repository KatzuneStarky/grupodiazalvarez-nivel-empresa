import { collection, onSnapshot } from "firebase/firestore"
import { useAuth } from "@/context/auth-context"
import { FileItem } from "../types/file-item"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useUserFiles = () => {
    const [files, setFiles] = useState<FileItem[]>([])
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(false)

    const { currentUser } = useAuth()

    useEffect(() => {
        if (!currentUser?.uid) return;

        const archivosRef = collection(db, "usuarios", currentUser?.uid || "", "items");
        const unsubscribe = onSnapshot(archivosRef, (querySnapshot) => {
            const fileData: FileItem[] = [];
            querySnapshot.forEach((doc) => {
                fileData.push({ id: doc.id, ...doc.data() } as FileItem);
            });
            setFiles(fileData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo los archivos:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser])

    return {
        files,
        error,
        loading
    }
}