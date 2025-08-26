"use client"

import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { CommandDialogEquipos } from "./command-dialog-equipos"
import { Folder, Truck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState } from "react"

const MoreEquiposCard = ({
    equipos
}: {
    equipos: Equipo[]
}) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Card
                className="rounded-lg shadow-lg p-6 hover:shadow-xl 
            transition-shadow duration-300 relative z-10 flex flex-col 
            items-center justify-center space-y-4 cursor-pointer"
                onClick={() => setOpen(!open)}>
                <div className="text-4xl text-blue-600 mb-2">
                    <Folder className="w-24 h-24" />
                </div>
                <div className="text-2xl text-blue-600">
                    <Truck className='w-12 h-12' />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Ver mas camiones
                </h3>
                <p className="text-gray-600 dark:text-white text-sm">
                    Da click aqui para ver todos los equipos
                </p>
            </Card>

            <CommandDialogEquipos
                equipos={equipos}
                setOpen={setOpen}
                open={open}
            />
        </>
    )
}

export default MoreEquiposCard