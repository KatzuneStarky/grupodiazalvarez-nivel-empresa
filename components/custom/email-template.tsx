import { NotificationType } from "@/modules/notificaciones/enum/notification-type";
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { EmailTemplateProps } from "@/types/email-template";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import {
    Html,
    Head,
    Body,
    Container,
    Text,
    Section,
    Button,
    Hr,
} from "@react-email/components";

const priorityColors = {
    low: "#6B7280",
    medium: "#3B82F6",
    high: "#EF4444",
};

export const getEmailIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.Equipo:
            return "🛠️";
        case NotificationType.Mantenimiento:
            return "🔧";
        case NotificationType.Revision:
            return "📋";
        case NotificationType.ReporteViaje:
            return "🚛";
        case NotificationType.Certificado:
            return "📄";
        case NotificationType.ArchivosVencimiento:
            return "⏰";
        case NotificationType.Operador:
            return "👷";
        case NotificationType.Estacion:
            return "⛽";
        case NotificationType.InventarioEstacion:
            return "📦";
        default:
            return "🔔";
    }
};

const EmailTemplate = ({
    systemGenerated,
    description,
    createdAt,
    createdBy,
    jsonData,
    priority,
    title,
    type,
}: EmailTemplateProps) => {

    const priorityColor = priority
        ? priorityColors[priority]
        : priorityColors.medium

    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: "Arial, sans-serif" }}>
                <Container style={{ backgroundColor: "#fff", borderColor: priorityColor, border: "4px solid", borderRadius: "8px", padding: "20px" }}>
                    <Section>
                        <span style={{ display: "inline-block", verticalAlign: "middle", fontSize: "24px", color: "#111827" }}>
                            {getEmailIcon(type)} {type}
                        </span>
                        <span style={{ fontSize: "24px" }}>{" "} -</span>
                        <span style={{ display: "inline-block", verticalAlign: "middle", fontSize: "24px", color: "#111827", marginLeft: "8px" }}>
                            {title}
                        </span>
                    </Section>
                    <Text style={{ color: "#374151", fontSize: "14px" }}>{description}</Text>

                    <Section>
                        <Text style={{ fontWeight: "bold", fontSize: "12px", color: "#6b7280" }}>
                            Datos del evento:
                        </Text>
                        <pre
                            style={{
                                background: "#f3f4f6",
                                padding: "12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "#1f2937",
                            }}
                        >
                            {jsonData ? JSON.stringify(jsonData) : "No hay datos adicionales para mostrar."}
                        </pre>
                    </Section>

                    <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />

                    <Section style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "12px" }}>
                        <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                            {systemGenerated ? (
                                <>Generado por: Sistema</>
                            ) : (
                                <>Creado por: {createdBy}</>
                            )}
                        </Text>

                        <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                            {format(parseFirebaseDate(createdAt), "PPP", {
                                locale: es,
                            })}
                        </Text>
                    </Section>

                    <Button
                        href="#"
                        style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            padding: "10px 16px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            display: "inline-block",
                            fontSize: "14px",
                        }}
                    >
                        Ver detalles
                    </Button>
                </Container>
            </Body>
        </Html>
    )
}

export default EmailTemplate