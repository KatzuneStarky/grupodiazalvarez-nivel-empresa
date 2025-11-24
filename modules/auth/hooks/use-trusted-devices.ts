"use client"

import { useState } from "react"
import { auth, db } from "@/firebase/client"
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { toast } from "sonner"

interface TrustedDevice {
    id: string
    name: string
    userAgent: string
    ip?: string
    lastUsed: Date
    createdAt: Date
}

export const useTrustedDevices = () => {
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Get device fingerprint
     */
    const getDeviceFingerprint = (): string => {
        const navigator = window.navigator
        const screen = window.screen

        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.colorDepth,
            screen.width,
            screen.height,
            new Date().getTimezoneOffset()
        ].join('|')

        // Simple hash function
        let hash = 0
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }

        return Math.abs(hash).toString(36)
    }

    /**
     * Get device name from user agent
     */
    const getDeviceName = (): string => {
        const ua = navigator.userAgent

        // Mobile devices
        if (/iPhone/.test(ua)) return 'iPhone'
        if (/iPad/.test(ua)) return 'iPad'
        if (/Android/.test(ua)) {
            if (/Mobile/.test(ua)) return 'Android Phone'
            return 'Android Tablet'
        }

        // Desktop browsers
        if (/Windows/.test(ua)) return 'Windows PC'
        if (/Mac/.test(ua)) return 'Mac'
        if (/Linux/.test(ua)) return 'Linux PC'

        return 'Unknown Device'
    }

    /**
     * Check if current device is trusted
     */
    const isDeviceTrusted = async (): Promise<boolean> => {
        try {
            const user = auth.currentUser
            if (!user) return false

            const deviceId = getDeviceFingerprint()
            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) return false

            const userData = userDoc.data()
            const trustedDevices: TrustedDevice[] = userData.trustedDevices || []

            return trustedDevices.some(device => device.id === deviceId)
        } catch (error) {
            console.error("Error checking trusted device:", error)
            return false
        }
    }

    /**
     * Add current device as trusted
     */
    const trustCurrentDevice = async () => {
        try {
            setIsLoading(true)
            const user = auth.currentUser

            if (!user) {
                throw new Error("No user is currently signed in")
            }

            const deviceId = getDeviceFingerprint()
            const deviceName = getDeviceName()

            const newDevice: TrustedDevice = {
                id: deviceId,
                name: deviceName,
                userAgent: navigator.userAgent,
                lastUsed: new Date(),
                createdAt: new Date()
            }

            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)

            if (userDoc.exists()) {
                const userData = userDoc.data()
                const trustedDevices: TrustedDevice[] = userData.trustedDevices || []

                // Check if device already exists
                const existingIndex = trustedDevices.findIndex(d => d.id === deviceId)

                if (existingIndex !== -1) {
                    // Update last used
                    trustedDevices[existingIndex].lastUsed = new Date()
                    await updateDoc(userRef, { trustedDevices })
                } else {
                    // Add new device
                    await updateDoc(userRef, {
                        trustedDevices: arrayUnion(newDevice)
                    })
                }
            } else {
                // Create user document with trusted device
                await setDoc(userRef, {
                    trustedDevices: [newDevice]
                }, { merge: true })
            }

            toast.success("Dispositivo marcado como confiable")
            return { success: true }
        } catch (error: any) {
            console.error("Error trusting device:", error)
            toast.error(error.message || "Error al marcar dispositivo como confiable")
            return { success: false, error: error.message }
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Remove a trusted device
     */
    const removeTrustedDevice = async (deviceId: string) => {
        try {
            setIsLoading(true)
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
            const trustedDevices: TrustedDevice[] = userData.trustedDevices || []

            const updatedDevices = trustedDevices.filter(d => d.id !== deviceId)

            await updateDoc(userRef, {
                trustedDevices: updatedDevices
            })

            toast.success("Dispositivo removido")
            return { success: true }
        } catch (error: any) {
            console.error("Error removing trusted device:", error)
            toast.error(error.message || "Error al remover dispositivo")
            return { success: false, error: error.message }
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Get all trusted devices
     */
    const getTrustedDevices = async (): Promise<TrustedDevice[]> => {
        try {
            const user = auth.currentUser

            if (!user) {
                return []
            }

            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                return []
            }

            const userData = userDoc.data()
            return userData.trustedDevices || []
        } catch (error) {
            console.error("Error getting trusted devices:", error)
            return []
        }
    }

    /**
     * Update last used timestamp for current device
     */
    const updateDeviceLastUsed = async () => {
        try {
            const user = auth.currentUser
            if (!user) return

            const deviceId = getDeviceFingerprint()
            const userRef = doc(db, "usuarios", user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) return

            const userData = userDoc.data()
            const trustedDevices: TrustedDevice[] = userData.trustedDevices || []

            const deviceIndex = trustedDevices.findIndex(d => d.id === deviceId)

            if (deviceIndex !== -1) {
                trustedDevices[deviceIndex].lastUsed = new Date()
                await updateDoc(userRef, { trustedDevices })
            }
        } catch (error) {
            console.error("Error updating device last used:", error)
        }
    }

    return {
        isLoading,
        getDeviceFingerprint,
        isDeviceTrusted,
        trustCurrentDevice,
        removeTrustedDevice,
        getTrustedDevices,
        updateDeviceLastUsed
    }
}
