"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateRange } from "react-day-picker"
import Icon from "@/components/global/icon"
import { es } from "date-fns/locale"
import React from "react"

interface FiltersProps {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    dateRange?: DateRange
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    selectedTanquesRange: number[]
    setSelectedTanquesRange: React.Dispatch<React.SetStateAction<[number, number]>>
    tanquesRange: number[],
    filterCombustible: string,
    setFilterCombustible: React.Dispatch<React.SetStateAction<string>>,
    selectCapacidadRage: number[],
    setSelectCapacidadRange: React.Dispatch<React.SetStateAction<[number, number]>>,
    capacidadRange: number[],
}

const EstacionesFilters = ({
    searchTerm,
    setSearchTerm,
    setDateRange,
    dateRange,
    selectedTanquesRange,
    setSelectedTanquesRange,
    tanquesRange,
    filterCombustible,
    setFilterCombustible,
    selectCapacidadRage,
    setSelectCapacidadRange,
    capacidadRange
}: FiltersProps) => {
    const handleClearFilters = () => {
        setSearchTerm("")
        setSelectedTanquesRange([0, tanquesRange[1]])
        setFilterCombustible("all")
        setSelectCapacidadRange([0, capacidadRange[1]])
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
                            placeholder="Buscar por nombre, responsable, telefono, email, etc..."
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
                        <PopoverTrigger className="col-span-2" asChild>
                            <Button variant={"outline"}>
                                <CalendarIcon />
                                Rango de fecha
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                            <span className="block text-sm text-muted-foreground mb-4">
                                Selecciona un rango de fecha para filtrar
                            </span>
                            <Calendar
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={{
                                    from: dateRange?.from,
                                    to: dateRange?.to,
                                }}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="rounded-lg border shadow-sm capitalize"
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>

                    <Select
                        value={filterCombustible}
                        onValueChange={(value) => setFilterCombustible(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Combustible" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos
                            </SelectItem>
                            <SelectItem value="magna">
                                Magna
                            </SelectItem>
                            <SelectItem value="premium">
                                Premium
                            </SelectItem>
                            <SelectItem value="diesel">
                                Diesel
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName="rivet-icons:filter" />
                                Rango capacidad total
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="text-sm font-bold text-muted-foreground mt-1 mb-5">
                                Rango de Capacidad Total
                            </div>

                            <Slider
                                value={selectCapacidadRage}
                                onValueChange={(value) => setSelectCapacidadRange(value as [number, number])}
                                min={capacidadRange[0]}
                                max={capacidadRange[1]}
                                step={100}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {capacidadRange[0]}L
                                </div>
                                {selectCapacidadRage[1] === capacidadRange[0] || selectCapacidadRage[1] === capacidadRange[1] ? null : (
                                    <div>
                                        {selectCapacidadRage[1]}L
                                    </div>
                                )}
                                <div>
                                    {capacidadRange[1]}L
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName="rivet-icons:filter" />
                                Rango de Tanques
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="text-sm font-bold text-muted-foreground mt-1 mb-5">
                                Rango de Tanques
                            </div>

                            <Slider
                                value={selectedTanquesRange}
                                onValueChange={(value) => setSelectedTanquesRange(value as [number, number])}
                                min={tanquesRange[0]}
                                max={tanquesRange[1]}
                                step={1}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {tanquesRange[0]}
                                </div>
                                {selectedTanquesRange[1] === tanquesRange[0] || selectedTanquesRange[1] === tanquesRange[1] ? null : (
                                    <div>
                                        {selectedTanquesRange[1]}
                                        Tanque{selectedTanquesRange[1] === 1 ? "" : "s"}
                                    </div>
                                )}
                                <div>
                                    {tanquesRange[1]}
                                    Tanque{tanquesRange[1] === 1 ? "" : "s"}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
        </Card>
    )
}

export default EstacionesFilters