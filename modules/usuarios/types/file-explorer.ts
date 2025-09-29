import { FileAction } from "./file-actions"

export interface FileExplorerState {
  currentPath: string[]
  selectedItems: string[]
  viewMode: "grid" | "list"
  sortBy: "name" | "size" | "lastModified"
  sortOrder: "asc" | "desc"

  searchQuery?: string
  breadcrumbs?: string[]
  showHidden?: boolean
  activeAction?: FileAction | null
  loading?: boolean
  trashMode?: boolean
  filterTags?: string[]
}