"use client"

import MainDashboardMantenimiento from "@/modules/mantenimiento/components/dashboard"
import MainDashboardLogistica from "@/modules/logistica/main"
import { useArea } from "@/context/area-context"
import { useAuth } from "@/context/auth-context"

const AreaPage = () => {
    const { userBdd } = useAuth()
    const { area } = useArea()

    const areaName = area?.nombre?.toLowerCase().trim()
    const userArea = area?.usuarios
    //const userRol = userBdd?.rol

    const dashboards: Record<string, React.ReactNode> = {
        "logistica": <MainDashboardLogistica />,
        "mantenimiento": <MainDashboardMantenimiento />,
    }

    return (
        <div>
            {dashboards[areaName || ""] || (
                <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                    <p>Panel no disponible para el área: {area?.nombre}</p>
                </div>
            )}
        </div>
    )
}

export default AreaPage