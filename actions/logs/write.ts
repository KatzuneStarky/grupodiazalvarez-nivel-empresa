import { doc, setDoc } from "firebase/firestore";
import { SystemLog } from "@/types/system-logs";
import { db } from "@/firebase/client";
import { v7 as uuidv7 } from "uuid"

export const writeLog = async (data: SystemLog): Promise<{
    success: boolean
    message: string
    error?: Error
}> => {
    try {
        const id = uuidv7()

        if (!data.userId || !data.userEmail || !data.userRole || !data.timestamp || !data.action || !data.resourceType || !data.description) {
            return {
                success: false,
                message: "Faltan datos para escribir el log"
            }
        }

        const logRef = doc(db, "logs", id)
        await setDoc(logRef, {
            id,
            userId: data.userId,
            userEmail: data.userEmail,
            userRole: data.userRole,
            timestamp: data.timestamp,
            action: data.action,
            resourceType: data.resourceType,
            resourceId: data.resourceId,
            description: data.description,
            metadata: data.metadata,
            status: data.status,
            errorMessage: data.errorMessage,
            empresaId: data.empresaId,
            ip: data.ip,
            userAgent: data.userAgent,
            location: data.location,
            userName: data.userName
        })

        return {
            success: true,
            message: "Log escrito correctamente"
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Error al escribir el log",
            error: error as Error
        }
    }
}