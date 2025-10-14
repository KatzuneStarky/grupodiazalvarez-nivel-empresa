"use client"

import MainDashboardMantenimiento from "@/modules/mantenimiento/components/dashboard"
import MainDashboardLogistica from "@/modules/logistica/main"
import { useArea } from "@/context/area-context"
import SendEmailButton from "@/components/global/send-email-button"

const AreaPage = () => {
    const { area } = useArea()

    return (
        <div>
            <SendEmailButton />
            {area?.nombre === "logistica" && <MainDashboardLogistica />}
            {area?.nombre === "mantenimiento" && <MainDashboardMantenimiento />}
        </div>
    )
}

export default AreaPage