"use server"

import { auth } from "@/firebase/server"
import { cookies } from "next/headers"

export const removeToken = async () => {
    const cookieStore = await cookies()
    cookieStore.delete("firebaseAuthToken")
    cookieStore.delete("firebaseAuthRefreshToken")
}

export const setToken = async ({
    token,
    refreshToken
}: {
    token: string,
    refreshToken: string
}) => {
    if (!token || !refreshToken) {
        throw new Error("Faltan tokens requeridos");
    }

    try {
        const verifiedToken = await auth.verifyIdToken(token)
        if (!verifiedToken) return

        const userRecord = await auth.getUser(verifiedToken.uid)
        if (process.env.ADMIN_EMAIL === userRecord.email &&
            !userRecord.customClaims?.admin) {
            auth.setCustomUserClaims(verifiedToken.uid, {
                admin: true
            })
        }

        const cookieStore = await cookies()
        cookieStore.set("firebaseAuthToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            domain: process.env.NODE_ENV === "production" ? ".grupodiazalvarez.com" : "cbs.localhost",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })

        cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            domain: process.env.NODE_ENV === "production" ? ".grupodiazalvarez.com" : "cbs.localhost",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })
    } catch (error) {
        console.error("Error al establecer token:", error);
        throw new Error("No se pudo establecer el token");
    }
}