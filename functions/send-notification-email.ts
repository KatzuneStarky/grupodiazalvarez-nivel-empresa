import { SendEmailBody } from "@/types/email-template";

export const sendNotificationEmail = async ({
    to,
    subject,
    createdAt,
    createdBy,
    description,
    title,
    type,
    priority,
    systemGenerated,
    jsonData
}: SendEmailBody) => {
    try {
        const res = await fetch("/api/send", {
            method: "POST",
            body: JSON.stringify({
                to,
                subject,
                priority,
                systemGenerated,
                type,
                description,
                jsonData,
                createdBy,
                createdAt,
                title,
            })
        })

        const data = await res.json()
        if (res.ok) {
            console.log("Email sent successfully", {
                description: data.message,
            })
        } else {
            console.log("Error sending email", {
                description: data.message,
            })
        }
    } catch (error) {
        console.log(error);
    }

}