"use client"

import NewMechanicDialog from "@/modules/mantenimiento/mecanicos/components/new-mechanic-dialog"
import { useMecanicos } from "@/modules/mantenimiento/mecanicos/hooks/use-mecanicos"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Icon from "@/components/global/icon"
import { useMemo, useState } from "react"

const MecanicosPage = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { mecanicos, loading, error } = useMecanicos()
    const { equipos } = useEquipos()

    const equiposConMantenimiento = useMemo(() => {
        return equipos
            .flatMap(equipo => equipo.mantenimiento)
            .map(mantenimiento => mantenimiento.id)
    }, [equipos])

    const mecanicosFiltrados = useMemo(() => {
        return mecanicos.filter(mecanico => equiposConMantenimiento.includes(mecanico.id))
    }, [mecanicos, equiposConMantenimiento])

    const mecanicosConMantenimientos
        = mecanicos.some(mecanico => mecanicosFiltrados.includes(mecanico))


    return (
        <div className="container mx-auto py-6 px-8">
            <PageTitle
                description="Gestión de Mecánicos"
                title="Mecánicos"
                icon={<Icon iconName="mdi:mechanic" className="w-12 h-12 text-primary" />}
                hasActions={true}
                actions={
                    <Button
                        onClick={() => setOpenDialog(!openDialog)}
                    >
                        <Icon iconName="mdi:plus" className="w-4 h-4" />
                        Nuevo Mecánico
                    </Button>
                }
            />
            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/**
                 * {mecanicosFiltrados.map((mecanico) => (
                    <MechanicCard
                        key={mecanico.id}
                        mecanico={mecanico}
                        mantenimientos={getMechanicMaintenances(mecanico.id)}
                    />
                ))}
                 */}
            </div>

            {mecanicosFiltrados.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No se encontraron mecánicos con los filtros seleccionados</p>
                </div>
            )}

            <NewMechanicDialog
                open={openDialog}
                setOpenDialog={setOpenDialog}
            />
        </div>
    )
}

export default MecanicosPage