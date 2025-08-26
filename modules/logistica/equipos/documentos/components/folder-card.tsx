"use client"

import { useFolderCard } from "../hooks/use-folder-card"
import { Folder } from "../types/folder"

const FolderCard = ({ folder }: { folder: Folder }) => {
    const {
        archivosVencimientoPesoTotal,
        isModifiedWithin7Days,
        certificadosPesoTotal,
        archivosPesoTotal,
        totalArchivos,
        lastModified,
        totalSize,
    } = useFolderCard({ folder: folder })

    return (
        <div>FolderCard</div>
    )
}

export default FolderCard