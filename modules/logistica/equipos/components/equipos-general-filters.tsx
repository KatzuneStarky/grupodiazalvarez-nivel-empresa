"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SelectMes from "@/components/global/select-mes"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import Icon from "@/components/global/icon"

interface FiltrosGeneralesProps {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    mes: string,
    setMes: React.Dispatch<React.SetStateAction<string>>
    currentMonth: string
    al20: number[]
    alNatural: number[]
    selectedA20: number[]
    setSelectedA20: React.Dispatch<React.SetStateAction<[number, number]>>
    selectedAlNatural: number[]
    setSelectedAlNatural: React.Dispatch<React.SetStateAction<[number, number]>>
    rangoViajes: number[]
    setSelectedRangoViajes: React.Dispatch<React.SetStateAction<[number, number]>>
    selectedRangoViajes: number[]
}

const EquiposGeneralFilters = ({
    searchTerm,
    setSearchTerm,
    mes,
    setMes,
    currentMonth,
    al20,
    alNatural,
    selectedA20,
    selectedAlNatural,
    setSelectedA20,
    setSelectedAlNatural,
    rangoViajes,
    selectedRangoViajes,
    setSelectedRangoViajes
}: FiltrosGeneralesProps) => {
    const handleClearFilters = () => {
        setSearchTerm("")
        setMes(currentMonth)
        setSelectedA20([0, al20[1]])
        setSelectedAlNatural([0, alNatural[1]])
        setSelectedRangoViajes([0, rangoViajes[1]])
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between gap-2">
                        <div className='flex items-center gap-2'>
                            <Search className="h-4 w-4" />
                            Búsqueda y Filtros
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, numero de licencia, etc..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button onClick={() => handleClearFilters()}>
                        <Filter />
                        Limpiar filtros
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName="rivet-icons:filter" />
                                Rango a 20°
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="text-sm font-bold text-muted-foreground mt-1 mb-5">
                                Rango de Capacidad Total
                            </div>

                            <Slider
                                value={selectedA20}
                                onValueChange={(value) => setSelectedA20(value as [number, number])}
                                min={al20[0]}
                                max={al20[1]}
                                step={0.1}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {al20[0].toFixed(2)}L
                                </div>
                                {selectedA20[1] === al20[0] || selectedA20[1] === al20[1] ? null : (
                                    <div>
                                        {selectedA20[1].toFixed(2)}L
                                    </div>
                                )}
                                <div>
                                    {selectedA20[1].toFixed(2)}L
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName="rivet-icons:filter" />
                                Rango al natural
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="text-sm font-bold text-muted-foreground mt-1 mb-5">
                                Rango de Capacidad Total
                            </div>

                            <Slider
                                value={selectedAlNatural}
                                onValueChange={(value) => setSelectedAlNatural(value as [number, number])}
                                min={alNatural[0]}
                                max={alNatural[1]}
                                step={0.1}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {alNatural[0].toFixed(2)}L
                                </div>
                                {selectedAlNatural[1] === alNatural[0] || selectedAlNatural[1] === alNatural[1] ? null : (
                                    <div>
                                        {selectedAlNatural[1].toFixed(2)}L
                                    </div>
                                )}
                                <div>
                                    {selectedAlNatural[1].toFixed(2)}L
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName="rivet-icons:filter" />
                                Rango de viajes
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="text-sm font-bold text-muted-foreground mt-1 mb-5">
                                Rango de Capacidad Total
                            </div>

                            <Slider
                                value={selectedRangoViajes}
                                onValueChange={(value) => setSelectedRangoViajes(value as [number, number])}
                                min={rangoViajes[0]}
                                max={rangoViajes[1]}
                                step={1}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {rangoViajes[0]} Viaje{rangoViajes[0] === 0 || rangoViajes[0] > 1 ? "s" : ""}
                                </div>
                                {selectedRangoViajes[1] === rangoViajes[0] || selectedRangoViajes[1] === rangoViajes[1] ? null : (
                                    <div>
                                        {selectedRangoViajes[1]} Viaje{rangoViajes[1] === 0 || rangoViajes[1] > 1 ? "s" : ""}
                                    </div>
                                )}
                                <div>
                                    {selectedRangoViajes[1]} Viaje{rangoViajes[1] === 0 || rangoViajes[1] > 1 ? "s" : ""}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant={"outline"} disabled>
                        <Icon iconName="rivet-icons:filter" />
                        Rango por consumo
                    </Button>

                    <SelectMes value={mes} onChange={(e: string) => setMes(e)} className="w-full" />
                </div>
            </CardContent>
        </Card>
    )
}

export default EquiposGeneralFilters