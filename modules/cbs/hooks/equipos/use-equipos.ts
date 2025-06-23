"use client"

import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { Tanque } from "../../types/equipos/tanque";
import { Equipo } from "../../types/bdd/equipos";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

export const useEquipos = () => {
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const equiposRef = collection(db, "equipos");

        const unsubscribe = onSnapshot(equiposRef, async (querySnapshot) => {
            const equiposData: Equipo[] = [];
            const tanquesPromises: Promise<void>[] = [];

            querySnapshot.forEach((doc) => {
                const equipo = { id: doc.id, ...doc.data() } as Equipo;
                equiposData.push(equipo);

                const tanquesRef = collection(db, "tanques");
                const tanquesQuery = query(tanquesRef, where("equipoId", "==", equipo.id));
                const tanquesPromise = getDocs(tanquesQuery).then((tanquesSnapshot) => {
                    const tanquesData: Tanque[] = [];
                    tanquesSnapshot.forEach((tanqueDoc) => {
                        tanquesData.push({ id: tanqueDoc.id, ...tanqueDoc.data() } as Tanque);
                    });
                    equipo.tanque = tanquesData;
                });

                tanquesPromises.push(tanquesPromise);
            });

            await Promise.all(tanquesPromises);
            setEquipos(equiposData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error obteniendo los equipos:", error);
            setError(error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { equipos, isLoading, error };
};