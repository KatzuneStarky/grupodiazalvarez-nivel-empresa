"use client"

import { Edit, Eye, Plus, Search, Trash, WrenchIcon, Calendar as CalendarIcon, ChevronsUpDownIcon, CheckIcon } from "lucide-react"
import MantenimientoDialog from "@/modules/mantenimiento/mantenimientos/components/mantenimiento-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import EvidenciasDialog from "@/modules/mantenimiento/mantenimientos/components/evidencias-dialog"
import { tipoServicio } from "@/modules/mantenimiento/mantenimientos/constants/tipo-servicio"
import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DateRange } from "react-day-picker"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

const MantenimientosTablePage = () => {
    const [selectedRecord, setSelectedRecord] = useState<Mantenimiento | null>(null)
    const [selectedKmRange, setSelectedKmRange] = useState<[number, number]>([0, 0])
    const [tipoServicioFilter, setTipoServicioFilter] = useState("all")
    const [kmRange, setKmRange] = useState<[number, number]>([0, 0])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [mecanico, setMecanico] = useState<string>("all")
    const [equipoId, setEquipoId] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)

    const { directLink } = useDirectLink("/mantenimientos/nuevo")
    const { equipos } = useEquipos()
    const router = useRouter()

    const mantenimientos = useMemo(() => {
        return equipos.flatMap((equipo) => {
            return equipo.mantenimiento
        }).sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        })
    }, [equipos])

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (mantenimientos.length === 0) return undefined;

        return {
            from: new Date(mantenimientos[0].fecha),
            to: new Date(mantenimientos[mantenimientos.length - 1].fecha),
        };
    });

    const filterMantenimientos = useMemo(() => {
        return mantenimientos.filter((mantenimiento) => {
            const fechaMantenimiento = parseFirebaseDate(mantenimiento.fecha);

            if (dateRange) {
                const { from, to } = dateRange;
                if (from && fechaMantenimiento < new Date(from)) return false;
                if (to && fechaMantenimiento > new Date(to)) return false;
            }

            const matchesTipoServicio = tipoServicioFilter === "all" || mantenimiento.tipoServicio === tipoServicioFilter
            const matchesMecanico = mecanico === "all" || mantenimiento.mecanico?.toLowerCase() === mecanico.toLowerCase()
            const matchesEquipoId = equipoId === "all" || mantenimiento.equipoId === equipoId
            const matchesKm =
                selectedKmRange[0] <= mantenimiento.kmMomento &&
                mantenimiento.kmMomento <= selectedKmRange[1]

            const term = searchTerm.toLowerCase();
            const matchSearch = searchTerm === "" ||
                mantenimiento.notas?.toLowerCase().includes(term) ||
                mantenimiento.mecanico?.toLowerCase().includes(term) ||
                mantenimiento.tipoServicio?.toLowerCase().includes(term) ||
                mantenimiento.equipo?.numEconomico?.toLowerCase().includes(term);

            return matchesTipoServicio
                && fechaMantenimiento
                && matchSearch
                && matchesMecanico
                && matchesEquipoId
                && matchesKm;
        });
    }, [mantenimientos, dateRange, tipoServicioFilter, mecanico, equipoId, selectedKmRange]);

    useEffect(() => {
        if (mantenimientos.length > 0) {
            const kmValues = mantenimientos.map(m => m.kmMomento)
            const min = 0
            const max = Math.max(...kmValues)

            setKmRange([min, max])
            setSelectedKmRange([min, max])
        }
    }, [mantenimientos])

    const uniqueMecanicos = [...new Set(mantenimientos.map((m) => m.mecanico))]

    const numEconomicoEquipo = (equipoId: string): string => {
        return equipos.find((e) => e.id === equipoId)?.numEconomico || ""
    }

    const handleTableCellClick = (record: Mantenimiento) => {
        setSelectedRecord(record)
        setIsDialogOpen(true)
    }

    if (equipoId === "") return setEquipoId("all")

    return (
        <div className="container mx-auto py-8 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon iconName='vaadin:tools' className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Tabla de mantenimientos</h1>
                            <p className="text-muted-foreground">
                                Gestione la informacion de los mantenimientos de cada equipo registrado en la plataforma.
                            </p>
                        </div>
                    </div>

                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push(directLink)}>
                        <WrenchIcon className="h-4 w-4 mr-2" />
                        Nuevo Mantenimiento
                    </Button>
                </div>

                <Separator className="my-4" />

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
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por número de tanque, marca, modelo, serie o vehículo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
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

                <Separator className="my-8" />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Fecha del mantenimiento</TableHead>
                            <TableHead>KM al momento</TableHead>
                            <TableHead>Mecanico</TableHead>
                            <TableHead>Proximo mantenimiento</TableHead>
                            <TableHead>Tipo de servicio</TableHead>
                            <TableHead>Datos del servicio</TableHead>
                            <TableHead className="text-center">Evidencia</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterMantenimientos.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell>{numEconomicoEquipo(m.equipoId || "")}</TableCell>
                                <TableCell>{format(parseFirebaseDate(m.fecha), "PPP", { locale: es })}</TableCell>
                                <TableCell>{m.kmMomento}KM</TableCell>
                                <TableCell>{m.mecanico}</TableCell>
                                <TableCell>{format(parseFirebaseDate(m.fechaProximo), "PPP", { locale: es })}</TableCell>
                                <TableCell>{m.tipoServicio}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className="mr-2">
                                            {m.mantenimientoData?.[0]?.descripcion}{" "}
                                            {m.mantenimientoData?.[0]?.cantidad}
                                        </div>

                                        {m.mantenimientoData && m.mantenimientoData.length > 1 && (
                                            <Badge className="px-2 py-1 justify-items-start place-items-start" variant="secondary">
                                                <Plus className="h-4 w-4 text-white" />({m.mantenimientoData.length - 1})
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <EvidenciasDialog evidencias={m.Evidencia || null} />
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant={"outline"} className="w-8 h-8" onClick={() => handleTableCellClick(m)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>

                                        <Button variant={"outline"} className="w-8 h-8">
                                            <Edit className="w-4 h-4" />
                                        </Button>

                                        <Button variant={"outline"} className="w-8 h-8">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <MantenimientoDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                selectedRecord={selectedRecord}
                key={selectedRecord?.id}
            />
        </div>
    )
}

export default MantenimientosTablePage