import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { FileType } from "@/types/file-types";
import { useEffect, useState } from "react";
import { Folder } from "../types/folder";
import { db } from "@/firebase/client";

export const useEquiposWithFolder = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const fetchEquipos = async () => {
            try {
                const equiposRef = collection(db, "equipos");

                unsubscribe = onSnapshot(
                    equiposRef,
                    async (querySnapshot) => {
                        setIsLoading(true);

                        const foldersData: Folder[] = [];

                        const fetchPromises = querySnapshot.docs.map(async (doc) => {
                            const equipoId = doc.id;
                            const numEconomico = doc.data().numEconomico;
                            const createdAt = doc.data().createdAt?.toDate() ?? doc.data().createAt?.toDate() ?? new Date();

                            const folder: Folder = {
                                id: equipoId,
                                name: numEconomico,
                                path: `/equipos/${equipoId}`,
                                archivos: [],
                                archivosVencimiento: [],
                                certificado: [],
                                equipoId: equipoId,
                                createdAt,
                                updatedAt: createdAt,
                            };

                            try {
                                const [archivosSnap, vencimientoSnap, certificadoSnap] = await Promise.all([
                                    getDocs(collection(db, `equipos/${equipoId}/archivos`)),
                                    getDocs(collection(db, `equipos/${equipoId}/archivosVencimiento`)),
                                    getDocs(collection(db, `equipos/${equipoId}/certificados`)),
                                ]);

                                folder.archivos = archivosSnap.docs.map((d) => ({
                                    id: d.id,
                                    nombre: d.data().nombre ?? "",
                                    ruta: d.data().ruta ?? "",
                                    tipo: (d.data().tipo as FileType) ?? "unknown",
                                    extension: d.data().extension ?? "",
                                    peso: d.data().peso ?? 0,
                                    equipoId: d.data().equipoId ?? equipoId,
                                    createAt: d.data().createdAt?.toDate() ?? d.data().createAt?.toDate() ?? createdAt,
                                    updateAt: d.data().updatedAt?.toDate() ?? createdAt,
                                }));

                                folder.archivosVencimiento = vencimientoSnap.docs.map((d) => ({
                                    id: d.id,
                                    nombre: d.data().nombre ?? "",
                                    ruta: d.data().ruta ?? "",
                                    fecha: d.data().fecha?.toDate() ?? createdAt,
                                    tipo: (d.data().tipo as FileType) ?? "unknown",
                                    extension: d.data().extension ?? "",
                                    peso: d.data().peso ?? 0,
                                    equipoId: d.data().equipoId ?? equipoId,
                                    createAt: d.data().createdAt?.toDate() ?? d.data().createAt?.toDate() ?? createdAt,
                                }));

                                folder.certificado = certificadoSnap.docs.map((d) => ({
                                    id: d.id,
                                    nombre: d.data().nombre ?? "",
                                    ruta: d.data().ruta ?? "",
                                    fecha: d.data().fecha?.toDate() ?? createdAt,
                                    tipo: (d.data().tipo as FileType) ?? "unknown",
                                    extension: d.data().extension ?? "",
                                    peso: d.data().peso ?? 0,
                                    equipoId: d.data().equipoId ?? equipoId,
                                    createAt: d.data().createdAt?.toDate() ?? d.data().createAt?.toDate() ?? createdAt,
                                }));
                            } catch (e) {
                                console.error("Error fetching subcollections:", e);
                            }

                            const allFiles = [...folder.archivos, ...folder.archivosVencimiento, ...folder.certificado];
                            if (allFiles.length > 0) {
                                const mostRecentFile = allFiles.reduce((latest, current) => {
                                    const currentCreatedAt = current.createAt || folder.createdAt;
                                    return currentCreatedAt > latest ? currentCreatedAt : latest;
                                }, folder.createdAt);

                                folder.updatedAt = mostRecentFile;
                            }

                            foldersData.push(folder);
                        });

                        await Promise.all(fetchPromises);

                        setFolders(foldersData);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error("Error obteniendo los equipos:", error);
                        setError(error);
                        setIsLoading(false);
                    }
                );
            } catch (error) {
                console.error("Error en la consulta de equipos:", error);
                setError(error as Error);
                setIsLoading(false);
            }
        };

        fetchEquipos();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return { folders, isLoading, error };
};