"use client"

import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas"
import AreasList from "@/modules/areas/components/areas-list"


const AreasPage = () => {
    const { empresas, loading } = useAllEmpreas()

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Directorio de Empresas y Áreas</h1>
                <p className="text-muted-foreground text-lg">
                    Gestiona y visualiza las empresas registradas junto con sus áreas de trabajo, equipos y configuraciones.
                </p>
            </div>

            <AreasList empresas={empresas} loading={loading} />
        </div>
    )
}

export default AreasPage