"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mantenimiento } from "@/modules/logistica/bdd/equipos/types/mantenimiento"
import { Calendar, Download, FileText, Gauge, User } from "lucide-react"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Button } from "@/components/ui/button"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface ManteniminetoDialogProps {
    isDialogOpen: boolean
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedRecord: Mantenimiento | null
}

const MantenimientoDialog = ({
    isDialogOpen,
    setIsDialogOpen,
    selectedRecord
}: ManteniminetoDialogProps) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {selectedRecord && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span className="text-balance">{`MANTENIMIENTO: ${selectedRecord.tipoServicio}` || "Mantenimiento"}</span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Fecha del mantenimiento:</span>
                                        <span>{format(parseFirebaseDate(selectedRecord.fecha), "PPP", { locale: es })}</span>
                                    </div>
                                    {selectedRecord.fechaProximo && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">Próximo mantenimiento:</span>
                                            <span>{format(parseFirebaseDate(selectedRecord.fechaProximo), "PPP", { locale: es })}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Kilometraje:</span>
                                        <span>{selectedRecord.kmMomento.toLocaleString()} km</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {selectedRecord.mecanico && (
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">Mecánico:</span>
                                            <span>{selectedRecord.mecanico}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedRecord.notas && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Notas
                                    </h3>
                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{selectedRecord.notas}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h3 className="font-semibold">Datos de Mantenimiento</h3>
                                {selectedRecord.mantenimientoData && selectedRecord.mantenimientoData.length > 0 ? (
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Descripción</TableHead>
                                                    <TableHead>Cantidad</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody key={selectedRecord.id}>
                                                {selectedRecord.mantenimientoData.map((data) => (
                                                    <TableRow key={data.id}>
                                                        <TableCell>{data.descripcion}</TableCell>
                                                        <TableCell>{data.cantidad}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No hay datos disponibles</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold">Evidencia</h3>
                                {selectedRecord.Evidencia && selectedRecord.Evidencia.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedRecord.Evidencia.map((evidencia) => (
                                            <div key={evidencia.id} className="flex items-center justify-between p-3 border rounded-md">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="text-sm truncate" title={evidencia.nombre}>
                                                        {evidencia.nombre}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="ml-2 flex-shrink-0"
                                                >
                                                    <Download className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No hay evidencia disponible</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default MantenimientoDialog