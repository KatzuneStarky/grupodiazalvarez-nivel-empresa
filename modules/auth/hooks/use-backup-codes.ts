"use client"

import { useState } from "react"
import { auth, db } from "@/firebase/client"
import { doc, setDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore"
import { toast } from "sonner"

interface BackupCode {
    code: string
    used: boolean
    createdAt: Date
}

export const useBackupCodes = () => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [backupCodes, setBackupCodes] = useState<string[]>([])

    /**
     * Generate 10 random backup codes
     */
    const generateBackupCodes = async () => {
        try {
            setIsGenerating(true)
            const user = auth.currentUser

            if (!user) {
                throw new Error("No user is currently signed in")
            }

            // Generate 10 random 8-character codes
            const codes: BackupCode[] = Array.from({ length: 10 }, () => ({
                code: generateRandomCode(),
                used: false,
                createdAt: new Date()
            }))

            // Store in Firestore
            const userRef = doc(db, "usuarios", user.uid)
            await setDoc(userRef, {
                backupCodes: codes
            }, { merge: true })

            const codeStrings = codes.map(c => c.code)
            setBackupCodes(codeStrings)

            toast.success("Códigos de respaldo generados", {
                description: "Guarda estos códigos en un lugar seguro"
            })

            return { success: true, codes: codeStrings }
        } catch (error: any) {
            console.error("Error generating backup codes:", error)
            toast.error(error.message || "Error al generar códigos de respaldo")
            return { success: false, error: error.message }
        } finally {
            setIsGenerating(false)
        }
    }

    /**
     * Verify a backup code
     */
    const verifyBackupCode = async (code: string) => {
        try {
            const user = auth.currentUser

            if (!user) {
                throw new Error("No user is currently signed in")
            }

            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                throw new Error("User document not found")
            }

            const userData = userDoc.data()
            const backupCodes: BackupCode[] = userData.backupCodes || []

            // Find the code
            const codeIndex = backupCodes.findIndex(
                bc => bc.code === code && !bc.used
            )

            if (codeIndex === -1) {
                throw new Error("Código inválido o ya utilizado")
            }

            // Mark code as used
            backupCodes[codeIndex].used = true

            await updateDoc(userRef, {
                backupCodes: backupCodes
            })

            toast.success("Código verificado correctamente")
            return { success: true }
        } catch (error: any) {
            console.error("Error verifying backup code:", error)
            toast.error(error.message || "Código inválido")
            return { success: false, error: error.message }
        }
    }

    /**
     * Get remaining backup codes count
     */
    const getRemainingCodesCount = async () => {
        try {
            const user = auth.currentUser

            if (!user) {
                return 0
            }

            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                return 0
            }

            const userData = userDoc.data()
            const backupCodes: BackupCode[] = userData.backupCodes || []

            return backupCodes.filter(bc => !bc.used).length
        } catch (error) {
            console.error("Error getting backup codes count:", error)
            return 0
        }
    }

    /**
     * Download backup codes as text file
     */
    const downloadBackupCodes = (codes: string[]) => {
        const content = `
CÓDIGOS DE RESPALDO - AUTENTICACIÓN DE DOS FACTORES
====================================================

Guarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.

${codes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Generado el: ${new Date().toLocaleString('es-MX')}

IMPORTANTE:
- Cada código solo puede usarse una vez
- Guarda estos códigos en un lugar seguro
- No compartas estos códigos con nadie
- Si pierdes el acceso a tu teléfono, puedes usar estos códigos para iniciar sesión
        `.trim()

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-codes-${new Date().getTime()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return {
        isGenerating,
        backupCodes,
        generateBackupCodes,
        verifyBackupCode,
        getRemainingCodesCount,
        downloadBackupCodes
    }
}

/**
 * Generate a random 8-character alphanumeric code
 */
function generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''

    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Format as XXXX-XXXX
    return `${code.slice(0, 4)}-${code.slice(4)}`
}
