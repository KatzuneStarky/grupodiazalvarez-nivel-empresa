"use client"

import MaintenanceTab from '@/modules/logistica/equipos/components/equipoId/tab/maintenance-tab';
import EquipoIdHeader from '@/modules/logistica/equipos/components/equipoId/equipo-id-header';
import DocumentsTab from '@/modules/logistica/equipos/components/equipoId/tab/documents-tab';
import useEquipoDataById from '@/modules/logistica/equipos/hooks/use-equipos-data-by-id';
import GeneralTab from '@/modules/logistica/equipos/components/equipoId/tab/general-tab';
import TanksTab from '@/modules/logistica/equipos/components/equipoId/tab/tanks-tab';
import TabsIndex from '@/modules/logistica/equipos/components/equipoId/tab';
import React, { use, useState } from 'react'

const EquipoIdPage = ({ params }: { params: Promise<{ equipoId: string }> }) => {
    const { equipoId } = use(params);

    const [searchTerm, setSearchTerm] = useState<string>("")
    const { data } = useEquipoDataById(equipoId)

    const numMantenimientos = data.equipo?.mantenimientos && data.equipo.mantenimientos.length || 0
    const numTanques = data.equipo?.tanques && data.equipo.tanques.length || 0
    const numArchivos = data.archivos && data.archivos.length || 0
    const numCertificados = data.certificados && data.certificados.length || 0
    const numArchivosVencimiento = data.archivosVencimiento && data.archivosVencimiento.length || 0
    const totalArchivos = numArchivos + numCertificados + numArchivosVencimiento

    const isExpiringSoon = (date: Date) => {
        const daysUntilExpiry = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
    }

    const isExpired = (date: Date) => {
        return new Date(date) < new Date()
    }

    return (
        <div className="w-full container mx-auto p-4 space-y-6">
            <EquipoIdHeader
                numMantenimientos={numMantenimientos}
                totalArchivos={totalArchivos}
                numTanques={numTanques}
                equipo={data.equipo}
            />

            <TabsIndex>
                <GeneralTab
                    isExpiringSoon={isExpiringSoon}
                    isExpired={isExpired}
                    equipo={data.equipo}
                />
                <TanksTab 
                    isExpired={isExpired}
                    equipo={data.equipo}
                />
                <MaintenanceTab 
                    numMantenimientos={numMantenimientos}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    equipo={data.equipo}
                />
                <DocumentsTab 
                    archivosVencimiento={data.archivosVencimiento}
                    certificado={data.certificados}
                    setSearchTerm={setSearchTerm}
                    archivos={data.archivos}
                    searchTerm={searchTerm}
                />
            </TabsIndex>
        </div>
    )
}

export default EquipoIdPage