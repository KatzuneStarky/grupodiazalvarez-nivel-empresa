import { RolUsuario } from '@/enum/user-roles';
import { Menu } from '../types/menu-sistema';
import { v4 as uuidv4 } from 'uuid';

const MENU_NAMES = {
    INICIO: 'inicio',
    DASHBOARD: 'dashboard',
    CONFIGURACION: 'configuracion',
    ADMINISTRACION: 'administracion',
};

const MENU_ICONS = {
    HOME: 'ic:round-home',
    DASHBOARD: 'ic:round-dashboard',
    SETTINGS: 'material-symbols:settings',
    ADMIN: 'eos-icons:admin',
};

const commonRoles: RolUsuario[] = [RolUsuario.Admin, RolUsuario.Super_Admin]

export const createDefaultAreaMenus = (empresaName: string, areaId: string, areaName: string): Menu[] => {
    if (!areaId || !areaName || !empresaName) {
        throw new Error("Los valores de \"empresaName\", \"areaId\" y \"areaName\" son requeridos");
    }

    const menus: Menu[] = [
        {
            id: uuidv4(),
            areaId: areaId,
            order: 1,
            path: `/`,
            title: MENU_NAMES.INICIO,
            visible: true,
            rolesAllowed: commonRoles,
            icon: MENU_ICONS.HOME,
            subMenus: []
        },
        {
            id: uuidv4(),
            areaId: areaId,
            order: 2,
            path: `/${empresaName}/${areaName}`,
            title: MENU_NAMES.DASHBOARD,
            visible: true,
            rolesAllowed: commonRoles,
            icon: MENU_ICONS.DASHBOARD,
            subMenus: []
        },
        {
            id: uuidv4(),
            areaId: areaId,
            order: 3,
            path: `/${empresaName}/${areaName}/configuracion`,
            title: MENU_NAMES.CONFIGURACION,
            visible: true,
            rolesAllowed: commonRoles,
            icon: MENU_ICONS.SETTINGS,
            subMenus: []
        },
        {
            id: uuidv4(),
            areaId: areaId,
            order: 4,
            path: `/${empresaName}/${areaName}/administracion`,
            title: MENU_NAMES.ADMINISTRACION,
            visible: true,
            rolesAllowed: commonRoles,
            icon: MENU_ICONS.ADMIN,
            subMenus: []
        },
    ];

    return menus.sort((a, b) => a.order - b.order);
};