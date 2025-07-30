"use client"

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { Empresa } from "@/modules/empresas/types/empresas"
import { db } from "@/firebase/client"

type EmpresaContextType = {
    empresa: Empresa | null
    loading: boolean
    error?: string
}

const EmpresaContext = createContext<EmpresaContextType | null>(null)

export const EmpresaProvider = ({
    children,
    empresaName,
    empresaId
}: {
    children: React.ReactNode,
    empresaName?: string
    empresaId?: string
}) => {
    const [empresa, setEmpresa] = useState<Empresa | null>(null)
    const [error, setError] = useState<string | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchEmpresa = async () => {
            setLoading(true)
            setError(undefined)

            try {
                if (empresaId) {
                    const docRef = doc(db, "empresas", empresaId)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        setEmpresa({ id: docSnap.id, ...docSnap.data() } as Empresa)
                    } else {
                        throw new Error("Empresa no encontrada")
                    }
                } else if (empresaName) {
                    const q = query(collection(db, "empresas"), where("nombre", "==", empresaName))
                    const snapshot = await getDocs(q)

                    if (snapshot.empty) {
                        throw new Error("Empresa no encontrada")
                    }

                    const doc = snapshot.docs[0]
                    setEmpresa({ id: doc.id, ...doc.data() } as Empresa)
                } else {
                    throw new Error("Debe proporcionarse empresaName o empresaId")
                }
            } catch (err) {
                console.error(err)
                setError(err as string ?? "Error al cargar la empresa")
                setEmpresa(null)
            } finally {
                setLoading(false)
            }
        }

        fetchEmpresa()
    }, [empresaName, empresaId])

    return (
        <EmpresaContext.Provider
            value={{
                empresa,
                loading,
                error
            }}
        >
            {children}
        </EmpresaContext.Provider>
    )
}

export const useEmpresa = () => {
    const context = useContext(EmpresaContext);
    if (!context) {
        throw new Error("useEmpresa debe usarse dentro de EmpresaProvider");
    }
    return context;
}