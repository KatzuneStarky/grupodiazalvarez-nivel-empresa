"use client"

import { useRef, useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Loader2Icon, UploadIcon, FileIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react"

interface ImportDialogProps<T> {
    onImport: (data: T[]) => void
    title?: string
    triggerLabel?: string
}

type ImportState = "idle" | "loading" | "preview" | "error" | "success"

const ImportDialog = <T extends Record<string, any>>({
    onImport,
    title = "Import Data",
    triggerLabel = "Import",
}: ImportDialogProps<T>) => {
    const [state, setState] = useState<ImportState>("idle")
    const [parsedData, setParsedData] = useState<T[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string>("")
    const [open, setOpen] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const resetState = () => {
        setState("idle")
        setFile(null)
        setParsedData([])
        setError("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Validate file type
        const validTypes = [
            "application/json",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ]
        const validExtensions = [".json", ".xlsx", ".xls"]
        const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf("."))

        if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
            setError("Invalid file type. Please upload a JSON or Excel (.xlsx) file.")
            setState("error")
            return
        }

        setFile(selectedFile)
        setState("loading")
        setError("")

        try {
            let data: T[]

            if (fileExtension === ".json") {
                // Parse JSON file
                data = await parseJsonFile(selectedFile)
            } else {
                // Parse Excel file
                data = await parseExcelFile(selectedFile)
            }

            if (!data || data.length === 0) {
                throw new Error("No data found in file")
            }

            setParsedData(data)
            setState("preview")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to parse file")
            setState("error")
        }
    }

    const parseJsonFile = (file: File): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string
                    const parsed = JSON.parse(content)

                    // Ensure data is an array
                    const dataArray = Array.isArray(parsed) ? parsed : [parsed]
                    resolve(dataArray as T[])
                } catch (error) {
                    reject(new Error("Invalid JSON format"))
                }
            }
            reader.onerror = () => reject(new Error("Failed to read file"))
            reader.readAsText(file)
        })
    }

    const parseExcelFile = (file: File): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = e.target?.result
                    const workbook = XLSX.read(data, { type: "binary" })

                    // Get first sheet
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]

                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json<T>(worksheet)

                    if (jsonData.length === 0) {
                        reject(new Error("Excel file is empty"))
                        return
                    }

                    resolve(jsonData)
                } catch (error) {
                    reject(new Error("Failed to parse Excel file"))
                }
            }
            reader.onerror = () => reject(new Error("Failed to read file"))
            reader.readAsBinaryString(file)
        })
    }

    const handleConfirmImport = () => {
        setState("loading")
        try {
            onImport(parsedData)
            setState("success")
            setTimeout(() => {
                setOpen(false)
                resetState()
            }, 1500)
        } catch (err) {
            setError("Failed to import data")
            setState("error")
        }
    }

    const handleCancel = () => {
        setOpen(false)
        resetState()
    }

    const previewData = parsedData.slice(0, 5)
    const columns = previewData.length > 0 ? Object.keys(previewData[0]) : []

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="sm:w-auto">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Upload a JSON or Excel (.xlsx) file to import data. You'll see a preview before confirming.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="file-upload">Select File</Label>
                        <Input
                            id="file-upload"
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.xlsx,.xls,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                            disabled={state === "loading"}
                        />
                    </div>

                    {file && (
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <FileIcon className="size-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {file.type || "Unknown type"} • {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                    )}

                    {state === "loading" && (
                        <div className="flex items-center justify-center gap-2 p-8">
                            <Loader2Icon className="size-5 animate-spin" />
                            <span className="text-sm text-muted-foreground">Processing file...</span>
                        </div>
                    )}

                    {state === "error" && error && (
                        <Alert variant="destructive">
                            <AlertCircleIcon className="size-4" />
                            <div className="ml-2">
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </Alert>
                    )}

                    {state === "success" && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                            <CheckCircleIcon className="size-4 text-green-600 dark:text-green-400" />
                            <div className="ml-2">
                                <p className="font-medium text-green-600 dark:text-green-400">Success!</p>
                                <p className="text-sm text-green-600 dark:text-green-400">Data imported successfully</p>
                            </div>
                        </Alert>
                    )}

                    {state === "preview" && previewData.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Preview (First 5 rows)</Label>
                                <span className="text-xs text-muted-foreground">Total rows: {parsedData.length}</span>
                            </div>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableHead key={column} className="font-semibold">
                                                    {column}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewData.map((row, index) => (
                                            <TableRow key={index}>
                                                {columns.map((column) => (
                                                    <TableCell key={column} className="max-w-[200px] truncate">
                                                        {String(row[column] ?? "")}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={state === "loading"}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmImport} disabled={state !== "preview" || parsedData.length === 0}>
                        {state === "loading" && <Loader2Icon className="animate-spin" />}
                        Confirm Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ImportDialog