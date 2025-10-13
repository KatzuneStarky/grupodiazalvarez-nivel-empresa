import { NotificationInterface } from "./notifications";
import { SystemUser } from "@/types/usuario";

export interface NotificationsContextProps {
  notifications: NotificationInterface[];
  unreadCount: number;
  currentUser: SystemUser | null;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  reloadNotifications: () => Promise<void>;
  hasMore: boolean,
  loadMore: () => void
}