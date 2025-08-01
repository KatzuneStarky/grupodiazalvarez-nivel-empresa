import { AreaMenu } from "../types/menu";

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
    },
    {
        id: "3",
        name: "Areas",
        icon: "material-symbols:home-work-rounded",
        link: "/administracion/areas",
        orden: 3,
    },
    {
        id: "4",
        name: "Contactos",
        icon: "mdi:contacts",
        link: "/administracion/contactos",
        orden: 4,
    },
    {
        id: "5",
        name: "Usuarios",
        icon: "mdi:users",
        link: "/administracion/usuarios",
        orden: 5,
    }
]