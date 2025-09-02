"use client"

import { ArchivosSchemaType, ArchivosVencimientoSchemaType, CertificadoSchemaType } from "../schemas/documentos.schema";
import { Path, PathValue, UseFormReturn } from "react-hook-form";
import { useState } from "react";

type AllowedFormTypes =
    | ArchivosSchemaType
    | CertificadoSchemaType
    | ArchivosVencimientoSchemaType;

export const MAX_FILE_SIZE_MB = 15;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "pdf", "xlsx"];

export function useFileUpload<T extends AllowedFormTypes>(
    form: UseFormReturn<T>
) {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const newFiles = Array.from(event.target.files);

        const validFiles = newFiles.filter((file) => {
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
                setError(`Formato no permitido: ${file.name}`);
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                setError(`El archivo ${file.name} supera ${MAX_FILE_SIZE_MB}MB`);
                return false;
            }
            return true;
        });

        const uniqueFiles = validFiles.filter(
            (file) =>
                !selectedFiles.some(
                    (f) => f.name === file.name && f.size === file.size
                )
        );

        const updatedFiles = [...selectedFiles, ...uniqueFiles];
        setSelectedFiles(updatedFiles);
        form.setValue("files" as Path<T>, updatedFiles as PathValue<T, Path<T>>);

        const newImageUrls = uniqueFiles
            .filter((f) => f.type.startsWith("image/"))
            .map((file) => URL.createObjectURL(file));

        setImagePreviews((prev) => [...prev, ...newImageUrls]);
        setError(null);
    };

    const handleRemoveFile = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);

        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        form.setValue("files" as Path<T>, updatedFiles as PathValue<T, Path<T>>);

        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(updatedPreviews);
    };

    return {
        imagePreviews,
        selectedFiles,
        error,
        handleFileChange,
        handleRemoveFile,
        setSelectedFiles
    };
}