import { AreaMenu, BaseMenu } from "../types/menu";

export const menusAdministracion: AreaMenu[] = [
    {
        id: "1",
        name: "Inicio",
        icon: "ic:round-home",
        link: "/administracion",
        orden: 1,
    },
    {
        id: "2",
        name: "Empresas",
        icon: "mdi:building",
        link: "/administracion/empresas",
        orden: 2,
    }
]