import { File, FileImage } from "lucide-react"

export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return <FileImage className="w-5 h-5" />
  }
  return <File className="w-5 h-5" />
}