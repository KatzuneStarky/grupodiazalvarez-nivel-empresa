import { RolUsuario } from "@/enum/user-roles";
import { Menu } from "../types/menu-sistema";

export function filterMenusByRole(menus: Menu[], userRole: RolUsuario): Menu[] {
    return menus
        .filter(menu =>
            menu.visible &&
            (!menu.rolesAllowed || menu.rolesAllowed.includes(userRole))
        )
        .map(menu => ({
            ...menu,
            subMenus: menu.subMenus
                ?.filter(sub =>
                    sub.visible &&
                    (!sub.rolesAllowed || sub.rolesAllowed.includes(userRole))
                )
                .sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => a.order - b.order);
}