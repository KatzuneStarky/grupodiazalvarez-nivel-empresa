"use client"

import { LecturaCombustible } from "../../types/orden-de-consumo"
import { Separator } from "@/components/ui/separator"
import { CardContent } from "@/components/ui/card"
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPdf } from "@tabler/icons-react"
import { Label } from "@/components/ui/label"
import { useCallback, useRef } from "react"
import { toast } from "sonner"


interface PlantillaOrdenConsumoProps {
    lastFolio: number
    fechaString: Date
    mediciones: {
        antes: LecturaCombustible,
        despues: LecturaCombustible
    }
    numEconomico: string
    operadorNombre: string
    kilometraje: number
    destino: string
    observaciones: string
    viewMode: boolean
}

const PlantillaOrdenConsumo = ({
    operadorNombre,
    observaciones,
    numEconomico,
    fechaString,
    kilometraje,
    mediciones,
    lastFolio,
    viewMode,
    destino,
}: PlantillaOrdenConsumoProps) => {
    const plantillaRef = useRef<HTMLDivElement>(null);

    const formatFolio = (num: number): string => {
        return String(num).padStart(6, "0");
    };

    const handleOnBeforePrint = useCallback(() => {
        try {
            toast.success(`Orden de consumo generada con numero de folio ${formatFolio(lastFolio + 1)}`)
        } catch (error) {
            toast.error("Error al generar la orden de consumo")
        }
        return Promise.resolve();
    }, [lastFolio])

    const handleOnAfterPrint = useCallback(() => {
        window.close();
        toast.success("Orden de consumo generada con exito")
    }, [])

    if (!plantillaRef) return null;
    const reactToPrintFn = useReactToPrint({
        contentRef: plantillaRef,
        documentTitle: `Orden de Consumo - ${formatFolio(viewMode === true ? lastFolio : lastFolio + 1)} - ${new Date().toLocaleDateString()}`,
        onAfterPrint: handleOnAfterPrint,
        onBeforePrint: handleOnBeforePrint,
        onPrintError: () => toast.error("Error al generar la orden de consumo"),
    });

    return (
        <div>
            <div ref={plantillaRef} className="border-[3px] border-[#4a6fa5] bg-[#faf8f3] shadow-lg print:w-full print:origin-top-left print:scale-[0.75]">
                <CardContent className="p-8">
                    <div className="mb-6 text-center">
                        <h1 className="mb-1 font-sans text-3xl font-bold uppercase tracking-wide text-[#4a6fa5]">
                            GRUPO DIAZ ALVAREZ
                        </h1>
                        <p className="mb-4 text-base font-semibold uppercase tracking-wide text-[#4a6fa5]">
                            ORDEN DE COMPRA DE COMBUSTIBLES
                        </p>
                        <div className="flex items-baseline justify-end gap-8">
                            <span className="text-sm font-semibold uppercase text-[#4a6fa5]">FOLIO</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-[#c85a54]">N°.</span>
                                <Input
                                    className="w-32 border-0 border-b-2 border-[#4a6fa5] bg-transparent px-0 text-2xl font-bold text-[#c85a54] focus-visible:ring-0 print:border-b-[1px]"
                                    value={formatFolio(viewMode ? lastFolio : lastFolio + 1)}
                                    type="number"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 border-b-2 border-[#4a6fa5] pb-2">
                            <Label htmlFor="fecha" className="text-base font-bold uppercase text-[#4a6fa5]">
                                FECHA:
                            </Label>
                            <Input
                                id="fecha"
                                type="text"
                                className="flex-1 border-0 bg-transparent px-2 text-black font-bold focus-visible:ring-0"
                                placeholder="DD/MM/YYYY"
                                value={fechaString.toLocaleDateString()}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <table className="w-full border-[2px] border-[#4a6fa5]">
                            <thead>
                                <tr>
                                    <th className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3 text-center text-base font-bold uppercase text-[#4a6fa5]">
                                        &nbsp;
                                    </th>
                                    <th className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3 text-center text-base font-bold uppercase text-[#4a6fa5]">
                                        ANTES
                                    </th>
                                    <th className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3 text-center text-base font-bold uppercase text-[#4a6fa5]">
                                        DESPUES
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3 text-base font-bold uppercase text-[#4a6fa5]">
                                        DIESEL
                                    </td>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3">
                                        <Input className="border-0 bg-transparent text-black font-bold focus-visible:ring-0" value={mediciones.antes.diesel} readOnly />
                                    </td>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3">
                                        <Input className="border-0 bg-transparent text-black font-bold focus-visible:ring-0" value={""} readOnly />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3 text-base font-bold uppercase text-[#4a6fa5]">
                                        MEDIDA TANQUE
                                    </td>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3">
                                        <Input className="border-0 bg-transparent text-black font-bold focus-visible:ring-0" value={mediciones.antes.medidaTanque} readOnly />
                                    </td>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3">
                                        <Input className="border-0 bg-transparent text-black font-bold focus-visible:ring-0" value={""} readOnly />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3 text-base font-bold uppercase text-[#4a6fa5]">
                                        MEDIDA TABLERO
                                    </td>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3">
                                        <Input className="border-0 bg-transparent text-black font-bold focus-visible:ring-0" value={mediciones.antes.medidaTablero} readOnly />
                                    </td>
                                    <td className="border-[2px] border-[#4a6fa5] bg-[#faf8f3] p-3">
                                        <Input className="border-0 bg-transparent text-black font-bold focus-visible:ring-0" value={""} readOnly />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b-2 border-[#4a6fa5] pb-2">
                            <Label htmlFor="economico" className="min-w-fit text-base font-bold uppercase text-[#4a6fa5]">
                                No. Económico:
                            </Label>
                            <Input
                                id="economico"
                                type="text"
                                className="flex-1 border-0 bg-transparent px-2 text-black font-bold focus-visible:ring-0"
                                value={numEconomico}
                                readOnly
                            />
                        </div>

                        <div className="flex items-center gap-2 border-b-2 border-[#4a6fa5] pb-2">
                            <Label htmlFor="operador" className="min-w-fit text-base font-bold uppercase text-[#4a6fa5]">
                                Operador:
                            </Label>
                            <Input
                                id="operador"
                                type="text"
                                className="flex-1 border-0 bg-transparent px-2 text-black font-bold focus-visible:ring-0"
                                value={operadorNombre}
                                readOnly
                            />
                        </div>

                        <div className="flex items-center gap-2 border-b-2 border-[#4a6fa5] pb-2">
                            <Label htmlFor="kilometraje" className="min-w-fit text-base font-bold uppercase text-[#4a6fa5]">
                                Kilometraje:
                            </Label>
                            <Input
                                id="kilometraje"
                                type="text"
                                className="flex-1 border-0 bg-transparent px-2 text-black font-bold focus-visible:ring-0"
                                value={kilometraje}
                                readOnly
                            />
                        </div>

                        <div className="flex items-center gap-2 border-b-2 border-[#4a6fa5] pb-2">
                            <Label htmlFor="destino" className="min-w-fit text-base font-bold uppercase text-[#4a6fa5]">
                                Destino:
                            </Label>
                            <Input
                                id="destino"
                                type="text"
                                className="flex-1 border-0 bg-transparent px-2 text-black font-bold focus-visible:ring-0"
                                value={destino}
                                readOnly
                            />
                        </div>

                        <div className="flex items-center gap-2 border-b-2 border-[#4a6fa5] pb-2">
                            <Label htmlFor="observaciones" className="min-w-fit text-base font-bold uppercase text-[#4a6fa5]">
                                Observaciones:
                            </Label>
                            <Input
                                id="observaciones"
                                type="text"
                                className="flex-1 border-0 bg-transparent px-2 text-black font-bold focus-visible:ring-0"
                                value={observaciones}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <p className="mb-3 text-base font-bold uppercase text-[#4a6fa5]">AUTORIZO:</p>
                            <div className="border-b-2 border-[#4a6fa5] pb-8"></div>
                        </div>
                        <div className="text-center">
                            <p className="mb-3 text-base font-bold uppercase text-[#4a6fa5]">RECIBIO:</p>
                            <div className="border-b-2 border-[#4a6fa5] pb-8"></div>
                        </div>
                    </div>
                </CardContent>
            </div>

            <Separator className="mb-4 mt-11" />

            <Button onClick={() => reactToPrintFn()}>
                <IconPdf />
                Descargar PDF
            </Button>
        </div>
    )
}

export default PlantillaOrdenConsumo