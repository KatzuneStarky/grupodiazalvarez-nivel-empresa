"use client"

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { ArchivosVencimiento } from "../types/archivos-vencimiento";
import { Mantenimiento } from "../types/mantenimiento";
import { Certificado } from "../types/certificados";
import { Revisiones } from "../types/revisiones";
import { useEffect, useState } from "react";
import { Archivo } from "../types/archivos";
import { Equipo } from "../types/equipos";
import { Tanque } from "../types/tanque";
import { db } from "@/firebase/client";

export const useEquipos = () => {
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const equiposRef = collection(db, "equipos");

        const unsubscribe = onSnapshot(
            equiposRef,
            async (querySnapshot) => {
                setIsLoading(true);

                const equiposPromises = querySnapshot.docs.map(async (doc) => {
                    const equipoBase = { id: doc.id, ...doc.data() } as Equipo;

                    const tanquesRef = collection(db, "equipos", equipoBase.id, "tanques");
                    const mantenimientosRef = collection(db, "equipos", equipoBase.id, "mantenimientos");
                    const revisionesRef = collection(db, "equipos", equipoBase.id, "Revisiones");
                    const archivosRef = collection(db, "equipos", equipoBase.id, "archivos");
                    const certificadosRef = collection(db, "equipos", equipoBase.id, "Certificado");
                    const archivosVencRef = collection(db, "equipos", equipoBase.id, "ArchivosVencimiento");

                    const [
                        tanquesSnap,
                        mantenimientosSnap,
                        revisionesSnap,
                        archivosSnap,
                        certificadosSnap,
                        archivosVencSnap,
                    ] = await Promise.all([
                        getDocs(tanquesRef),
                        getDocs(mantenimientosRef),
                        getDocs(revisionesRef),
                        getDocs(archivosRef),
                        getDocs(certificadosRef),
                        getDocs(archivosVencRef),
                    ]);

                    const tanques = tanquesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Tanque[];
                    const mantenimiento = mantenimientosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Mantenimiento[];
                    const Revisiones = revisionesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Revisiones[];
                    const archivos = archivosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Archivo[];
                    const Certificado = certificadosSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Certificado[];
                    const ArchivosVencimiento = archivosVencSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ArchivosVencimiento[];

                    return {
                        ...equipoBase,
                        tanque: tanques,
                        mantenimiento,
                        Revisiones,
                        archivos,
                        Certificado,
                        ArchivosVencimiento,
                    };
                });

                try {
                    const equiposData = await Promise.all(equiposPromises);
                    setEquipos(equiposData);
                } catch (err) {
                    console.error("Error obteniendo equipos:", err);
                    setError(err as Error);
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                console.error("Error en snapshot de equipos:", error);
                setError(error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { equipos, isLoading, error };
};