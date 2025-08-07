"use client"

import MainDashboardLogistica from "@/modules/logistica/main"
import { useArea } from "@/context/area-context"

const AreaPage = () => {
    const { area } = useArea()

    return (
        <div>
            {area?.nombre === "logistica" && <MainDashboardLogistica />}
        </div>
    )
}

export default AreaPage