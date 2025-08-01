"use client"

import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"
import { Area } from "@/modules/areas/types/areas"
import { db } from "@/firebase/client"

type AreaContextType = {
    area: Area | null
    loading: boolean
    error?: string
}

const AreaContext = createContext<AreaContextType | null>(null)

export const AreaProvider = ({
    children,
    areaName,
    areaId,
    empresaName
}: {
    children: React.ReactNode,
    areaName?: string,
    areaId?: string,
    empresaName: string
}) => {
    const [area, setArea] = useState<Area | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>()

    useEffect(() => {
        const fetchArea = async () => {
            setLoading(true)
            setError(undefined)

            try {
                if (areaId) {
                    const qEmpresa = query(collection(db, "empresas"), where("nombre", "==", empresaName));
                    const empresaSnap = await getDocs(qEmpresa);

                    if (!empresaSnap.empty) {
                        const empresaDoc = empresaSnap.docs[0];
                        const empresaId = empresaDoc.id;

                        const areaRef = collection(db, "empresas", empresaId, "areas", areaId)
                        const snapshot = await getDocs(areaRef)

                        if (!snapshot.empty) {
                            const areaDoc = snapshot.docs[0];
                            setArea({ id: areaDoc.id, ...areaDoc.data() } as Area)
                        }
                    }
                } else if (areaName) {
                    const qEmpresa = query(collection(db, "empresas"), where("nombre", "==", empresaName));
                    const empresaSnap = await getDocs(qEmpresa);

                    if (!empresaSnap.empty) {
                        const empresaDoc = empresaSnap.docs[0];
                        const empresaId = empresaDoc.id;

                        const qArea = query(
                            collection(db, "empresas", empresaId, "areas"),
                            where("nombre", "==", areaName)
                        );
                        const areaSnap = await getDocs(qArea);

                        if (!areaSnap.empty) {
                            const areaDoc = areaSnap.docs[0];
                            setArea({ id: areaDoc.id, ...areaDoc.data() } as Area)
                        }
                    }
                } else {
                    throw new Error("Debe proporcionarse areaName o areaId")
                }
            } catch (err) {
                console.error(err)
                setError(err as string ?? "Error al cargar el area")
                setArea(null)
            } finally {
                setLoading(false)
            }
        }

        fetchArea()
    }, [areaId, areaName, empresaName])

    return (
        <AreaContext.Provider value={{ area, loading, error }}>
            {children}
        </AreaContext.Provider>
    )
}

export const useArea = () => {
    const context = useContext(AreaContext)
    if (!context) {
        throw new Error("useArea debe usarse dentro de AreaProvider")
    }

    return context
}