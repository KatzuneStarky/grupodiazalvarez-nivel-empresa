import { NotificationType } from "../enum/notification-type"

export interface NotificationInterface {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date
  readBy: string[]              
  createdBy?: string            
  systemGenerated?: boolean     
  relatedId?: string            
  relatedType?: NotificationType
  actionUrl?: string            
  icon?: string                  
  expiresAt?: Date
  priority?: "low" | "medium" | "high"
  visibleTo?: string[]          
  setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>>
  openDialog?: boolean
  dialogData?: React.ReactNode
}