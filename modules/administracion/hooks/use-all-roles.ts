import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { RolesUsuario } from "@/types/roles-usuario"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useAllRoles = () => {
    const [allRoles, setAllRoles] = useState<RolesUsuario[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        const q = query(
            collection(db, "roles_usuario"),
            orderBy("name", "desc")
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const rolesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as RolesUsuario)
            setAllRoles(rolesData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching roles:", error)
            setError("Error fetching roles")
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return {
        allRoles,
        error,
        loading
    }
}