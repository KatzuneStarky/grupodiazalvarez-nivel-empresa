"use client"

import { EvidenciaSchemaType, MantenimientoSchemaType } from "../schemas/mantenimiento.schema";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Control, useController } from "react-hook-form";
import { storage } from "@/firebase/client";
import { Trash } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
    control: Control<MantenimientoSchemaType>;
    name: "Evidencia";
    mantenimientoId: string;
    isSubmitting?: boolean;
}

interface FileProgress {
    file: File;
    progress: number;
    status: "uploading" | "success" | "error";
}

const UploadEvidencia: React.FC<FileUploadProps> = ({ control, name, mantenimientoId, isSubmitting }) => {
    const { field } = useController({ control, name });
    const [fileProgress, setFileProgress] = useState<FileProgress[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        files.forEach((file) => uploadFile(file));
    };

    const uploadFile = (file: File) => {
        const storageRef = ref(storage, `mantenimientos/${mantenimientoId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setFileProgress((prev) => [...prev, { file, progress: 0, status: "uploading" }]);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileProgress((prev) =>
                    prev.map((fp) => (fp.file.name === file.name ? { ...fp, progress, status: "uploading" } : fp))
                );
            },
            () => {
                setFileProgress((prev) =>
                    prev.map((fp) => (fp.file.name === file.name ? { ...fp, status: "error" } : fp))
                );
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);

                const newEvidencia: EvidenciaSchemaType = {
                    nombre: file.name,
                    ruta: url,
                    tipo: file.type,
                    mantenimientoId,
                };

                field.onChange([...(field.value || []), newEvidencia]);

                setFileProgress((prev) =>
                    prev.map((fp) => (fp.file.name === file.name ? { ...fp, progress: 100, status: "success" } : fp))
                );
            }
        );
    };

    const handleRemoveFile = (index: number) => {
        const newEvidencias = (field.value || []).filter((_: any, i: number) => i !== index);
        field.onChange(newEvidencias);

        setFileProgress((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full rounded-lg p-2">            
            <h3 className="text-gray-800 dark:text-gray-300 text-xl font-bold mb-4">Subir evidencias</h3>

            <label className="block border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer">
                <input type="file" multiple className="hidden" onChange={handleFileChange} disabled={isSubmitting} />
                <p className="text-gray-600 dark:text-gray-300">Arrastra o selecciona archivos</p>
            </label>

            <div className="mt-4">
                {(field.value || []).map((evidencia, index) => {
                    const fp = fileProgress.find((fp) => fp.file.name === evidencia.nombre);
                    
                    return (
                        <div key={index} className="mb-3 flex items-center justify-between gap-3 border p-2 rounded-md">
                            <div>
                                <p className="text-sm font-medium">{evidencia.nombre}</p>
                                <p className="text-xs text-gray-500">{evidencia.tipo}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {fp && (
                                    <div className="w-24 bg-gray-200 h-2 rounded overflow-hidden">
                                        <div
                                            className={`h-2 ${fp.status === "error"
                                                    ? "bg-red-500"
                                                    : fp.progress === 100
                                                        ? "bg-green-500"
                                                        : "bg-blue-500"
                                                }`}
                                            style={{ width: `${fp.progress}%` }}
                                        />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    disabled={isSubmitting}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default UploadEvidencia