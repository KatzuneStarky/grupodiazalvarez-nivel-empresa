import { FileType } from "@/types/file-types";
import { File, FileImage } from "lucide-react"

export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return <FileImage className="w-5 h-5" />
  }
  return <File className="w-5 h-5" />
}

export const getFileIcon2 = (
    extension: string | undefined,
    type: FileType | string,
) => {
    switch (extension) {
        case "pdf":
            return "/images/pdf-icon-2.png";
        case "doc":
            return "/images/word icon 2.png";
        case "docx":
            return "/images/word icon 2.png";
        case "csv":
            return "/images/csv icon.png";
        case "txt":
            return "/images/txt icon.png";
        case "xls":
        case "xlsx":
            return "/images/excel icon 2.png";
        case "svg":
            return "/images/svg icon.png";
        case "mkv":
        case "mov":
        case "avi":
        case "wmv":
        case "mp4":
        case "flv":
        case "webm":
        case "m4v":
        case "3gp":
            return "/images/video icon.png";
        // Audio
        case "mp3":
        case "mpeg":
        case "wav":
        case "aac":
        case "flac":
        case "ogg":
        case "wma":
        case "m4a":
        case "aiff":
        case "alac":
            return "/images/music icon.png";

        default:
            switch (type) {
                case "image":
                    return "/images/image icon.png";
                case "document":
                    return "/images/document icon.png";
                case "video":
                    return "/images/video file icon.png";
                case "audio":
                    return "/images/audio file icon.png";
                default:
                    return "/images/file unknown icon.png";
            }
    }
};