import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore"
import { SystemLog } from "@/types/system-logs"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useAllLogs = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [logs, setLogs] = useState<SystemLog[]>([])

    useEffect(() => {
        setLoading(true)
        const q = query(
            collection(db, "logs"),
            orderBy("timestamp", "desc"),
            limit(100)
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const logsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as SystemLog)
            setLogs(logsData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching logs:", error)
            setError("Error fetching logs")
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return {
        error,
        loading,
        logs
    }
}