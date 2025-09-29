import { FileShare } from "./user-document-permission"
import { Tag } from "emblor"

export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  extension?: string
  size?: number
  mimeType?: string
  hash?: string

  ownerId: string
  parentId?: string

  uploadedAt: Date
  lastModified: Date
  expirationDate?: Date

  tags?: Tag[]
  description?: string
  version?: number
  archived?: boolean
  isFavorite?: boolean

  shares?: FileShare[]
  children?: FileItem[]
}