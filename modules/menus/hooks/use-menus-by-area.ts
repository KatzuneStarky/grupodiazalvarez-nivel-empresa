"use client"

import { collection, getDocs } from "firebase/firestore"
import { useEmpresa } from "@/context/empresa-context"
import { Menu, SubMenu } from "../types/menu-sistema"
import { useEffect, useState } from "react"
import { db } from "@/firebase/client"

export const useMenusByArea = (areaId?: string) => {
    const [menus, setMenus] = useState<Menu[]>([])
    const [subMenus, setSubMenus] = useState<SubMenu[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const { empresa } = useEmpresa()

    useEffect(() => {
        const fetchMenusYSubmenus = async () => {
            if (!empresa?.id || !areaId) return;

            setLoading(true)
            try {
                const menusRef = collection(db, "empresas", empresa.id, "areas", areaId, "menus");
                const menusSnapshot = await getDocs(menusRef);
                const fetchedMenus: Menu[] = [];

                const fetchedSubMenus: SubMenu[] = [];
                for (const docMenu of menusSnapshot.docs) {
                    const menuData = docMenu.data() as Menu;
                    fetchedMenus.push(menuData);

                    const subMenusRef = collection(
                        db,
                        "empresas",
                        empresa.id,
                        "areas",
                        areaId,
                        "menus",
                        docMenu.id,
                        "subMenus"
                    );
                    const subMenusSnapshot = await getDocs(subMenusRef);
                    const subMenusForMenu = subMenusSnapshot.docs.map(doc => doc.data() as SubMenu);
                    fetchedSubMenus.push(...subMenusForMenu);

                    menuData.subMenus = subMenusForMenu;
                }

                setMenus(fetchedMenus);
                setSubMenus(fetchedSubMenus);
            } catch (err) {
                console.error("Error obteniendo menús y submenús:", err);
                setError(err instanceof Error ? err : new Error("Error desconocido"));
            } finally {
                setLoading(false);
            }
        }

        fetchMenusYSubmenus();
    }, [empresa?.id, areaId])

    return { menus, subMenus, loading, error, empresa }
}