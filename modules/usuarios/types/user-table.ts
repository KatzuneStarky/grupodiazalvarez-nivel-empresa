import { SortDirection, SortField } from "./user"
import { SystemUser } from "@/types/usuario"

export interface UserTableProps {
  users: SystemUser[]
  selectedUserIds: Set<string>
  onSelectUser: (userId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  allSelected: boolean
  someSelected: boolean
  onViewUser: (user: SystemUser) => void
  onEditUser: (user: SystemUser) => void
  onSuspendUser: (user: SystemUser) => void
  onSort: (field: SortField) => void
  sortField: SortField
  sortDirection: SortDirection
}