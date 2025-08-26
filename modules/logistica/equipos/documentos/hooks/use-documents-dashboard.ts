import { useEquiposWithFolder } from "./use-equipos-folders"
import { useAllArchivos } from "./use-all-archivos"
import { Timestamp } from "firebase/firestore"
import { Folder } from "../types/folder"
import { useMemo } from "react"

const toDate = (value: Date | Timestamp): Date =>
    value instanceof Timestamp ? value.toDate() : new Date(value);

export const useDocumentsDashboard = () => {
    const { folders, isLoading: loadingEquiposFolder, error: errorEquiposFolder } = useEquiposWithFolder()
    const { archivos, loading: loadingArchivos, error: errorArchivos } = useAllArchivos()

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 7);

    const getLatestFileDate = (folder: Folder): Date => {
        const allFiles = [
            ...folder.archivos,
            ...folder.archivosVencimiento,
            ...folder.certificado,
        ];

        if (allFiles.length === 0) return new Date(0);

        return allFiles.reduce((latest, file) => {
            const fileDate = toDate(file.createAt);
            return fileDate > latest ? fileDate : latest;
        }, new Date(0));
    };

    const recentFolders = useMemo(() =>
        folders.filter(folder => getLatestFileDate(folder) > thresholdDate),
        [folders]);

    const sortedFolders = useMemo(() =>
        [...folders].sort((a, b) => getLatestFileDate(b).getTime() - getLatestFileDate(a).getTime()),
        [folders]);

    const first6Folders = useMemo(() =>
        [...recentFolders, ...sortedFolders.filter(folder => !recentFolders.includes(folder))].slice(0, 5),
        [recentFolders, sortedFolders]);

    const allArchivos = archivos.flat();
    const sortedArchivos = useMemo(() =>
        allArchivos.sort((a, b) => toDate(b.createAt).getTime() - toDate(a.createAt).getTime()),
        [allArchivos]);

    const first18Archivos = sortedArchivos.slice(0, 18);

    const isLoadingData = loadingEquiposFolder && loadingArchivos

    return {
        errorEquiposFolder,
        first18Archivos,
        recentFolders,
        sortedFolders,
        first6Folders,
        isLoadingData,
        errorArchivos,
        allArchivos,
        folders
    }
}