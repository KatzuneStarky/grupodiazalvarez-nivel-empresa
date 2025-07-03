import { Building2, CheckCircle, FileText, Layers, Settings, Users } from "lucide-react";

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
    id: "areas",
    title: "Areas",
    description: "Creacion de areas de la empresa",
    icon: Layers,
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
  {
    id: "finish",
    title: "Finalizar",
    description: "Finalizar y guardar los datos",
    icon: CheckCircle,
  }
]