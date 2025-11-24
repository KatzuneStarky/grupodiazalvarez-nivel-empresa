"use client"

import { useState } from "react"
import { auth } from "@/firebase/client"
import {
    multiFactor,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier,
    MultiFactorResolver
} from "firebase/auth"
import { toast } from "sonner"

export const useTwoFactor = () => {
    const [isEnrolling, setIsEnrolling] = useState(false)
    const [verificationId, setVerificationId] = useState<string | null>(null)
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)

    const initRecaptcha = (elementId: string) => {
        if (recaptchaVerifier) {
            recaptchaVerifier.clear()
        }

        const verifier = new RecaptchaVerifier(auth, elementId, {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved
            }
        })

        setRecaptchaVerifier(verifier)
        return verifier
    }

    const enrollPhone = async (phoneNumber: string, elementId: string) => {
        try {
            setIsEnrolling(true)
            const user = auth.currentUser

            if (!user) {
                throw new Error("No user is currently signed in")
            }

            // Initialize reCAPTCHA
            const verifier = initRecaptcha(elementId)

            // Get multi-factor session
            const multiFactorSession = await multiFactor(user).getSession()

            // Setup phone auth provider
            const phoneInfoOptions = {
                phoneNumber,
                session: multiFactorSession
            }

            const phoneAuthProvider = new PhoneAuthProvider(auth)
            const verId = await phoneAuthProvider.verifyPhoneNumber(
                phoneInfoOptions,
                verifier
            )

            setVerificationId(verId)
            toast.success("Código SMS enviado")
            return { success: true, verificationId: verId }
        } catch (error: any) {
            console.error("Error enrolling phone:", error)
            toast.error(error.message || "Error al enviar el código SMS")
            return { success: false, error: error.message }
        } finally {
            setIsEnrolling(false)
        }
    }

    const verifyAndEnroll = async (code: string, displayName?: string) => {
        try {
            if (!verificationId) {
                throw new Error("No verification ID found")
            }

            const user = auth.currentUser
            if (!user) {
                throw new Error("No user is currently signed in")
            }

            // Create credential
            const cred = PhoneAuthProvider.credential(verificationId, code)
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)

            // Enroll the factor
            await multiFactor(user).enroll(
                multiFactorAssertion,
                displayName || "Teléfono principal"
            )

            toast.success("2FA habilitado correctamente")
            setVerificationId(null)
            return { success: true }
        } catch (error: any) {
            console.error("Error verifying code:", error)
            toast.error(error.message || "Código inválido")
            return { success: false, error: error.message }
        }
    }

    const unenrollFactor = async (factorUid: string) => {
        try {
            const user = auth.currentUser
            if (!user) {
                throw new Error("No user is currently signed in")
            }

            const enrolledFactors = multiFactor(user).enrolledFactors
            const factor = enrolledFactors.find(f => f.uid === factorUid)

            if (!factor) {
                throw new Error("Factor not found")
            }

            await multiFactor(user).unenroll(factor)
            toast.success("2FA deshabilitado")
            return { success: true }
        } catch (error: any) {
            console.error("Error unenrolling factor:", error)
            toast.error(error.message || "Error al deshabilitar 2FA")
            return { success: false, error: error.message }
        }
    }

    const verifySecondFactor = async (resolver: MultiFactorResolver, code: string) => {
        try {
            const phoneInfoOptions = {
                multiFactorHint: resolver.hints[0],
                session: resolver.session
            }

            const phoneAuthProvider = new PhoneAuthProvider(auth)
            const verificationId = await phoneAuthProvider.verifyPhoneNumber(
                phoneInfoOptions,
                recaptchaVerifier!
            )

            const cred = PhoneAuthProvider.credential(verificationId, code)
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred)

            const userCredential = await resolver.resolveSignIn(multiFactorAssertion)
            return { success: true, user: userCredential.user }
        } catch (error: any) {
            console.error("Error verifying second factor:", error)
            toast.error(error.message || "Código inválido")
            return { success: false, error: error.message }
        }
    }

    return {
        isEnrolling,
        verificationId,
        enrollPhone,
        verifyAndEnroll,
        unenrollFactor,
        verifySecondFactor,
        initRecaptcha
    }
}
