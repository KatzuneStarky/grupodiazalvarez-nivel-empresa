"use client"

import { deleteObject, getDownloadURL, ref, StorageError, uploadBytesResumable } from "firebase/storage"
import { AlertCircle, Camera, CheckCircle2, Info, RefreshCw, Upload, X } from "lucide-react"
import { setFileDetailsFromFile } from "@/lib/image-uploader/set-file-details"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { generateFilename } from "@/lib/image-uploader/geterate-filename"
import { getFileIcon } from "@/lib/image-uploader/get-file-icon"
import { UploadImageProps } from "@/types/image-uploader"
import { formatFileSize } from "@/utils/format-file-size"
import { formatDate } from "@/utils/format-file-date"
import { storage } from "@/firebase/client"
import { Separator } from "../ui/separator"
import { toast } from "sonner"

export default function UploadImage({
    path,
    id,
    image,
    onImageUpload,
    uploadText = "Subir imagen de perfil",
    uploadSubtext = "Arrastra y suelta o haz clic para seleccionar",
    maxFileSize = 5 * 1024 * 1024,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"],
    className = "",
    uploadAreaClassName = "",
    previewClassName = "",
    showFileName = false,
    autoUpload = true,
    errorMessages = {},
    disabled = false,
    useCamera = false,
    required = false,
    showFileInfo = false,
    placeholderImage = "https://avatar.iran.liara.run/public/26",
    showFileTypeIcon = true,
}: UploadImageProps) {
    const [currentImage, setCurrentImage] = useState<string | undefined>(image)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [fileDetails, setFileDetails] = useState<{
        name: string
        size: number
        type: string
        lastModified: Date
    } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setCurrentImage(image)
    }, [image])

    const handleUpload = useCallback(        
        async (file: File) => {
            setCurrentImage("")
            setError(null)
            setIsUploading(true)
            setUploadProgress(0)
            setUploadSuccess(false)

            if (!allowedTypes.includes(file.type)) {
                const errorMsg =
                    errorMessages.fileType ||
                    `Por favor, seleccione un archivo de imagen válido (${allowedTypes.map((type) => type.split("/")[1]).join(", ")})`
                setError(errorMsg)
                setIsUploading(false)
                return
            }

            if (file.size > maxFileSize) {
                const errorMsg =
                    errorMessages.fileSize || `Tamaño de archivo excede el límite máximo de ${formatFileSize(maxFileSize)}`
                setError(errorMsg)
                setIsUploading(false)
                return
            }

            try {
                const filename = generateFilename(file, id)
                const storageRef = ref(storage, `${path}/${filename}`)

                const uploadTask = uploadBytesResumable(storageRef, file)

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        setUploadProgress(progress)
                    },
                    (error: StorageError) => {
                        console.error("Error al subir la imagen:", error)

                        if (error.code === "storage/unauthorized") {
                            setError(
                                errorMessages.unauthorized ||
                                "Permiso denegado: No tienes permiso para subir a esta ubicación. Por favor, verifique tus reglas de Firebase Storage.",
                            )
                        } else if (error.code === "storage/canceled") {
                            setError("Subida cancelada")
                        } else if (error.code === "storage/unknown") {
                            setError("Un error desconocido a sucedido")
                        } else if (error.code === "storage/retry-limit-exceeded") {
                            setError(
                                "Fallo al subir la imagen: El tiempo maximo de carga se ha superado. Por favor, verifique su conexión e intente de nuevo.",
                            )
                        } else {
                            setError(errorMessages.uploadFailed || `Fallo al subir la imagen: ${error.message}`)
                        }

                        setIsUploading(false)
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        toast.success("Imagen subida correctamente")
                        setCurrentImage(downloadURL)
                        onImageUpload(downloadURL)
                        setIsUploading(false)
                        setUploadSuccess(true)

                        setTimeout(() => {
                            setUploadSuccess(false)
                        }, 3000)
                    },
                )
            } catch (err) {
                console.error("Error handling file:", err)
                toast.error("Un error inesperado ha ocurrido. Por favor, intente de nuevo.")
                setError("An unexpected error occurred. Please try again.")
                setIsUploading(false)
            }
        },
        [id, onImageUpload, path, allowedTypes, maxFileSize, errorMessages],
    )

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setFileDetailsFromFile(file, setFileDetails)
            if (autoUpload) {
                handleUpload(file)
            }
        }
    }

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const file = e.dataTransfer.files?.[0]
            if (file) {
                setSelectedFile(file)
                setFileDetailsFromFile(file, setFileDetails)
                if (autoUpload) {
                    handleUpload(file)
                }
            }
        },
        [handleUpload, autoUpload],
    )

    const handleManualUpload = () => {
        if (selectedFile) {
            handleUpload(selectedFile)
        }
    }

    const handleRemoveImage = async () => {
        if (currentImage) {
            try {
                const fileRef = ref(storage, currentImage)
                await deleteObject(fileRef)

                toast.success("Imagen eliminada correctamente")
            } catch (err) {
                console.error("Error al remover la imagen:", err)
                toast.error("Error al eliminar la imagen")
            }
        }

        setCurrentImage("")
        setSelectedFile(null)
        setFileDetails(null)
        onImageUpload("")
    }

    const triggerFileInput = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    const getAcceptedFileTypes = () => {
        return allowedTypes.join(",")
    }

    const getCaptureValue = () => {
        return useCamera ? "environment" : undefined
    }

    return (
        <div className={`w-full ${className}`}>
            <div
                className={`relative border-2 dark:bg-black rounded-lg p-4 transition-all ${isDragging ? "border-primary border-dashed" : "border-dashed border-gray-300"
                    } ${currentImage ? "min-h-[200px]" : "min-h-[150px]"} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    } ${uploadAreaClassName}`}
                onDragOver={!disabled ? handleDragOver : undefined}
                onDragLeave={!disabled ? handleDragLeave : undefined}
                onDrop={!disabled ? handleDrop : undefined}
                onClick={!disabled && !currentImage ? triggerFileInput : undefined}
                role={disabled ? "presentation" : "button"}
                tabIndex={disabled ? -1 : 0}
                aria-label={
                    disabled
                        ? "Image upload disabled"
                        : currentImage
                            ? "Image preview area"
                            : "Drop image here or click to upload"
                }
                aria-disabled={disabled}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault()
                        if (!currentImage) triggerFileInput()
                    }
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    accept={getAcceptedFileTypes()}
                    capture={getCaptureValue()}
                    disabled={disabled || isUploading}
                    required={required}
                    className="hidden"
                    aria-hidden="true"
                    aria-label="Upload image"
                    aria-required={required}
                    aria-disabled={disabled || isUploading}
                />

                {!currentImage ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                        {isDragging ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <p className="font-medium text-primary">Suelta tu imagen aqui</p>
                            </>
                        ) : (
                            <>
                                {useCamera ? (
                                    <Camera className="w-10 h-10 text-gray-400" />
                                ) : (
                                    <Upload className="w-10 h-10 text-gray-400" />
                                )}
                                <p className="font-medium text-gray-700 dark:text-gray-300">{uploadText}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{uploadSubtext}</p>

                                <div className="flex flex-wrap justify-center gap-2 mt-1">
                                    {allowedTypes.map((type) => (
                                        <span key={type} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600" title={type}>
                                            {type.split("/")[1].toUpperCase()}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400">Tamaño maximo: {formatFileSize(maxFileSize)}</p>
                            </>
                        )}

                        {selectedFile && !autoUpload && (
                            <div className="mt-4 flex flex-col items-center">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
                                    {showFileTypeIcon && getFileIcon(selectedFile.type)}
                                    <span className="break-all">{selectedFile.name.slice(0, 20).concat("...")}</span>
                                    <span className="text-xs text-gray-500 dark:text-white">({formatFileSize(selectedFile.size)})</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleManualUpload()
                                    }}
                                    className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Subiendo..." : "Subir"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        <div className="relative flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentImage || placeholderImage}
                                alt="Uploaded preview"
                                className={`max-h-[300px] rounded object-contain ${previewClassName}`}
                            />
                        </div>

                        {(showFileName || showFileInfo) && selectedFile && (
                            <div className="mt-3 text-center">
                                {showFileName && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-white">
                                        {showFileTypeIcon && getFileIcon(selectedFile.type)}
                                        <span>{selectedFile.name.slice(0, 20).concat("...")}</span>
                                        <span className="text-xs text-gray-500 dark:text-white">({formatFileSize(selectedFile.size)})</span>
                                    </div>
                                )}

                                {showFileInfo && fileDetails && (
                                    <div>
                                        <Separator className="mt-4" />
                                        <div className="mt-2 p-2 rounded-md text-left">
                                            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-200 font-medium mb-2">
                                                <Info className="w-5 h-5" />
                                                <span>Detalles de la imagen</span>
                                            </div>
                                            <table className="w-full text-left">
                                                <tbody>
                                                    <tr>
                                                        <td className="pr-2 text-gray-500 dark:text-gray-200">Tipo:</td>
                                                        <td>{fileDetails.type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pr-2 text-gray-500 dark:text-gray-200">Tamaño:</td>
                                                        <td>{formatFileSize(fileDetails.size)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pr-2 text-gray-500 dark:text-gray-200">Modificado:</td>
                                                        <td>{formatDate(fileDetails.lastModified)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    triggerFileInput()
                                }}
                                className="p-1.5 bg-gray-800/70 hover:bg-gray-800 
                                    rounded-full text-white transition-colors cursor-pointer"
                                aria-label="Replace image"
                                disabled={isUploading || disabled}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveImage()}
                                className="p-1.5 bg-red-500/70 hover:bg-red-500 
                                    rounded-full text-white transition-colors cursor-pointer"
                                aria-label="Remove image"
                                disabled={isUploading || disabled}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute -bottom-12 left-0 right-0 p-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                                role="progressbar"
                                aria-valuenow={uploadProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-500">Subiendo... {Math.round(uploadProgress)}%</p>
                    </div>
                )}

                {uploadSuccess && !isUploading && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-green-50 text-green-700 text-sm flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        <span>Subida completada!</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 text-sm text-red-500 flex items-start" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}