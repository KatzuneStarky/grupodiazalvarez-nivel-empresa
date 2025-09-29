import { FileItem } from "@/modules/usuarios/types/file-item"

export const getFileCardStyle = (file: FileItem) => {
  if (file.type === "folder") {
    const folderName = file.name.toLowerCase()
    if (folderName.includes("document") || folderName.includes("doc")) {
      return { cardClass: "file-card-folder documents", iconClass: "icon-folder-blue" }
    }
    if (folderName.includes("image") || folderName.includes("photo") || folderName.includes("picture")) {
      return { cardClass: "file-card-folder images", iconClass: "icon-folder-pink" }
    }
    if (folderName.includes("video") || folderName.includes("movie")) {
      return { cardClass: "file-card-folder videos", iconClass: "icon-folder-red" }
    }
    if (folderName.includes("music") || folderName.includes("audio") || folderName.includes("sound")) {
      return { cardClass: "file-card-folder music", iconClass: "icon-folder-green" }
    }
    if (folderName.includes("project") || folderName.includes("work") || folderName.includes("dev")) {
      return { cardClass: "file-card-folder projects", iconClass: "icon-folder-purple" }
    }
    if (folderName.includes("download")) {
      return { cardClass: "file-card-folder downloads", iconClass: "icon-folder-orange" }
    }
    return { cardClass: "file-card-folder", iconClass: "icon-folder-blue" }
  }

  const extension = file.name.split(".").pop()?.toLowerCase()
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) {
    return { cardClass: "file-card-document", iconClass: "icon-file-document" }
  }
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")) {
    return { cardClass: "file-card-image", iconClass: "icon-file-image" }
  }
  if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension || "")) {
    return { cardClass: "file-card-video", iconClass: "icon-file-video" }
  }
  if (["mp3", "wav", "flac", "aac"].includes(extension || "")) {
    return { cardClass: "file-card-audio", iconClass: "icon-file-audio" }
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
    return { cardClass: "file-card-archive", iconClass: "icon-file-archive" }
  }
  if (["js", "ts", "jsx", "tsx", "html", "css", "py", "java", "cpp"].includes(extension || "")) {
    return { cardClass: "file-card-code", iconClass: "icon-file-code" }
  }
  return { cardClass: "file-card-default", iconClass: "icon-file-default" }
}