import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Empresa } from "@/modules/empresas/types/empresas";
import { Menu } from "@/modules/menus/types/menu-sistema";
import { Area } from "@/modules/areas/types/areas";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";

interface AreaData extends Area {
    menus: Menu[]
}

interface EmpresaData extends Empresa {
    areas: AreaData[]
}

export const useAllEmpresaData = () => {
    const [empresasData, setEmpresasData] = useState<EmpresaData[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        setLoading(true);
        const empresasQuery = query(
            collection(db, "empresas"),
            orderBy("fechaCreacion", "desc")
        );

        const allUnsubscribes: (() => void)[] = [];

        const unsubscribeEmpresas = onSnapshot(empresasQuery, async (empresasSnapshot) => {
            const newEmpresasData: EmpresaData[] = [];
            const currentAreaUnsubscribes: (() => void)[] = [];

            for (const empresaDoc of empresasSnapshot.docs) {
                const empresa = { id: empresaDoc.id, ...empresaDoc.data() } as Empresa;
                const areasQuery = collection(db, "empresas", empresa.id, "areas");

                const unsubscribeAreas = onSnapshot(areasQuery, async (areasSnapshot) => {
                    const newAreasData: AreaData[] = [];
                    const currentMenuUnsubscribes: (() => void)[] = [];

                    for (const areaDoc of areasSnapshot.docs) {
                        const area = { id: areaDoc.id, ...areaDoc.data() } as Area;
                        const menusQuery = query(collection(db, "empresas", empresa.id, "areas", area.id, "menus"), orderBy("order", "asc"));

                        const unsubscribeMenus = onSnapshot(menusQuery, (menusSnapshot) => {
                            const menus: Menu[] = menusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Menu));
                            newAreasData.push({ ...area, menus });
                            // Re-evaluate and update state when menus change for an area
                            // This will trigger a re-render of the entire tree for simplicity
                            const updatedEmpresas = newEmpresasData.map(e => e.id === empresa.id ? { ...e, areas: newAreasData } : e);
                            setEmpresasData(updatedEmpresas);
                        }, (err) => {
                            console.error(`Error en snapshot de menus para area ${area.id}:`, err);
                            setError(err instanceof Error ? err : new Error("Error desconocido"));
                        });
                        currentMenuUnsubscribes.push(unsubscribeMenus);
                    }

                    // Clean up previous menu subscriptions for this area
                    allUnsubscribes.filter(unsub => !currentMenuUnsubscribes.includes(unsub)).forEach(unsub => unsub());
                    allUnsubscribes.push(...currentMenuUnsubscribes);

                    const updatedEmpresas = newEmpresasData.map(e => e.id === empresa.id ? { ...e, areas: newAreasData } : e);
                    setEmpresasData(updatedEmpresas); // Update after all areas are processed for this empresa
                }, (err) => {
                    console.error(`Error en snapshot de areas para empresa ${empresa.id}:`, err);
                    setError(err instanceof Error ? err : new Error("Error desconocido"));
                });
                currentAreaUnsubscribes.push(unsubscribeAreas);
                newEmpresasData.push({ ...empresa, areas: [] }); // Initialize with empty areas, will be filled by area listener
            }

            // Clean up previous area subscriptions
            allUnsubscribes.filter(unsub => !currentAreaUnsubscribes.includes(unsub)).forEach(unsub => unsub());
            allUnsubscribes.push(...currentAreaUnsubscribes);

            setEmpresasData(newEmpresasData); // Set initial empresas, areas will populate async
            setLoading(false);
        }, (err) => {
            console.error("Error en snapshot de empresas:", err);
            setError(err instanceof Error ? err : new Error("Error desconocido"));
            setLoading(false);
        });

        allUnsubscribes.push(unsubscribeEmpresas);

        return () => {
            allUnsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, []);

    return {
        empresasData,
        loading,
        error
    }
}