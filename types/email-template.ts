import { NotificationType } from "@/modules/notificaciones/enum/notification-type";

export interface EmailTemplateProps {
    priority: "low" | "medium" | "high";
    systemGenerated: boolean
    type: NotificationType
    description: string
    jsonData?: string
    createdBy: string
    createdAt: Date
    title: string
}

export interface SendEmailBody extends EmailTemplateProps {
    to: string;
    subject: string;
}