import { collection, onSnapshot } from "firebase/firestore"
import { FileExplorerState } from "../types/file-explorer"
import { FileItem } from "../types/file-item"
import { useEffect, useMemo, useState } from "react"
import { db } from "@/firebase/client"

export const useFileExplorer = ({ userId }: { userId: string }) => {
    const [files, setFiles] = useState<FileItem[]>([])
    const [state, setState] = useState<FileExplorerState>({
        currentPath: [],
        selectedItems: [],
        viewMode: "grid",
        sortBy: "name",
        sortOrder: "asc",
    })
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
    const [activeFilter, setActiveFilter] = useState("all")
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const archivosRef = collection(db, "usuarios", userId, "items");
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
    }, [])

    const buildFileTree = (flatFiles: FileItem[]): FileItem[] => {
        const map = new Map<string, FileItem>()
        const roots: FileItem[] = []

        flatFiles.forEach(f => map.set(f.id, { ...f, children: [] }))
        map.forEach(f => {
            if (f.parentId) {
                const parent = map.get(f.parentId)
                if (parent) {
                    parent.children!.push(f)
                } else {
                    roots.push(f)
                }
            } else {
                roots.push(f)
            }
        })

        return roots
    }

    const fileTree = useMemo(() => buildFileTree(files), [files])

    const currentFiles = useMemo(() => {
        let currentFolder = fileTree

        for (const pathSegment of state.currentPath) {
            const folder = currentFolder.find(f => f.name === pathSegment && f.type === "folder")
            if (folder?.children) {
                currentFolder = folder.children
            } else {
                currentFolder = []
                break
            }
        }

        let filteredFiles = currentFolder

        if (searchQuery) {
            filteredFiles = filteredFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        switch (activeFilter) {
            case "recent":
                filteredFiles = filteredFiles.filter(f => {
                    const daysDiff = Math.abs(new Date().getTime() - f.lastModified.getTime()) / (1000 * 60 * 60 * 24)
                    return daysDiff <= 7
                })
                break
            case "starred":
                filteredFiles = filteredFiles.filter(f => f.isFavorite)
                break
            case "shared":
                filteredFiles = filteredFiles.filter(f => f.shares && f.shares.length > 0)
                break
            case "trash":
                filteredFiles = filteredFiles.filter(f => f.archived)
                break
        }

        return [...filteredFiles].sort((a, b) => {
            if (a.type !== b.type) return a.type === "folder" ? -1 : 1

            let comparison = 0
            switch (state.sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name)
                    break
                case "size":
                    comparison = (a.size || 0) - (b.size || 0)
                    break
                case "lastModified":
                    comparison = a.lastModified.getTime() - b.lastModified.getTime()
                    break
            }
            return state.sortOrder === "asc" ? comparison : -comparison
        })
    }, [fileTree, state.currentPath, state.sortBy, state.sortOrder, searchQuery, activeFilter])

    return {
        files,
        currentFiles,
        state,
        previewFile,
        activeFilter,
        error,
        loading,
        searchQuery,
        setFiles,
        setState,
        setPreviewFile,
        setActiveFilter,
        setError,
        setLoading,
        setSearchQuery,
        viewMode: state.viewMode,
    }
}