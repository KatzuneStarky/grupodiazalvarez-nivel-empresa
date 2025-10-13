"use client"

import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef } from "react"
import { db } from "@/firebase/client"
import { toast } from "sonner"

export function VersionWatcher() {
    const currentVersion = useRef<number | null>(null)

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "configuracion", "version"), (snapshot) => {
            const data = snapshot.data()
            if (!data) return

            const remoteVersion = data.version
            if (currentVersion.current === null) {
                currentVersion.current = remoteVersion
                return
            }

            if (remoteVersion !== currentVersion.current) {
                currentVersion.current = remoteVersion

                toast.info("Nueva versión disponible 🚀", {
                    description: "Haz clic en el botón para actualizar la aplicación",
                    action: {
                        label: "Recargar",
                        onClick: () => window.location.reload(),
                    },
                })
            }
        })

        return () => unsub()
    }, [])

    return null
}