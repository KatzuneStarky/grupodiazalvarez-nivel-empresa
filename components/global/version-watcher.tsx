"use client"

import { useEffect } from "react"

export function VersionWatcher() {
    useEffect(() => {
        let currentVersion: string | null = null

        async function checkVersion() {
            try {
                const res = await fetch("/version.json", { cache: "no-store" })
                const data = await res.json()

                if (!currentVersion) {
                    currentVersion = data.version
                } else if (currentVersion !== data.version) {
                    if (confirm("Hay una nueva versión disponible. ¿Deseas recargar?")) {
                        window.location.reload()
                    }
                }
            } catch (e) {
                console.error("Error checking version:", e)
            }
        }

        const interval = setInterval(checkVersion, 30000)
        checkVersion()

        return () => clearInterval(interval)
    }, [])

    return null
}