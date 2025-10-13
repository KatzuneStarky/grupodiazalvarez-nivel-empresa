"use client"

import { Button } from "../ui/button"
import { toast } from "sonner"

const SendEmailButton = () => {
    const sendEmail = async () => {
        try {
            const res = await fetch("/api/send", {
                method: "POST",
                body: JSON.stringify({
                    to: "aramirez_17@alu.uabcs.mx",
                    subject: "test",
                })
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