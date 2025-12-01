import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from "firebase/firestore"
import { Area } from "@/modules/areas/types/areas";
import { Menu, SubMenu } from "../types/menu-sistema";
import { db } from "@/firebase/client"
import { v4 as uuidv4 } from "uuid";

export async function getLastMenuOrder(
    empresaId: string,
    areaId: string
): Promise<number> {
    const menusCollection = collection(db, "empresas", empresaId, "areas", areaId, "menus");
    const q = query(menusCollection, orderBy("order", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const lastMenu = snapshot.docs[0].data() as Menu;
        return lastMenu.order || 0;
    }

    return 0;
}

export async function getLastSubMenuOrder(
    empresaId: string,
    areaId: string,
    menuId: string
): Promise<number> {
    try {
        const subMenusCollection = collection(
            db,
            "empresas",
            empresaId,
            "areas",
            areaId,
            "menus",
            menuId,
            "subMenus"
        );

        const q = query(subMenusCollection, orderBy("order", "desc"), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const lastSubMenu = snapshot.docs[0].data() as SubMenu;
            return lastSubMenu.order || 0;
        }

        return 0;
    } catch (error) {
        console.error("Error getting last submenu order:", error);
        throw new Error("Failed to get last submenu order from Firestore");
    }
}

export async function createAreaMenu(
    empresaId: string,
    areaId: string,
    menuData: Omit<Menu, | "id" | "order">
): Promise<{ success: boolean, message: string, error?: Error }> {
    try {
        const lastOrder = await getLastMenuOrder(empresaId, areaId);
        const newOrder = lastOrder + 1;

        const menuId = uuidv4()
        const menuDocRef = doc(
            db,
            "empresas",
            empresaId,
            "areas",
            areaId,
            "menus",
            menuId
        );

        const newMenu = {
            ...menuData,
            id: menuId,
            areaId,
            order: newOrder,
            visible: true,
            rolesAllowed: menuData.rolesAllowed || [],
            subMenus: []
        };

        await setDoc(menuDocRef, newMenu);

        const empresaRef = doc(db, "empresas", empresaId);
        const empresaSnap = await getDoc(empresaRef);

        if (!empresaSnap.exists()) {
            throw new Error("Empresa no encontrada");
        }

        const empresaData = empresaSnap.data();
        const areas: Area[] = empresaData.areas || [];

        const updatedAreas = areas.map((area) => {
            if (area.id === areaId) {
                return {
                    ...area,
                    menus: [...(area.menus || []), {
                        id: menuId,
                        title: menuData.title,
                        path: menuData.path,
                        icon: menuData.icon,
                        order: newOrder,
                        visible: true,
                        rolesAllowed: menuData.rolesAllowed || [],
                        subMenus: []
                    }]
                };
            }
            return area;
        });

        await updateDoc(empresaRef, {
            areas: updatedAreas
        });

        console.log("Menú creado con ID:", menuDocRef.id);

        return {
            success: true,
            message: "Menú creado con éxito",
            error: undefined
        }
    } catch (error) {
        console.error("Error creando el menú:", error);
        return {
            success: false,
            message: "Error al crear el menú",
            error: error as Error
        }
    }
}

export const updateMenuOrder
    = async (
        empresaId: string,
        areaId: string,
        menuId: string,
        newOrder: number
    ): Promise<{ success: boolean, message: string, error?: Error }> => {
        try {
            if (!empresaId || !areaId || !menuId || !newOrder)
                throw new Error("EmpresaId, AreaId, MenuId y NewOrder son requeridos")

            const menuRef = doc(db, "empresas", empresaId, "areas", areaId, "menus", menuId);
            const menuSnap = await getDoc(menuRef)

            if (!menuSnap.exists()) throw new Error("Menu no encontrado")
            await updateDoc(menuRef, { order: newOrder });

            const areaRef = doc(db, "empresas", empresaId, "areas", areaId);
            const areaSnap = await getDoc(areaRef);

            if (areaSnap.exists()) {
                const areaData = areaSnap.data();
                const areaMenus: Menu[] = areaData.menus || [];

                const updatedMenus = areaMenus.map(menu => {
                    if (menu.id === menuId) {
                        return { ...menu, order: newOrder };
                    }
                    return menu;
                });

                await updateDoc(areaRef, { menus: updatedMenus });
            }

            return {
                success: true,
                message: "Orden actualizado con éxito",
                error: undefined
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Error al actualizar el orden",
                error: error as Error
            }
        }
    }

export const createAreaSubMenu = async (
    empresaId: string,
    areaId: string,
    menuId: string,
    subMenuData: Omit<SubMenu, | "id" | "order">
): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        const lastOrder = await getLastSubMenuOrder(empresaId, areaId, menuId);
        const newOrder = lastOrder + 1;

        const subMenuId = uuidv4()
        const subMenuDocRef = doc(
            db,
            "empresas",
            empresaId,
            "areas",
            areaId,
            "menus",
            menuId,
            "subMenus",
            subMenuId
        );

        const newSubMenu: SubMenu = {
            ...subMenuData,
            id: subMenuId,
            areaId,
            order: newOrder,
            visible: true,
            menuId,
            rolesAllowed: subMenuData.rolesAllowed || [],
        };

        await setDoc(subMenuDocRef, newSubMenu);

        console.log("Submenú creado con ID:", subMenuDocRef.id);
        return {
            success: true,
            message: "SubMenu creado exitosamente",
            error: undefined
        }
    } catch (error) {
        console.error("Error creando el submenu:", error);
        return {
            success: false,
            message: "Error al crear el SubMenu",
            error: error as Error
        }
    }
}

export const updateSubMenuOrder = async (
    empresaId: string,
    areaId: string,
    menuId: string,
    subMenuId: string,
    newOrder: number
): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        if (!empresaId || !areaId || !menuId || !subMenuId || !newOrder)
            throw new Error("Todos los campos son requeridos");

        const subMenuRef = doc(
            db,
            "empresas",
            empresaId,
            "areas",
            areaId,
            "menus",
            menuId,
            "subMenus",
            subMenuId
        );

        const subMenuSnap = await getDoc(subMenuRef);
        if (!subMenuSnap.exists()) throw new Error("Submenú no encontrado");

        await updateDoc(subMenuRef, { order: newOrder });

        // Update parent menu's subMenus array for consistency
        const menuRef = doc(db, "empresas", empresaId, "areas", areaId, "menus", menuId);
        const menuSnap = await getDoc(menuRef);

        if (menuSnap.exists()) {
            const menuData = menuSnap.data();
            const subMenus: SubMenu[] = menuData.subMenus || [];

            const updatedSubMenus = subMenus.map(sub => {
                if (sub.id === subMenuId) {
                    return { ...sub, order: newOrder };
                }
                return sub;
            });

            await updateDoc(menuRef, { subMenus: updatedSubMenus });
        }

        return {
            success: true,
            message: "Orden del submenú actualizado con éxito",
            error: undefined
        };
    } catch (error) {
        console.error("Error actualizando orden del submenú:", error);
        return {
            success: false,
            message: "Error al actualizar el orden del submenú",
            error: error as Error
        };
    }
};

export const updateMenuVisible = async (
    empresaId: string,
    areaId: string,
    menuId: string,
    visible: boolean
): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        if (!empresaId || !areaId || !menuId)
            throw new Error("Todos los campos son requeridos");

        const menuRef = doc(db, "empresas", empresaId, "areas", areaId, "menus", menuId);
        const menuSnap = await getDoc(menuRef);

        if (!menuSnap.exists()) throw new Error("Menu no encontrado");

        await updateDoc(menuRef, { visible });

        return {
            success: true,
            message: "Visible actualizado con éxito",
            error: undefined
        };
    } catch (error) {
        console.error("Error actualizando visible del menu:", error);
        return {
            success: false,
            message: "Error al actualizar el visible del menu",
            error: error as Error
        };
    }
};

export const updateMenuData = async (
    empresaId: string,
    areaId: string,
    menuId: string,
    menuData: Omit<Menu, "id" | "order" | "visible">
): Promise<{ success: boolean, message: string, error?: Error }> => {
    try {
        if (!empresaId || !areaId || !menuId)
            throw new Error("Todos los campos son requeridos");

        const menuRef = doc(db, "empresas", empresaId, "areas", areaId, "menus", menuId);
        const menuSnap = await getDoc(menuRef);

        if (!menuSnap.exists()) throw new Error("Menu no encontrado");

        await updateDoc(menuRef, menuData);

        return {
            success: true,
            message: "Menu actualizado con éxito",
            error: undefined
        };
    } catch (error) {
        console.error("Error actualizando menu:", error);
        return {
            success: false,
            message: "Error al actualizar el menu",
            error: error as Error
        };
    }
}