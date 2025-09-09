"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, Filter, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { tipoServicio } from "../constants/tipo-servicio"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateRange } from "react-day-picker"
import Icon from "@/components/global/icon"
import React, { useState } from "react"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface FiltersProps {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    dateRange?: DateRange
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    tipoServicioFilter: string
    setTipoServicioFilter: React.Dispatch<React.SetStateAction<string>>
    mecanico: string
    setMecanico: React.Dispatch<React.SetStateAction<string>>
    uniqueMecanicos: string[]
    equipoId: string
    equipos: Equipo[]
    setEquipoId: React.Dispatch<React.SetStateAction<string>>
    selectedKmRange: number[]
    setSelectedKmRange: React.Dispatch<React.SetStateAction<[number, number]>>
    kmRange: number[]
}

const MantenimientosFilters = ({
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    tipoServicioFilter,
    setTipoServicioFilter,
    mecanico,
    setMecanico,
    uniqueMecanicos,
    equipoId,
    equipos,
    setEquipoId,
    selectedKmRange,
    setSelectedKmRange,
    kmRange,
}: FiltersProps) => {
    const [open, setOpen] = useState(false)

    const handleClearFilters = () => {
        setSearchTerm("")
        setDateRange(undefined)
        setTipoServicioFilter("all")
        setMecanico("all")
        setEquipoId("all")
        setSelectedKmRange([0, kmRange[1]])
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
                            placeholder="Buscar por numero economico, km al momento, tipo de servicio, etc..."
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
                        value={tipoServicioFilter}
                        onValueChange={(value) => setTipoServicioFilter(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tipo de servicio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos
                            </SelectItem>
                            {tipoServicio.map((item) => (
                                <SelectItem value={item.value} key={item.key}>
                                    <div className="flex items-center">
                                        {item.value}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={mecanico}
                        onValueChange={(value) => setMecanico(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Mecanico" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos
                            </SelectItem>
                            {uniqueMecanicos.map((item, index) => (
                                <SelectItem value={item || ""} key={index}>
                                    <div className="flex items-center">
                                        {item}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                            >
                                {equipoId === "all" ? "Todos"
                                    : equipos.find((e) => e.id === equipoId)?.numEconomico}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Command>
                                <CommandInput placeholder="Buscar equipo..." />
                                <CommandList>
                                    <CommandEmpty>No se encontro el equipo</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            key="all"
                                            value="all"
                                            onSelect={(currentValue) => {
                                                setEquipoId(currentValue === equipoId ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    equipoId === "all" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            Todos
                                        </CommandItem>
                                        {equipos.map((e) => (
                                            <CommandItem
                                                key={e.id}
                                                value={e.id}
                                                onSelect={(currentValue) => {
                                                    setEquipoId(currentValue === equipoId ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                <CheckIcon
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        equipoId === e.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {e.numEconomico}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                                <Icon iconName="formkit:range" />
                                Rango de KM
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="text-sm font-bold text-muted-foreground mt-1 mb-5">
                                Rango de KM al momento
                            </div>

                            <Slider
                                value={selectedKmRange}
                                onValueChange={(value) => setSelectedKmRange(value as [number, number])}
                                min={kmRange[0]}
                                max={kmRange[1]}
                                step={100}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <div>
                                    {kmRange[0]}KM
                                </div>
                                {selectedKmRange[1] === kmRange[0] || selectedKmRange[1] === kmRange[1] ? null : (
                                    <div>
                                        {selectedKmRange[1]}KM
                                    </div>
                                )}
                                <div>
                                    {kmRange[1]}KM
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
        </Card>
    )
}

export default MantenimientosFilters