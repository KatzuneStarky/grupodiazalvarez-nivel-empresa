import { Chrome, Mail } from "lucide-react";

export const registrationTypes = [
    {
      id: "google",
      title: "Autenticacion por Google",
      subtitle: "Proveedor OAuth 2.0",
      description: "Autenticacion segura con cuenta de Google",
      icon: Chrome,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      features: ["Autenticacion directa", "No requiere contraseña", "Seguridad por Google"],
    },
    {
      id: "email",
      title: "Correo y contraseña",
      subtitle: "Inicio de sesion tradicional",
      description: "Autenticacion con correo y contraseña",
      icon: Mail,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      features: ["Verificacion de correo electronico", "Recuperacion de contraseña", "Control total"],
    },
  ]