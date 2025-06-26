export type UploadImageProps = {
    /** Firebase storage path where the image will be stored */
    path: string
  
    /** Unique identifier for the upload, used in generating filenames */
    id: string
  
    /** Optional existing image URL to display */
    image?: string
  
    /** Callback function called when an image is successfully uploaded */
    onImageUpload: (url: string) => void
  
    /** Optional text to display in the upload area */
    uploadText?: string
  
    /** Optional subtext to display in the upload area */
    uploadSubtext?: string
  
    /** Maximum file size in bytes (default: 5MB) */
    maxFileSize?: number
  
    /** Array of allowed MIME types (default: jpeg, png, webp, jpg) */
    allowedTypes?: string[]
  
    /** Custom CSS class for the container */
    className?: string
  
    /** Custom CSS class for the upload area */
    uploadAreaClassName?: string
  
    /** Custom CSS class for the preview image */
    previewClassName?: string
  
    /** Whether to show the file name after selection (default: false) */
    showFileName?: boolean
  
    /** Whether to auto-upload on file selection (default: true) */
    autoUpload?: boolean
  
    /** Custom error messages */
    errorMessages?: {
      fileSize?: string
      fileType?: string
      uploadFailed?: string
      unauthorized?: string
    }
  
    /** Whether the input is disabled */
    disabled?: boolean
  
    /** Whether to use the device camera when possible */
    useCamera?: boolean
  
    /** Whether the input is required */
    required?: boolean
  
    /** Whether to show detailed file information */
    showFileInfo?: boolean
  
    /** Custom placeholder image when no image is selected */
    placeholderImage?: string
  
    /** Whether to show a file type icon */
    showFileTypeIcon?: boolean
  }