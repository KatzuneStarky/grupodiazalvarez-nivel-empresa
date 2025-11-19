"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { consumoTableData } from "../../constants/consumo-table-data"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const ConsumoTable = () => {
    return (
        <Card className="p-4">
            <CardContent>
                <CardHeader>
                    <CardTitle>Tabla de consumo 2025</CardTitle>
                </CardHeader>

                <div className="grid grid-rows-3 mt-4 mb-2">
                    <div className="py-2 text-xl flex items-center text-green-500">
                        <div className="w-4 h-4 bg-green-800 mr-2" />
                        ORIGEN DE CARGA EN PEMEX
                    </div>
                    <div className="py-2 text-xl flex items-center text-blue-500">
                        <div className="w-4 h-4 bg-blue-800 mr-2" />
                        CARGAS EN LIBRAMIENTO - 28KM
                    </div>
                    <div className="py-2 text-xl flex items-center text-red-500">
                        <div className="w-4 h-4 bg-red-800 mr-2" />
                        CARGAS EN CENTENARIO - 2KM
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] bg-gray-800 text-center">Destino</TableHead>
                            <TableHead className="w-[100px] bg-gray-500 text-center">Kilometros</TableHead>

                            <TableHead className="bg-green-800 text-center">Full 1 TQ 2.6</TableHead>
                            <TableHead className="bg-green-800 text-center">Full 2 TQ 1.8</TableHead>
                            <TableHead className="bg-green-800 text-center">Sencillo 2.3</TableHead>
                            <TableHead className="bg-green-800 text-center">Autotanque 3.15</TableHead>

                            <TableHead className="bg-blue-800 text-center">Full 1 TQ 2.6</TableHead>
                            <TableHead className="bg-blue-800 text-center">Full 2 TQ 1.8</TableHead>
                            <TableHead className="bg-blue-800 text-center">Sencillo 2.3</TableHead>
                            <TableHead className="bg-blue-800 text-center">Autotanque 3.15</TableHead>

                            <TableHead className="bg-red-800 text-center">Full 1 TQ 2.6</TableHead>
                            <TableHead className="bg-red-800 text-center">Full 2 TQ 1.8</TableHead>
                            <TableHead className="bg-red-800 text-center">Sencillo 2.3</TableHead>
                            <TableHead className="bg-red-800 text-center">Autotanque 3.15</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consumoTableData.map((c, index) => (
                            <TableRow key={index}>
                                <TableCell className="bg-gray-800">{c.destino}</TableCell>
                                <TableCell className="bg-gray-500 text-center">{c.kilometros}</TableCell>
                                <TableCell className="bg-green-800 text-center">{c.pemex.full1}</TableCell>

                                <TableCell className="bg-green-800 text-center">{c.pemex.full2}</TableCell>
                                <TableCell className="bg-green-800 text-center">{c.pemex.sencillo}</TableCell>
                                <TableCell className="bg-green-800 text-center">{c.pemex.autotanque}</TableCell>

                                <TableCell className="bg-blue-800 text-center">{c.libramiento.full1}</TableCell>
                                <TableCell className="bg-blue-800 text-center">{c.libramiento.full2}</TableCell>
                                <TableCell className="bg-blue-800 text-center">{c.libramiento.sencillo}</TableCell>
                                <TableCell className="bg-blue-800 text-center">{c.libramiento.autotanque}</TableCell>

                                <TableCell className="bg-red-800 text-center">{c.centenario.full1}</TableCell>
                                <TableCell className="bg-red-800 text-center">{c.centenario.full2}</TableCell>
                                <TableCell className="bg-red-800 text-center">{c.centenario.sencillo}</TableCell>
                                <TableCell className="bg-red-800 text-center">{c.centenario.autotanque}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ConsumoTable