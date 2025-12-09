"use client"

import { useMantenimientosFilters } from "@/modules/mantenimiento/mantenimientos/hooks/use-mantenimientos-filters"
import MantenimientoDialog from "@/modules/mantenimiento/mantenimientos/components/mantenimiento-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import EvidenciasDialog from "@/modules/mantenimiento/mantenimientos/components/evidencias-dialog"
import MantenimientosFilters from "@/modules/mantenimiento/mantenimientos/components/filters"
import { Edit, Eye, Plus, Trash, WrenchIcon } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useDirectLink } from "@/hooks/use-direct-link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/global/icon"
import { useRouter } from "next/navigation"
import { es } from "date-fns/locale"
import { format } from "date-fns"

const MantenimientosTablePage = () => {
    const { directLink } = useDirectLink("/mantenimientos/nuevo")
    const {
        filterMantenimientos,
        handleTableCellClick,
        numEconomicoEquipo,
        setIsDialogOpen,
        selectedRecord,
        isDialogOpen,
        setEquipoId,
        equipoId,
        dateRange,
        setDateRange,
        equipos,
        kmRange,
        mecanico,
        searchTerm,
        selectedKmRange,
        setMecanico,
        setSearchTerm,
        setSelectedKmRange,
        setTipoServicioFilter,
        tipoServicioFilter,
        uniqueMecanicos,
    } = useMantenimientosFilters()
    const router = useRouter()

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
                <MantenimientosFilters
                    equipoId={equipoId}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    tipoServicioFilter={tipoServicioFilter}
                    setTipoServicioFilter={setTipoServicioFilter}
                    equipos={equipos}
                    kmRange={kmRange}
                    mecanico={mecanico}
                    searchTerm={searchTerm}
                    selectedKmRange={selectedKmRange}
                    setEquipoId={setEquipoId}
                    setMecanico={setMecanico}
                    setSearchTerm={setSearchTerm}
                    setSelectedKmRange={setSelectedKmRange}
                    uniqueMecanicos={uniqueMecanicos || []}
                />
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
                                <TableCell>{m.mecanicoId}</TableCell>
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