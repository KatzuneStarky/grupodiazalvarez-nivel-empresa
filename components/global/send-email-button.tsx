"use client"

import { NotificationType } from "@/modules/notificaciones/enum/notification-type"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface EmailTemplateProps {
    priority: "low" | "medium" | "high";
    systemGenerated: boolean
    type: NotificationType
    description: string
    jsonData?: string
    createdBy: string
    createdAt: Date
    title: string
}

interface SendEmailBody extends EmailTemplateProps {
    to: string;
    subject: string;
}

const SendEmailButton = () => {
    const emailData: SendEmailBody = {
        to: "aramirez_17@alu.uabcs.mx",
        subject: "🔔 Tienes una nueva notificacion 🔔",
        priority: "medium",
        systemGenerated: false,
        type: NotificationType.Estacion,
        description: "Se a generado un nuevo registro de estacion",
        jsonData: "",
        createdBy: "hOMA4gHNqNVut6kV27DvhWT9RKm1",
        createdAt: new Date(),
        title: "Nueva estacion"
    }

    const sendEmail = async () => {
        try {
            const res = await fetch("/api/send", {
                method: "POST",
                body: JSON.stringify(emailData)
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Email sent successfully", {
                    description: data.message,
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button onClick={sendEmail}>Send Email</Button>
    )
}

export default SendEmailButton