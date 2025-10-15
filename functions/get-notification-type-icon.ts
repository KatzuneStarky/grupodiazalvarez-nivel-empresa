import { NotificationType } from "@/modules/notificaciones/enum/notification-type";

export const getNotificationTypeIcon = (type: NotificationType) => {
    switch(type) {
        case "message":
            return "tabler:message-filled"
        case "reminder":
            return "fluent-mdl2:mail-reminder"
        case "task":
            return "mingcute:task-2-line"
        case "system":
            return "tdesign:system-code-filled"
        case "Folder":
            return "material-symbols:folder"
        case "Equipo":
            return "mdi:tanker-truck"
        case "Tanque":
            return "mdi:train-car-tank"
        case "Mantenimiento":
            return "wpf:maintenance"
        case "Revision":
            return "mdi:file-document-edit"
        case "ReporteViaje":
            return "fa-solid:route"
        case "Invitacion":
            return "mdi:account-plus"
        case "Archivo":
            return "mdi:file"
        case "Certificado":
            return "mdi:certificate"
        case "ArchivosVencimiento":
            return "mdi:file-alert"
        case "Operador":
            return "mdi:account"
        case "Estacion":
            return "mingcute:gas-station-fill"
        case "Cliente":
            return "mdi:account-group"
    }
}