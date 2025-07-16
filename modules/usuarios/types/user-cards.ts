import { SystemUser } from "@/types/usuario"

export interface UserCardsProps {
    users: SystemUser[]
    selectedUserIds: Set<string>
    onSelectUser: (userId: string, selected: boolean) => void
    onViewUser: (user: SystemUser) => void
    onEditUser: (user: SystemUser) => void
    onSuspendUser: (user: SystemUser) => void
    variant?: "cards" | "list"
}