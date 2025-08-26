"use client"

import { isWithinLast7Days } from "@/utils/is-recent-folder";
import { Timestamp } from "firebase/firestore";
import { Folder } from "../types/folder"
import { useMemo } from "react";

const toDate = (value: Date | Timestamp): Date =>
    value instanceof Timestamp ? value.toDate() : value;

export const useFolderCard = ({ folder }: { folder: Folder }) => {
    return useMemo(() => {
        const totalArchivos =
            folder.archivos.length +
            folder.archivosVencimiento.length +
            folder.certificado.length;

        const lastModified = toDate(folder.updatedAt);

        const archivosPesoTotal = folder.archivos.reduce((t, a) => t + a.peso, 0);
        const archivosVencimientoPesoTotal = folder.archivosVencimiento.reduce((t, a) => t + a.peso, 0);
        const certificadosPesoTotal = folder.certificado.reduce((t, a) => t + a.peso, 0);

        const totalSize = archivosPesoTotal + archivosVencimientoPesoTotal + certificadosPesoTotal;

        const isModifiedWithin7Days = isWithinLast7Days(lastModified);

        return {
            totalArchivos,
            lastModified,
            archivosPesoTotal,
            archivosVencimientoPesoTotal,
            certificadosPesoTotal,
            totalSize,
            isModifiedWithin7Days,
        };
    }, [folder]);
};