"use client"

import { CommandDialogEquipos } from "@/modules/logistica/equipos/documentos/components/command-dialog-equipos"
import { useEquiposDataGeneral } from "@/modules/logistica/equipos/hooks/use-equipos-data-general"
import EquiposGeneralFilters from "@/modules/logistica/equipos/components/equipos-general-filters"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { getCurrentMonthCapitalized } from "@/functions/monts-functions"
import { Separator } from "@/components/ui/separator"
import { useYear } from "@/context/year-context"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import { useState } from "react"

const EquiposGeneralPage = () => {
    const currentMont = getCurrentMonthCapitalized()
    const [mes, setMes] = useState<string>(currentMont)
    const [open, setOpen] = useState<boolean>(false)
    const { selectedYear } = useYear()
    const { equipos } = useEquipos()

    const {
        setSelectedRangoViajes,
        filteredResumenEquipos,
        setSelectedAlNatural,
        selectedRangoViajes,
        selectedAlNatural,
        setSelectedA20,
        setSearchTerm,
        getValueColor,
        rangoViajes,
        selectedA20,
        getValueBg,
        searchTerm,
        alNatural,
        a20,
    } = useEquiposDataGeneral({
        mes: mes || currentMont,
        year: selectedYear || new Date().getFullYear()
    })

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Truck className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Datos generales</h1>
                        <p className="text-muted-foreground">
                            Informacion general de los equipos y sus viajes
                        </p>
                    </div>
                </div>

                <Button onClick={() => setOpen(true)}>
                    <Truck className="h-4 w-4" />
                    Ver equipo
                </Button>

            </div>

            <Separator className="mt-4 mb-8" />
            <EquiposGeneralFilters
                setSelectedRangoViajes={setSelectedRangoViajes}
                setSelectedAlNatural={setSelectedAlNatural}
                selectedRangoViajes={selectedRangoViajes}
                selectedAlNatural={selectedAlNatural}
                setSelectedA20={setSelectedA20}
                setSearchTerm={setSearchTerm}
                currentMonth={currentMont}
                selectedA20={selectedA20}
                rangoViajes={rangoViajes}
                searchTerm={searchTerm}
                alNatural={alNatural}
                setMes={setMes}
                al20={a20}
                mes={mes}
            />
            <Separator className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                {filteredResumenEquipos.map((data, index) => {
                    return (
                        <div
                            key={`${data.numEconomico}-${index}`}
                            className="bg-card rounded-xl border-0 shadow-sm hover:shadow-lg transition-all 
                        duration-300 overflow-hidden group relative"
                        >
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                                <div className="relative">
                                    <div className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Vehículo</div>
                                    <div className="text-2xl font-bold">{data.numEconomico}</div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className={`rounded-lg p-3 ${getValueBg(data.FALTANTESYOSOBRANTESA20)} border border-slate-100`}>
                                        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">A20</div>
                                        <div className={`text-lg font-bold ${getValueColor(data.FALTANTESYOSOBRANTESA20)}`}>
                                            {data.FALTANTESYOSOBRANTESA20 !== undefined
                                                ? (data.FALTANTESYOSOBRANTESA20 > 0 ? "+" : "") + data.FALTANTESYOSOBRANTESA20.toFixed(2)
                                                : "—"}
                                        </div>
                                    </div>

                                    <div
                                        className={`rounded-lg p-3 ${getValueBg(data.FALTANTESYOSOBRANTESALNATURAL)} border border-slate-100`}
                                    >
                                        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Natural</div>
                                        <div className={`text-lg font-bold ${getValueColor(data.FALTANTESYOSOBRANTESALNATURAL)}`}>
                                            {data.FALTANTESYOSOBRANTESALNATURAL !== undefined
                                                ? (data.FALTANTESYOSOBRANTESALNATURAL > 0 ? "+" : "") +
                                                data.FALTANTESYOSOBRANTESALNATURAL.toFixed(2)
                                                : "—"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div className="text-center">
                                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-200 uppercase tracking-wide mb-1">Viajes</div>
                                        <div className="text-xl font-bold text-slate-800 dark:text-slate-400">{data.viajes.toLocaleString()}</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-200"></div>
                                    <div className="text-center">
                                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-200 uppercase tracking-wide mb-1">Consumo</div>
                                        <div className="text-xl font-bold text-slate-800 dark:text-slate-400">{data.consumo.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <CommandDialogEquipos
                equipos={equipos}
                setOpen={setOpen}
                open={open}
            />
        </div>
    )
}

export default EquiposGeneralPage