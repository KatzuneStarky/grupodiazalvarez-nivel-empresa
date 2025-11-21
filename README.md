# 🚛 Sistema de Gestión Empresarial | Grupo Diaz Alvarez Hermanos

<div align="center">

![Version](https://img.shields.io/badge/version-4.5.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-En_Desarrollo-green.svg?style=for-the-badge)
![Private](https://img.shields.io/badge/access-Private-red.svg?style=for-the-badge)

**Plataforma Integral de Planificación de Recursos (ERP) y Operaciones Logísticas**

[Características](#-características-principales) • [Módulos](#-módulos-del-sistema) • [Tecnología](#-stack-tecnológico) • [Instalación](#-instalación)

</div>

---

## 📖 Sobre el Proyecto

Este sistema es una solución tecnológica de **"Nivel Empresa"** diseñada a medida para digitalizar y automatizar las operaciones complejas de **Grupo Diaz Alvarez Hermanos**. No es solo un panel de administración, es el cerebro digital que coordina múltiples empresas, flotas de vehículos, personal y recursos en tiempo real.

Su arquitectura moderna basada en **Next.js 15** garantiza velocidad, mientras que su diseño centrado en el usuario facilita la toma de decisiones críticas en logística y mantenimiento.

---

## 🧩 Módulos del Sistema

El sistema se divide en módulos estratégicos que interactúan entre sí para ofrecer una visión 360° de la operación.

| Módulo | Descripción y Funcionalidades |
| :--- | :--- |
| **🚛 Logística y Transporte** | **El corazón de la operación.** <br> • **Gestión de Flota:** Expediente digital completo de cada unidad (seguros, placas, historial). <br> • **Control de Combustible:** Monitoreo de consumo, rendimiento por unidad y detección de anomalías. <br> • **Operadores:** Gestión de choferes, asignaciones y control de licencias. <br> • **Viajes:** Planificación y seguimiento de rutas logísticas. |
| **🛠️ Mantenimiento** | **Maximización de la vida útil de los activos.** <br> • **Preventivo y Correctivo:** Calendario inteligente de servicios. <br> • **Alertas Tempranas:** Notificaciones automáticas antes de que ocurran fallas críticas. <br> • **Costos:** Control detallado de gastos en refacciones y mano de obra. |
| **📦 Inventario** | **Control total de recursos.** <br> • Gestión de stock de refacciones, llantas e insumos. <br> • Entradas, salidas y auditorías de almacén. |
| **🏢 Administración** | **Gestión corporativa centralizada.** <br> • **Multi-Empresa:** Soporte para múltiples razones sociales bajo un mismo sistema. <br> • **Usuarios:** Control de acceso basado en roles (RBAC) y seguridad avanzada. |

---

## � Stack Tecnológico

Utilizamos las herramientas más avanzadas del ecosistema web actual para garantizar robustez y escalabilidad.

### Frontend & Core
*   ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js) **App Router**: Para una navegación instantánea y SEO optimizado.
*   ![React](https://img.shields.io/badge/React_18-20232a?style=flat-square&logo=react&logoColor=61DAFB) **Server Components**: Rendimiento superior al renderizar en el servidor.
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) **Tipado Estático**: Código más seguro y mantenible.

### Diseño & UI
*   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Estilos**: Diseño moderno y responsivo.
*   ![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=flat-square&logo=shadcnui&logoColor=white) **Componentes**: Interfaz accesible y profesional.
*   ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) **Animaciones**: Experiencia de usuario fluida.

### Backend & Servicios
*   ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) **BaaS**: Autenticación segura, base de datos en tiempo real y almacenamiento.
*   ![Resend](https://img.shields.io/badge/Resend-black?style=flat-square&logo=resend&logoColor=white) **Emails**: Sistema transaccional de correos.
*   ![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat-square&logo=twilio&logoColor=white) **SMS**: Notificaciones urgentes a móviles.

---

## ✨ Características Premium

*   **📊 Dashboard Inteligente**: Gráficos interactivos con **Recharts** para visualizar KPIs en tiempo real.
*   **🗺️ Geolocalización**: Integración con **Leaflet** para visualizar ubicaciones y rutas en mapas interactivos.
*   **📅 Agenda Dinámica**: Calendarios potentes con **FullCalendar** para visualizar mantenimientos y viajes.
*   **📄 Reportes Profesionales**: Exportación de datos a **Excel** y generación de **PDFs** listos para imprimir.
*   **🔔 Centro de Notificaciones**: Sistema unificado de alertas (Toast, Email, SMS) para mantener a todos informados.

---

## 🛠️ Instalación

Si tienes acceso al repositorio, sigue estos pasos para levantar el entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/KatzuneStarky/grupodiazalvarez-nivel-empresa.git

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crea un archivo .env.local con las credenciales de Firebase y APIs

# 4. Iniciar servidor de desarrollo
npm run dev
```

---

<div align="center">
  <small>Desarrollado exclusivamente para Grupo Diaz Alvarez Hermanos © 2025</small>
</div>
