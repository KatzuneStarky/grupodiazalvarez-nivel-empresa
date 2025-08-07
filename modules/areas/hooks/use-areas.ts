"use client"

import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"
import { Area } from "../types/areas"

export const useAreasByEmpresa = (empresaId: string) => {
    const [areas, setAreas] = useState<Area[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!empresaId) return
        setLoading(true)

        const areaRef = collection(db, "empresas", empresaId, "areas")

        const unsubscribeAreas = onSnapshot(areaRef, (snapshot) => {
            const areas: Area[] = []
            snapshot.forEach((doc) => {
                areas.push({
                    id: doc.id,
                    nombre: doc.data().nombre,
                    empresaId: doc.data().empresaId,
                    correoContacto: doc.data().correoContacto,
                    fechaCreacion: doc.data().fechaCreacion,
                    fechaActualizacion: doc.data().fechaActualizacion,
                })
            })
            setAreas(areas)
            setLoading(false)
        }, (err) => {
            console.error("Error en snapshot de areas:", err);
            setError(err instanceof Error ? err : new Error("Error desconocido"));
            setLoading(false);
        })

        return () => unsubscribeAreas()
    }, [empresaId])

    return { areas, loading, error }
}