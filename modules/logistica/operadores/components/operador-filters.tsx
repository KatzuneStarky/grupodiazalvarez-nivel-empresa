"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { TipoLicencia } from "../constants/tipo-licencia"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Emisor } from "../constants/emisor"
import { DateRange } from "react-day-picker"
import { es } from "date-fns/locale"
import { TipoSangre } from "../constants/tipo-sangre"

interface OperadorFiltersProps {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    tipoSangre: string
    setTipoSangre: React.Dispatch<React.SetStateAction<string>>
    filterLicencia: string
    setFilterLicencia: React.Dispatch<React.SetStateAction<string>>
    emisorLicencia: string
    setEmisorLicencia: React.Dispatch<React.SetStateAction<string>>
    dateRange?: DateRange
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const OperadorFilters = ({
    searchTerm,
    setSearchTerm,
    tipoSangre,
    setTipoSangre,
    filterLicencia,
    setFilterLicencia,
    emisorLicencia,
    setEmisorLicencia,
    setDateRange,
    dateRange,
}: OperadorFiltersProps) => {
    const handleClearFilters = () => {
        setSearchTerm("")
        setFilterLicencia("all")
        setEmisorLicencia("all")
        setTipoSangre("all")
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
                        <PopoverTrigger className="col-span-2" asChild>
                            <Button variant={"outline"}>
                                <CalendarIcon />
                                Rango de fecha de creacion
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
                        value={filterLicencia}
                        onValueChange={(value) => setFilterLicencia(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tipo de licencia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos
                            </SelectItem>
                            {TipoLicencia.map((tipo) => (
                                <SelectItem value={tipo.name} key={tipo.id}>
                                    {tipo.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={emisorLicencia}
                        onValueChange={(value) => setEmisorLicencia(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Emisor de licencia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos
                            </SelectItem>
                            {Emisor.map((tipo) => (
                                <SelectItem value={tipo.name} key={tipo.id}>
                                    {tipo.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={tipoSangre}
                        onValueChange={(value) => setTipoSangre(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tipo de sangre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todas
                            </SelectItem>
                            {TipoSangre.map((tipo) => (
                                <SelectItem value={tipo.name} key={tipo.id}>
                                    {tipo.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}

export default OperadorFilters