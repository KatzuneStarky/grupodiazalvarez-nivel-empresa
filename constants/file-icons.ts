import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Code,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  File,
} from "lucide-react"

export const getFileIcon = (fileName: string, type: "file" | "folder", isOpen?: boolean) => {
  if (type === "folder") {
    return isOpen ? FolderOpen : Folder
  }

  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
    case "rtf":
      return FileText

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return ImageIcon

    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
      return Video

    case "mp3":
    case "wav":
    case "flac":
    case "aac":
      return Music

    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return Archive

    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "scss":
    case "json":
    case "xml":
    case "py":
    case "java":
    case "cpp":
    case "c":
      return Code

    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheet

    default:
      return File
  }
}

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ""

  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export const formatDate = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Today"
  if (diffDays === 2) return "Yesterday"
  if (diffDays <= 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}