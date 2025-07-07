"use client"

import { doc, getDoc } from "firebase/firestore"
import { Empresa } from "../types/empresas"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useEmpresaById = (empresaId: string) => {
    const [empresa, setEmpresa] = useState<Empresa>()
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!empresaId) {
            setLoading(false);
            return;
        }

        const fetchEmpresa = async () => {
            setLoading(true);
            try {
                const empresaRef = doc(db, "empresas", empresaId);
                const snapshot = await getDoc(empresaRef);

                if (snapshot.exists()) {
                    setEmpresa(snapshot.data() as Empresa);
                } else {
                    setEmpresa(undefined);
                    setError(new Error("Empresa not found."));
                }
            } catch (err) {
                console.error(err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpresa();
    }, [empresaId]);

    return { empresa, error, loading }
}