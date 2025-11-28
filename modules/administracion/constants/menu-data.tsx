import { Activity, Blocks, Building2, FileText, Home, LayoutDashboard, MapPin, MenuIcon, Plug, Shield, Users } from "lucide-react";

export const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Panel", href: "/administracion", icon: LayoutDashboard },
    { name: "Empresas", href: "/administracion/empresas", icon: Building2 },
    { name: "Areas", href: "/administracion/areas", icon: MapPin },
    { name: "Menus", href: "/administracion/menus", icon: MenuIcon },
    { name: "Roles", href: "/administracion/roles", icon: Shield },
    { name: "Usuarios", href: "/administracion/usuarios", icon: Users },
    { name: "Modulos", href: "/administracion/modulos", icon: Blocks },
    { name: "Formularios", href: "/administracion/formularios", icon: FileText },
    { name: "Logs", href: "/administracion/logs", icon: Activity },
    { name: "Integraciones", href: "/administracion/integraciones", icon: Plug },
]