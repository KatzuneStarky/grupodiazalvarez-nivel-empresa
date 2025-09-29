export type ShareRole = "viewer" | "editor" | "owner"

export interface FileShare {
  userId: string      
  role: ShareRole     
  sharedAt: Date      
  expiresAt?: Date    
  canReshare?: boolean
}