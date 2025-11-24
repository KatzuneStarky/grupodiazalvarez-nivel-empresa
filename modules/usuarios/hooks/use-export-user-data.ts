"use client"

import { auth, db } from "@/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { toast } from "sonner"

interface UserExportData {
    // Firebase Auth Data
    auth: {
        uid: string
        email: string | null
        displayName: string | null
        emailVerified: boolean
        phoneNumber: string | null
        photoURL: string | null
        creationTime: string | null
        lastSignInTime: string | null
        providerData: any[]
    }
    // Firestore User Data
    profile: any
    // Multi-Factor Authentication
    mfa: {
        enrolledFactors: Array<{
            uid: string
            displayName: string | null
            phoneNumber: string
            enrollmentTime: string
        }>
    }
    // Export Metadata
    exportMetadata: {
        exportedAt: string
        exportedBy: string
        version: string
    }
}

export const useExportUserData = () => {
    const exportUserData = async () => {
        try {
            const user = auth.currentUser

            if (!user) {
                toast.error("No hay usuario autenticado")
                return
            }

            // Gather Firebase Auth data
            const authData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                creationTime: user.metadata.creationTime || null,
                lastSignInTime: user.metadata.lastSignInTime || null,
                providerData: user.providerData.map(provider => ({
                    providerId: provider.providerId,
                    uid: provider.uid,
                    displayName: provider.displayName,
                    email: provider.email,
                    phoneNumber: provider.phoneNumber,
                    photoURL: provider.photoURL
                }))
            }

            // Gather Firestore user data
            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)
            const profileData = userDoc.exists() ? userDoc.data() : null

            // Gather MFA data (if available)
            const mfaData = {
                enrolledFactors: (user as any).multiFactor?.enrolledFactors?.map((factor: any) => ({
                    uid: factor.uid,
                    displayName: factor.displayName,
                    phoneNumber: factor.phoneNumber,
                    enrollmentTime: factor.enrollmentTime
                })) || []
            }

            // Create export object
            const exportData: UserExportData = {
                auth: authData,
                profile: profileData,
                mfa: mfaData,
                exportMetadata: {
                    exportedAt: new Date().toISOString(),
                    exportedBy: user.email || user.uid,
                    version: "1.0.0"
                }
            }

            // Convert to JSON
            const jsonString = JSON.stringify(exportData, null, 2)

            // Create and download file
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `user-data-${user.uid}-${Date.now()}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.success("Datos exportados correctamente", {
                description: "El archivo se ha descargado en tu dispositivo"
            })

            return { success: true }
        } catch (error: any) {
            console.error("Error exporting user data:", error)
            toast.error("Error al exportar datos", {
                description: error.message || "No se pudieron exportar los datos"
            })
            return { success: false, error: error.message }
        }
    }

    const exportUserDataAsCSV = async () => {
        try {
            const user = auth.currentUser

            if (!user) {
                toast.error("No hay usuario autenticado")
                return
            }

            // Gather Firestore user data
            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)
            const profileData = userDoc.exists() ? userDoc.data() : {}

            // Create CSV content
            const csvRows = [
                ['Campo', 'Valor'],
                ['UID', user.uid],
                ['Email', user.email || 'N/A'],
                ['Nombre', user.displayName || 'N/A'],
                ['Email Verificado', user.emailVerified ? 'Sí' : 'No'],
                ['Teléfono', user.phoneNumber || 'N/A'],
                ['Fecha de Creación', user.metadata.creationTime || 'N/A'],
                ['Último Inicio de Sesión', user.metadata.lastSignInTime || 'N/A'],
                ['', ''], // Empty row
                ['--- DATOS DE PERFIL ---', ''],
                ...Object.entries(profileData).map(([key, value]) => [
                    key,
                    typeof value === 'object' ? JSON.stringify(value) : String(value)
                ])
            ]

            const csvString = csvRows.map(row =>
                row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
            ).join('\n')

            // Create and download file
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `user-data-${user.uid}-${Date.now()}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.success("Datos exportados como CSV", {
                description: "El archivo se ha descargado en tu dispositivo"
            })

            return { success: true }
        } catch (error: any) {
            console.error("Error exporting user data as CSV:", error)
            toast.error("Error al exportar datos", {
                description: error.message || "No se pudieron exportar los datos"
            })
            return { success: false, error: error.message }
        }
    }

    return {
        exportUserData,
        exportUserDataAsCSV
    }
}
