"use client"

import { collection, getDocs, onSnapshot, Unsubscribe } from "firebase/firestore"
import { useEmpresa } from "@/context/empresa-context"
import { Menu, SubMenu } from "../types/menu-sistema"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useMenusByArea = (areaId?: string) => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [subMenus, setSubMenus] = useState<SubMenu[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const { empresa } = useEmpresa();

    useEffect(() => {
        if (!empresa?.id || !areaId) return;

        setLoading(true);

        const menusRef = collection(db, "empresas", empresa.id, "areas", areaId, "menus");

        // Guarda los unsubscribers para los submenús
        let subMenuUnsubscribers: Unsubscribe[] = [];

        const unsubscribeMenus = onSnapshot(menusRef, (menusSnapshot) => {
            const fetchedMenus: Menu[] = [];
            const allSubMenus: SubMenu[] = [];

            subMenuUnsubscribers.forEach(unsub => unsub());
            subMenuUnsubscribers = [];

            menusSnapshot.docs.forEach(menuDoc => {
                const menuData = menuDoc.data() as Menu;
                menuData.subMenus = [];

                fetchedMenus.push(menuData);

                const subMenusRef = collection(
                    db,
                    "empresas",
                    empresa.id,
                    "areas",
                    areaId,
                    "menus",
                    menuDoc.id,
                    "subMenus"
                );

                const unsub = onSnapshot(subMenusRef, (subMenusSnapshot) => {
                    const subMenusForMenu = subMenusSnapshot.docs.map(doc => doc.data() as SubMenu);

                    setMenus(prevMenus => {
                        return prevMenus.map(menu => {
                            if (menu.id === menuDoc.id) {
                                return { ...menu, subMenus: subMenusForMenu };
                            }
                            return menu;
                        });
                    });

                    setSubMenus(prev => {
                        const filtered = prev.filter(sm => sm.menuId !== menuDoc.id);
                        return [...filtered, ...subMenusForMenu];
                    });
                });

                subMenuUnsubscribers.push(unsub);
            });

            setMenus(fetchedMenus.sort((a, b) => a.order - b.order));
            setLoading(false);
        }, (err) => {
            console.error("Error en snapshot de menús:", err);
            setError(err instanceof Error ? err : new Error("Error desconocido"));
            setLoading(false);
        });

        return () => {
            unsubscribeMenus();
            subMenuUnsubscribers.forEach(unsub => unsub());
        };

    }, [empresa?.id, areaId]);

    return { menus, subMenus, loading, error, empresa };
};