import { Award, Clock, Shield, Truck } from "lucide-react";

export const slides = [
    {
        id: 1,
        title: "Transporte de combustible confiable",
        subtitle: "Atraves de Baja California Sur",
        description:
            `Servicios de transporte de combustible seguro, eficiente, y confiable, 
                al servicio de gasolineras, instalaciones industriales y negocios comerciales.`,
        cta: "Contactenos hoy",
        background: "bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900",
        icon: Truck,
    },
    {
        id: 2,
        title: "Transporte de combustible 24/7",
        subtitle: "Cuando sea necesario",
        description:
            `Servicios de transporte de combustible a la medida, 
            con un equipo de personal altamente capacitado y 
            tecnología de vanguardia.`,
        cta: "Contactenos via telefono",
        background: "bg-gradient-to-br from-orange-900 via-red-800 to-slate-900",
        icon: Clock,
    },
    {
        id: 3,
        title: "La seguridad es nuestro compromiso",
        subtitle: "Certificados y cumplimiento",
        description:
            `Vehiculos seguros, con certificados de seguridad y cumplimiento, 
            para garantizar la seguridad de nuestros clientes.`,
        cta: "Conozca nuestros servicios",
        background: "bg-gradient-to-br from-green-900 via-emerald-800 to-slate-900",
        icon: Shield,
    },
    {
        id: 4,
        title: "X+ Años de experiencia",
        subtitle: "Conoce nuestro equipo",
        description:
            "Con mas de X años de experiencia en el sector, conoce nuestro equipo de trabajo.",
        cta: "Vea nuestra experiencia",
        background: "bg-gradient-to-br from-orange-900 via-red-800 to-slate-900",
        icon: Award,
    },
]