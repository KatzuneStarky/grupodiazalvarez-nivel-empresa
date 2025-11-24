"use client"

import { collection, onSnapshot } from "firebase/firestore";
import { SystemUser } from "@/types/usuario";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<SystemUser[]>([]);
    const [error, setError] = useState<Error | undefined>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const usuariosRef = collection(db, "usuarios");
        const unsubscribe = onSnapshot(usuariosRef, (querySnapshot) => {
            const usuariosData: SystemUser[] = [];
            querySnapshot.forEach((doc) => {
                usuariosData.push({ uid: doc.id, ...doc.data() } as SystemUser);
            });
            setUsuarios(usuariosData);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo a los usuarios:", error);
            setError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    return { usuarios, loading, error }
}