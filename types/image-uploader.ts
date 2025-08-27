export type UploadImageProps = {
  path: string
  id: string
  image?: string
  onImageUpload: (url: string) => void
  uploadText?: string
  uploadSubtext?: string
  maxFileSize?: number
  allowedTypes?: string[]
  className?: string
  uploadAreaClassName?: string
  previewClassName?: string
  showFileName?: boolean
  autoUpload?: boolean
  errorMessages?: {
    fileSize?: string
    fileType?: string
    uploadFailed?: string
    unauthorized?: string
  }
  disabled?: boolean
  useCamera?: boolean
  required?: boolean
  showFileInfo?: boolean
  placeholderImage?: string
  showFileTypeIcon?: boolean
}