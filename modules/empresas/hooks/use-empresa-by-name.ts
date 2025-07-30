"use client"

import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Empresa } from "../types/empresas"
import { db } from "@/firebase/client"

export const useEmpresaByName = (empresaName: string) => {
    const [empresa, setEmpresa] = useState<Empresa | null>(null)
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!empresaName) {
            setLoading(false);
            return;
        }

        const fetchEmpresaByName = async () => {
            setLoading(true)
            try {
                const q = query(collection(db, "empresas"), where("nombre", "==", empresaName))
                const snapshot = await getDocs(q)

                if (snapshot.empty) {
                    setEmpresa(null)
                    setError(new Error("Empresa no encontrada"))
                } else {
                    const doc = snapshot.docs[0]
                    setEmpresa({ id: doc.id, ...doc.data() } as Empresa)
                }
            } catch (err) {
                console.error(err)
                setError(new Error("Error al buscar la empresa"))
                setEmpresa(null)
            } finally {
                setLoading(false);
            }
        }

        fetchEmpresaByName()
    }, [empresaName])

    return { empresa, loading, error }
}