import { FileExplorerState } from "../types/file-explorer"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FileAction } from "../types/file-actions"
import { useAuth } from "@/context/auth-context"
import { useUserFiles } from "./use-user-files"
import { Timestamp } from "firebase/firestore"
import { FileItem } from "../types/file-item"

export const useFileExplorer = () => {
    const [state, setState] = useState<FileExplorerState>({
        currentPath: [],
        selectedItems: [],
        viewMode: "grid",
        sortBy: "name",
        sortOrder: "asc",
    })
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
    const [activeFilter, setActiveFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const { files, error, loading } = useUserFiles()
    const pathname = usePathname()
    const router = useRouter()
    const { userBdd } = useAuth()

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

    const breadcrumbs = useMemo(() => {
        const trail: { id: string; name: string }[] = []
        let folderLevel = fileTree

        for (const folderId of state.currentPath) {
            const folder = folderLevel.find(f => f.id === folderId)
            if (!folder) break
            trail.push({ id: folder.id, name: folder.name })
            folderLevel = folder.children || []
        }

        return trail
    }, [fileTree, state.currentPath])

    const currentFiles = useMemo(() => {
        let filesToShow = fileTree;
        for (const folderId of state.currentPath) {
            const folder = filesToShow.find(f => f.id === folderId && f.type === "folder");
            if (folder?.children) {
                filesToShow = folder.children;
            } else {
                filesToShow = [];
                break;
            }
        }

        if (searchQuery) {
            filesToShow = filesToShow.filter(f =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        switch (activeFilter) {
            case "recent":
                filesToShow = filesToShow.filter(f => {
                    const daysDiff = Math.abs(Date.now() - (f.lastModified instanceof Timestamp ? f.lastModified.toDate().getTime() : f.lastModified.getTime())) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 7;
                });
                break;
            case "starred":
                filesToShow = filesToShow.filter(f => f.isFavorite);
                break;
            case "shared":
                filesToShow = filesToShow.filter(f => f.shares && f.shares.length > 0);
                break;
            case "trash":
                filesToShow = filesToShow.filter(f => f.archived);
                break;
        }

        return [...filesToShow].sort((a, b) => {
            if (a.type !== b.type) return a.type === "folder" ? -1 : 1;

            let comparison = 0;
            switch (state.sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "size":
                    comparison = (a.size || 0) - (b.size || 0);
                    break;
                case "lastModified":
                    const aTime = a.lastModified instanceof Timestamp ? a.lastModified.toDate().getTime() : a.lastModified.getTime();
                    const bTime = b.lastModified instanceof Timestamp ? b.lastModified.toDate().getTime() : b.lastModified.getTime();
                    comparison = aTime - bTime;
                    break;
            }

            return state.sortOrder === "asc" ? comparison : -comparison
        });
    }, [fileTree, state.currentPath, state.sortBy, state.sortOrder, searchQuery, activeFilter])

    const navigateToFolder = (folderId: string) => {
        setState(prev => ({
            ...prev,
            currentPath: [...prev.currentPath, folderId],
            selectedItems: [],
        }))

        router.replace(`/usuario/${userBdd?.nombre}/documentos/${folderId}`)
    }

    const navigateUp = () => {
        setState(prev => ({
            ...prev,
            currentPath: prev.currentPath.slice(0, -1),
            selectedItems: [],
        }))
    }

    const navigateToPath = (pathIndex: number) => {
        setState(prev => ({
            ...prev,
            currentPath: prev.currentPath.slice(0, pathIndex + 1),
            selectedItems: [],
        }))
    }

    useEffect(() => {
        const segments = pathname.split("/").filter(Boolean)
        const docId = segments[segments.length - 1]

        if (segments.includes("documentos") && docId !== "documentos") {
            setState(prev => ({
                ...prev,
                currentPath: [docId],
            }))
        } else {
            setState(prev => ({ ...prev, currentPath: [] }))
        }
    }, [pathname])

    const selectFile = (fileId: string, selected: boolean) => {
        setState((prev) => ({
            ...prev,
            selectedItems: selected ? [...prev.selectedItems, fileId] : prev.selectedItems.filter((id) => id !== fileId),
        }))
    }

    const selectAllFiles = (selected: boolean) => {
        setState((prev) => ({
            ...prev,
            selectedItems: selected ? currentFiles.map((f) => f.id) : [],
        }))
    }

    const setViewMode = (viewMode: FileExplorerState["viewMode"]) => {
        setState((prev) => ({ ...prev, viewMode }))
    }

    const setSorting = (sortBy: FileExplorerState["sortBy"], sortOrder: FileExplorerState["sortOrder"]) => {
        setState((prev) => ({ ...prev, sortBy, sortOrder }))
    }

    const handleFileClick = (file: FileItem) => {
        if (file.type === "folder") {
            navigateToFolder(file.id)
        } else {
            setPreviewFile(file)
        }
    }

    const handleFileAction = (action: FileAction, file: FileItem) => {
        switch (action) {
            case "preview":
                if (file.type === "folder") {
                    navigateToFolder(file.id)
                } else {
                    setPreviewFile(file)
                }
                break
            case "rename":
                console.log("Rename file:", file.name)
                break
            case "delete":
                console.log("Delete file:", file.name)
                break
            case "download":
                console.log("Download file:", file.name)
                break
            case "share":
                console.log("Share file:", file.name)
                break
        }
    }

    const handleToolbarAction = (action: string) => {
        switch (action) {
            case "upload":
                console.log("Upload files")
                break
            case "newFolder":
                console.log("Create new folder")
                break
            case "download":
                console.log("Download selected files:", state.selectedItems)
                break
            case "share":
                console.log("Share selected files:", state.selectedItems)
                break
            case "delete":
                console.log("Delete selected files:", state.selectedItems)
                break
        }
    }

    return {
        files,
        currentFiles,
        state,
        previewFile,
        activeFilter,
        error,
        loading,
        searchQuery,
        setState,
        setPreviewFile,
        setActiveFilter,
        setSearchQuery,
        viewMode: state.viewMode,
        selectedItems: state.selectedItems,
        navigateToFolder,
        navigateToPath,
        navigateUp,
        handleFileAction,
        handleFileClick,
        handleToolbarAction,
        setSorting,
        setViewMode,
        selectFile,
        selectAllFiles,
        currentPath: state.currentPath,
        breadcrumbs
    }
}