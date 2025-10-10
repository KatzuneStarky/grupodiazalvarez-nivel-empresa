"use client"

import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Info, Loader2, Upload, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ImportDialogProps, ImportResult } from "@/types/import-excel"
import { formatFileSize } from "@/constants/file-icons"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const ImportDialog = ({
    open,
    onOpenChange,
    title,
    description,
    onImport,
    acceptedFormats = ".xlsx",
    maxFileSizeMB = 10,
}: ImportDialogProps) => {
    const [importStartTime, setImportStartTime] = useState<number | null>(null)
    const [importDuration, setImportDuration] = useState<number | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [results, setResults] = useState<ImportResult[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024)
            if (fileSizeMB > maxFileSizeMB) {
                setResults([
                    {
                        success: false,
                        mensaje: `El tamaño del archivo actual (${fileSizeMB.toFixed(2)} MB) excede el tamaño maximo permitido de ${maxFileSizeMB} MB`,
                    },
                ])
                return
            }
            setSelectedFile(file)
            setResults([])
            setImportDuration(null)
        }
    }

    const handleImport = async () => {
        if (!selectedFile) return

        setIsLoading(true)
        setResults([])
        const startTime = Date.now()
        setImportStartTime(startTime)

        try {
            const importResults = await onImport(selectedFile)
            setResults(importResults)
            setImportDuration(Date.now() - startTime)

            toast.success("Importacion exitosa", {
                description: `Se han importado ${importResults.filter((r) => r.rowNumber)} registros con exito`,
            })
        } catch (error) {
            setResults([
                {
                    success: false,
                    mensaje: error instanceof Error ? error.message : "Ocurrio un error al importar el archivo",
                },
            ])
            toast.error("Error al importar el archivo", {
                description: error instanceof Error ? error.message : "Ocurrio un error al importar el archivo",
            })
            setImportDuration(Date.now() - startTime)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setSelectedFile(null)
        setResults([])
        setIsLoading(false)
        setImportStartTime(null)
        setImportDuration(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        onOpenChange(false)
    }

    const handleDownloadErrorReport = () => {
        const errors = results.filter((r) => !r.success)
        const errorReport = errors
            .map((error, index) => {
                const rowInfo = error.rowNumber ? `Fila ${error.rowNumber}` : `Error ${index + 1}`
                return `${rowInfo}: ${error.mensaje}`
            })
            .join("\n")

        const blob = new Blob([errorReport], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `import-errors-${new Date().toISOString().split("T")[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const formatDuration = (ms: number): string => {
        if (ms < 1000) return `${ms}ms`
        return `${(ms / 1000).toFixed(2)}s`
    }

    const successCount = results.filter((r) => r.success).length
    const errorCount = results.filter((r) => !r.success).length
    const totalCount = results.length
    const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : "0"

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    {description && <DialogDescription className="text-muted-foreground">{description}</DialogDescription>}
                </DialogHeader>

                <div className="flex flex-col gap-6 flex-1 overflow-hidden">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={acceptedFormats}
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="file-upload"
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-3 px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-all",
                                    "hover:border-primary hover:bg-accent/50",
                                    isLoading && "opacity-50 cursor-not-allowed pointer-events-none",
                                    selectedFile && "border-primary bg-accent/30",
                                )}
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                    {selectedFile ? (
                                        <FileSpreadsheet className="w-6 h-6 text-primary" />
                                    ) : (
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "Escoga un archivo ara subir"}</p>
                                    {selectedFile && <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>}
                                    {!selectedFile && <p className="text-xs text-muted-foreground">Arrastra y suelta o carga el archivo</p>}
                                </div>
                            </label>
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                                <p className="font-medium">Requerimientos del archivo:</p>
                                <ul className="list-disc list-inside space-y-0.5 ml-1">
                                    <li>Formatos aceptados: {acceptedFormats}</li>
                                    <li>Tamaño maximo del archivo: {maxFileSizeMB} MB</li>
                                    <li>Asegurese de que el archivo excel tenga los titulos correctos en las columnas</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button onClick={handleImport} disabled={!selectedFile || isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Importando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Importar archivo
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {results.length > 0 && (
                        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                            <div className="grid grid-cols-4 gap-3">
                                <div className="p-3 rounded-lg bg-muted/50 border">
                                    <p className="text-xs text-muted-foreground mb-1">Filas totales</p>
                                    <p className="text-2xl font-bold">{totalCount}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                                    <p className="text-xs text-green-700 dark:text-green-400 mb-1">Completadas</p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{successCount}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                    <p className="text-xs text-red-700 dark:text-red-400 mb-1">Errores</p>
                                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{errorCount}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                                    <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Porcentaje de completado</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{successRate}%</p>
                                </div>
                            </div>

                            {importDuration !== null && (
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border text-xs">
                                    <span className="text-muted-foreground">Importacion completada en {formatDuration(importDuration)}</span>
                                    {errorCount > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownloadErrorReport}
                                            className="h-7 text-xs bg-transparent"
                                        >
                                            <Download className="w-3 h-3 mr-1.5" />
                                            Descargar reporte de errores
                                        </Button>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Log de importado</h3>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {successCount}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                        <XCircle className="w-3 h-3" />
                                        {errorCount}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto rounded-lg border bg-muted/30 p-4 space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {results.map((result, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2, delay: index * 0.02 }}
                                            className={cn(
                                                "flex items-start gap-3 p-3 rounded-md text-sm border",
                                                result.success
                                                    ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900"
                                                    : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900",
                                            )}
                                        >
                                            {result.success ? (
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 space-y-1">
                                                {result.rowNumber && <p className="text-xs font-medium opacity-70">Fila {result.rowNumber}</p>}
                                                <p className="leading-relaxed">{result.mensaje}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ImportDialog