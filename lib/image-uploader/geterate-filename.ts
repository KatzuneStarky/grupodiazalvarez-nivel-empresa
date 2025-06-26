import { getFileExtension } from "./get-file-extension"

export const generateFilename = (file: File, id: string) => {
    const extension = file.name.split(".").pop() || getFileExtension(file.type)
    return `${id}-${Date.now()}.${extension}`
}