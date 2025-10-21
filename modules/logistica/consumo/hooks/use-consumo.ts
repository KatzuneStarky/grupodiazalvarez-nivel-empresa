import { ReporteViajes } from "../../reportes-viajes/types/reporte-viajes";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { Operador } from "../../bdd/operadores/types/operadores";
import { Equipo } from "../../bdd/equipos/types/equipos";
import { ConsumoCombustible } from "../types/consumo"
import { ConsumoData } from "../types/consumo-data";
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useConsumo = () => {
    const [consumo, setConsumo] = useState<ConsumoData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const consumoRef = collection(db, "consumos");

        const unsubscribe = onSnapshot(
            consumoRef,
            async (querySnapshot) => {
                try {
                    const consumoData: ConsumoData[] = [];

                    const consumos = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as ConsumoCombustible[];

                    const enrichedData = await Promise.all(
                        consumos.map(async (item) => {
                            const [equipoSnap, operadorSnap, viajeSnap] = await Promise.all([
                                item.equipoId ? getDoc(doc(db, "equipos", item.equipoId)) : null,
                                item.operadorId ? getDoc(doc(db, "operadores", item.operadorId)) : null,
                                item.viajeId ? getDoc(doc(db, "reporteViajes", item.viajeId)) : null,
                            ]);

                            const equipo = equipoSnap?.exists() ? (equipoSnap.data() as Equipo) : undefined;
                            const operador = operadorSnap?.exists() ? (operadorSnap.data() as Operador) : undefined;
                            const viaje = viajeSnap?.exists() ? (viajeSnap.data() as ReporteViajes) : undefined;

                            return {
                                ...item,
                                equipo,
                                operador,
                                viaje,
                            } as ConsumoData;
                        })
                    );

                    setConsumo(enrichedData);
                    setLoading(false);
                } catch (err) {
                    console.error("Error al cargar consumos:", err);
                    setError(err as Error);
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Error obteniendo a los consumos:", error);
                setError(error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return {
        consumo,
        loading,
        error,
    };
};