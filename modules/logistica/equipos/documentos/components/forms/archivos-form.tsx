"use client"

import { ArchivosSchema, ArchivosVencimientoSchema, ArchivosVencimientoSchemaType, CertificadoSchema, CertificadoSchemaType } from "../../schemas/documentos.schema";
import { AlertCircle, Check, CheckCircle, ChevronsUpDown, FileSpreadsheet, FileText, ImageIcon, Upload, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos";
import { MAX_FILE_SIZE_MB, useFileUpload } from "../../hooks/use-file-upload";
import { Archivo } from "@/modules/logistica/bdd/equipos/types/archivos";
import { DatePickerForm } from "@/components/custom/date-picker-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getFileIcon2 } from "@/lib/image-uploader/get-file-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatFileSize } from "@/utils/format-file-size";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Progress } from "@/components/ui/progress";
import { uploadFiles } from "../../actions/write";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const fileSchemas = {
    archivos: ArchivosSchema,
    certificados: CertificadoSchema,
    archivosVencimiento: ArchivosVencimientoSchema,
} as const;

type FileCategory = keyof typeof fileSchemas;

const ArchivosForm = ({ equipoId, fileCategory }: { equipoId?: string, fileCategory: FileCategory }) => {
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadMessage, setUploadMessage] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { equipos } = useEquipos()
    const router = useRouter()


    const schema = fileSchemas[fileCategory];

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            equipoId,
            files: []
        }
    })

    const {
        imagePreviews,
        handleFileChange,
        handleRemoveFile,
        selectedFiles,
        setSelectedFiles,
        error
    } = useFileUpload(form);

    const onSubmitArchivos = async (data: z.infer<typeof schema>) => {
        try {
            setIsSubmitting(true)
            setIsUploading(true)
            setUploadStatus("idle")

            toast.promise(uploadFiles(selectedFiles, equipoId ? equipoId : data.equipoId, fileCategory), {
                success: (result: [Archivo[],
                    { success: boolean, message: string, error?: Error }
                ]) => {
                    setUploadStatus("success");
                    setUploadMessage(result[1].message);
                    return "Archivos subidos exitosamente";
                },
                loading: "Subiendo documentos...",
                error: (error: Error) => {
                    setUploadStatus("error");
                    setUploadMessage(error.message);
                    form.reset({
                        equipoId,
                        files: []
                    })
                    return "Error al subir documentos";
                },
            })

            form.reset({
                equipoId,
                files: []
            })
            router.refresh()
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            setIsUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitArchivos)} className='flex flex-col gap-4'>
                <div className={cn(
                    fileCategory === "certificados" && "grid grid-cols-2 gap-4 items-end",
                    fileCategory === "archivosVencimiento" && "grid grid-cols-2 gap-4 items-end"
                )}>
                    {equipoId ? null : (
                        <FormField
                            control={form.control}
                            name="equipoId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel>Equipo</FormLabel>
                                    <Popover>
                                        <PopoverTrigger disabled={isSubmitting} asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? equipos.find(
                                                            (equipo) => equipo.id === field.value
                                                        )?.numEconomico
                                                        : "Selecciona un equipo"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar equipo..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontró ningún equipo.</CommandEmpty>
                                                    <CommandGroup className="">
                                                        {equipos.map((equipo) => (
                                                            <CommandItem
                                                                value={equipo.numEconomico}
                                                                key={equipo.numEconomico}
                                                                onSelect={() => {
                                                                    form.setValue("equipoId", equipo.id);
                                                                }}
                                                            >
                                                                {equipo.numEconomico} - {equipo.marca} - {equipo.serie}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        equipo.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {fileCategory === "archivosVencimiento" && (
                        <DatePickerForm<ArchivosVencimientoSchemaType>
                            label="Fecha de expiracion"
                            name="fecha"
                            disabled={isSubmitting}
                        />
                    )}

                    {fileCategory === "certificados" && (
                        <DatePickerForm<CertificadoSchemaType>
                            label="Fecha de expiracion"
                            name="fecha"
                            disabled={isSubmitting}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Subir documentos</Label>
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 cursor-pointer overflow-hidden",
                            "bg-gradient-to-br from-primary/40 via-background to-accent/30",
                            form.formState.errors.files && "border-destructive bg-destructive/5",
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".png,.jpg,.jpeg,.xlsx,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="relative space-y-6">
                            <div
                                className={cn(
                                    "inline-flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-300 transform",
                                    "bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:scale-105 group-hover:from-primary/20 group-hover:to-accent/20",
                                )}
                            >
                                <Upload
                                    className={cn(
                                        "transition-all duration-300", "w-8 h-8 group-hover:w-9 group-hover:h-9",
                                    )}
                                />
                            </div>

                            <div className="space-y-3">
                                <p className="text-xl font-bold text-foreground">
                                    Haz click aqui para seleccionar los archivos
                                </p>
                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                                        <ImageIcon className="w-3 h-3 text-primary" />
                                        <span className="text-xs font-medium text-primary">PNG, JPG</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-accent/30 rounded-full">
                                        <FileText className="w-3 h-3 text-primary" />
                                        <span className="text-xs font-medium text-primary">PDF</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-secondary/30 rounded-full">
                                        <FileSpreadsheet className="w-3 h-3 text-primary" />
                                        <span className="text-xs font-medium text-primary">XLSX</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Maximo {MAX_FILE_SIZE_MB}MB por archivo</p>
                            </div>
                        </div>
                    </div>

                    {form.formState.errors.files && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {form.formState.errors.files.message}
                        </p>
                    )}
                </div>

                {selectedFiles.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Archivos seleccionados ({selectedFiles.length})</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedFiles([])
                                    setIsUploading(false)
                                    setUploadStatus("idle")
                                    setUploadMessage("")
                                    form.setValue("files", [])
                                }}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Eliminar todos
                            </Button>
                        </div>

                        <ScrollArea className="max-w-xl rounded-md whitespace-nowrap overflow-hidden place-self-center p-1">
                            <div className="flex w-max space-x-4 p-2">
                                {selectedFiles.map((filePreview, index) => (
                                    <Card
                                        key={index}
                                        className="h-40 relative overflow-hidden border-border"
                                    >
                                        <CardContent>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-3 right-3 h-8 w-8 p-0 z-10"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>

                                            {filePreview.type.startsWith("image/") ? (
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={imagePreviews[index] || "/placeholder.svg"}
                                                        alt={filePreview.name}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-16 overflow-hidden">
                                                    <div className="text-center space-y-3 relative z-10">
                                                        <img src={getFileIcon2(filePreview.name.split('.').pop(), filePreview.type)} className="w-8 h-8 object-cover" />
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {filePreview.type.split("/")[1]?.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-4 space-y-3">
                                                <div className="space-y-2 pb-1">
                                                    <p className="font-semibold text-sm truncate text-foreground" title={filePreview.name}>
                                                        {filePreview.name}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            {formatFileSize(filePreview.size)}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-xs font-semibold border border-primary/20">
                                                            {filePreview.type.split("/")[1]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                )}

                {isUploading && (
                    <Card className="border-accent/20 bg-accent/5">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent"></div>
                                    <span className="font-medium">Uploading documents...</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {uploadStatus === "success" && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                            {uploadMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {uploadStatus === "error" && (
                    <Alert className="border-destructive/20 bg-destructive/5">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive font-medium">{uploadMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="w-full pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isUploading || selectedFiles.length === 0}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                                Subiendo...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Subir {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""} documentos
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ArchivosForm