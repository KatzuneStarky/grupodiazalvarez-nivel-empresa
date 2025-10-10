export interface ImportResult {
    success: boolean
    mensaje: string
    rowNumber?: number
}

export interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onImport: (file: File) => Promise<ImportResult[]>
  acceptedFormats?: string
  maxFileSizeMB?: number
}