"use client"

import { Equipo } from "../../bdd/equipos/types/equipos"
import EquipoCardSkeleton from "./equipo-card-skeleton"
import EquipoCard from "./equipo-card"

interface EquipoGridProps {
    equipos: Equipo[]
    loading?: boolean
    onSelect: (id: string) => void
    onStatusToggle: (id: string, activo: boolean) => Promise<void>
    onDocumentUpload: (file: File) => void
}

const EquiposGrid = ({
    equipos,
    loading = false,
    onSelect,
    onStatusToggle,
    onDocumentUpload,
}: EquipoGridProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <EquipoCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (equipos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400 mb-2">No se encontraron equipos</h3>
                <p className="text-gray-500 dark:text-gray-300">Intenta ajustar tu criterio de busqueda</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipos.map((equipo) => (
                <EquipoCard
                    key={equipo.id}
                    equipo={equipo}
                    onSelect={onSelect}
                    onStatusToggle={onStatusToggle}
                    onDocumentUpload={onDocumentUpload}
                />
            ))}
        </div>
    )
}

export default EquiposGrid