"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NuevaIncidenciaDialog from "./nueva-incidencia-dialog"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { incidenciaEstadoMap } from "../types/incidencias"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateRange } from "react-day-picker"
import { es } from "date-fns/locale"

interface InicidenciasFiltersProps {
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    setFilterEstado: React.Dispatch<React.SetStateAction<string>>
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    dateRange?: DateRange
    filterEstado: string
    searchTerm: string
    operadorId: string
    equipoId: string
    isAdmin: boolean
}

const IncidenciasFilters = ({
    setFilterEstado,
    setSearchTerm,
    setDateRange,
    filterEstado,
    searchTerm,
    operadorId,
    dateRange,
    equipoId,
    isAdmin
}: InicidenciasFiltersProps) => {
    const handleClearFilters = () => {
        setSearchTerm("")
        setDateRange({ from: new Date(), to: new Date() })
        setFilterEstado("all")
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
                        {isAdmin ? null : (
                            <NuevaIncidenciaDialog
                                operadorId={operadorId}
                                equipoId={equipoId}
                            />
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por folio, operador, numero economico, etc..."
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
                        value={filterEstado}
                        onValueChange={(value) => setFilterEstado(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Estado de orden" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos los estados
                            </SelectItem>
                            {incidenciaEstadoMap.map((estado) => (
                                <SelectItem key={estado.value} value={estado.value}>
                                    {estado.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}

export default IncidenciasFilters