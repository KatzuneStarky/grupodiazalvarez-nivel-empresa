import { Building2, FileText, Settings, Users } from "lucide-react";

export const EmpresaFormSteps = [
  {
    id: "basic",
    title: "Información Básica",
    description: "Datos principales de la empresa",
    icon: Building2,
  },
  {
    id: "details",
    title: "Detalles",
    description: "Información adicional y clasificación",
    icon: FileText,
  },
  {
    id: "contacts",
    title: "Contactos",
    description: "Personas de contacto principales",
    icon: Users,
  },
  {
    id: "settings",
    title: "Configuración",
    description: "Preferencias y configuraciones",
    icon: Settings,
  },
]