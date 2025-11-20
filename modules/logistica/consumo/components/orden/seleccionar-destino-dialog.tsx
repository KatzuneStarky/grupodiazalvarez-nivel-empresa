"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { consumoTableData } from "../../constants/consumo-table-data";
import { useFormContext } from "react-hook-form";
import { OrdenDeConsumoType } from "../../schema/orden-consumo.schema";

interface SeleccionarDestionDialogProps {
    showTablaDestinos: boolean
    setShowTablaDestinos: React.Dispatch<React.SetStateAction<boolean>>
}

const SeleccionarDestinoDialog = ({
    setShowTablaDestinos,
    showTablaDestinos
}: SeleccionarDestionDialogProps) => {
    const { setValue } = useFormContext<OrdenDeConsumoType>();

    return (
        <Dialog open={showTablaDestinos} onOpenChange={setShowTablaDestinos}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Seleccionar destino</DialogTitle>
                    <DialogDescription>
                        Elige un destino de la tabla para completar la orden de consumo.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[500px] overflow-auto mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="bg-gray-800 text-center">Destino</TableHead>
                                <TableHead className="bg-gray-500 text-center">Kilometros</TableHead>

                                <TableHead className="bg-green-800">Pemex Full1</TableHead>
                                <TableHead className="bg-green-800">Pemex Full2</TableHead>
                                <TableHead className="bg-green-800">Sencillo</TableHead>
                                <TableHead className="bg-green-800">Autotanque</TableHead>

                                <TableHead className="bg-blue-800">Libra Full1</TableHead>
                                <TableHead className="bg-blue-800">Libra Full2</TableHead>
                                <TableHead className="bg-blue-800">Sencillo</TableHead>
                                <TableHead className="bg-blue-800">Autotanque</TableHead>

                                <TableHead className="bg-red-800">Cent Full1</TableHead>
                                <TableHead className="bg-red-800">Cent Full2</TableHead>
                                <TableHead className="bg-red-800">Sencillo</TableHead>
                                <TableHead className="bg-red-800">Autotanque</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {consumoTableData.map((row, i) => (
                                <TableRow
                                    key={i}
                                    className="cursor-pointer hover:bg-gray-700 transition"
                                    onClick={() => {
                                        setValue("destino", row.destino);
                                        setValue("kilometraje", row.kilometros);
                                        setShowTablaDestinos(false);
                                    }}
                                >
                                    <TableCell className="bg-gray-800">{row.destino}</TableCell>
                                    <TableCell className="bg-gray-500 text-center">{row.kilometros}</TableCell>

                                    <TableCell className="bg-green-800 text-center">{row.pemex.full1}</TableCell>
                                    <TableCell className="bg-green-800 text-center">{row.pemex.full2}</TableCell>
                                    <TableCell className="bg-green-800 text-center">{row.pemex.sencillo}</TableCell>
                                    <TableCell className="bg-green-800 text-center">{row.pemex.autotanque}</TableCell>

                                    <TableCell className="bg-blue-800 text-center">{row.libramiento.full1}</TableCell>
                                    <TableCell className="bg-blue-800 text-center">{row.libramiento.full2}</TableCell>
                                    <TableCell className="bg-blue-800 text-center">{row.libramiento.sencillo}</TableCell>
                                    <TableCell className="bg-blue-800 text-center">{row.libramiento.autotanque}</TableCell>

                                    <TableCell className="bg-red-800 text-center">{row.centenario.full1}</TableCell>
                                    <TableCell className="bg-red-800 text-center">{row.centenario.full2}</TableCell>
                                    <TableCell className="bg-red-800 text-center">{row.centenario.sencillo}</TableCell>
                                    <TableCell className="bg-red-800 text-center">{row.centenario.autotanque}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SeleccionarDestinoDialog