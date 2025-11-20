"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Operador } from "@/modules/logistica/bdd/operadores/types/operadores"
import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { OrdenDeConsumoType } from "../../schema/orden-consumo.schema"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import SeleccionarDestinoDialog from "./seleccionar-destino-dialog"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Check, ChevronsUpDown, Table2Icon } from "lucide-react"
import PlantillaOrdenConsumo from "./plantilla-orden-consumo"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface OrdenConsumoFormProps {
    onSubmit: (data: OrdenDeConsumoType) => void
    form: UseFormReturn<OrdenDeConsumoType>
    submitButton: React.ReactNode
    operadores: Operador[]
    operadorNombre: string
    isSubmiting: boolean
    numEconomico: string
    equipos: Equipo[]
    lastFolio: number

    operadorId: string
    equipoId: string
}

const OrdenConsumoForm = ({
    operadorNombre,
    submitButton,
    numEconomico,
    isSubmiting,
    operadorId,
    operadores,
    lastFolio,
    onSubmit,
    equipoId,
    equipos,
    form,
}: OrdenConsumoFormProps) => {
    const [showTablaDestinos, setShowTablaDestinos] = useState<boolean>(false);
    const observaciones = form.watch("observaciones")
    const kilometraje = form.watch("kilometraje")
    const mediciones = form.watch("mediciones")
    const destino = form.watch("destino")

    const fecha = form.watch("fecha")
    const fechaString = parseFirebaseDate(fecha)

    useEffect(() => {
        if (operadorId) {
            form.setValue("operadorNombre", operadorNombre || "")
        }

        if (equipoId) {
            form.setValue("numEconomico", numEconomico || "")
        }
    }, [form])

    return (
        <div className="w-full mt-4 grid grid-cols-2 gap-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-6 border rounded-lg gap-4">
                        <DatePickerForm<OrdenDeConsumoType>
                            label="Fecha de la orden"
                            name="fecha"
                            disabled={isSubmiting}
                            className="w-72"
                        />
                    </div>

                    <div className="p-6 border rounded-lg gap-4 mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]"></TableHead>
                                    <TableHead className="border-2">Antes</TableHead>
                                    <TableHead className="border-2">Despues</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-[100px] border-2">Diesel</TableCell>
                                    <TableCell className="border-2">
                                        <FormField
                                            control={form.control}
                                            name="mediciones.antes.diesel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                inputMode="numeric"
                                                                placeholder="0.00"
                                                                className="rounded-none h-10"
                                                                {...field}
                                                            />
                                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">L</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="border-2">
                                        <FormField
                                            control={form.control}
                                            name="mediciones.despues.diesel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                inputMode="numeric"
                                                                placeholder="0.00"
                                                                className="rounded-none h-10"
                                                                {...field}
                                                            />
                                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">L</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[100px] border-2">Medida tanque</TableCell>
                                    <TableCell className="border-2">
                                        <FormField
                                            control={form.control}
                                            name="mediciones.antes.medidaTanque"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                inputMode="numeric"
                                                                placeholder="0.00"
                                                                className="rounded-none h-10"
                                                                {...field}
                                                            />
                                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">L</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="border-2">
                                        <FormField
                                            control={form.control}
                                            name="mediciones.despues.medidaTanque"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                inputMode="numeric"
                                                                placeholder="0.00"
                                                                className="rounded-none h-10"
                                                                {...field}
                                                            />
                                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">L</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="w-[100px] border-2">Medida tablero</TableCell>
                                    <TableCell className="border-2">
                                        <FormField
                                            control={form.control}
                                            name="mediciones.antes.medidaTablero"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                inputMode="numeric"
                                                                placeholder="0.00"
                                                                className="rounded-none h-10"
                                                                {...field}
                                                            />
                                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">L</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="border-2">
                                        <FormField
                                            control={form.control}
                                            name="mediciones.despues.medidaTablero"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <Input
                                                                id="price"
                                                                type="number"
                                                                pattern="[0-9]*"
                                                                inputMode="numeric"
                                                                placeholder="0.00"
                                                                className="rounded-none h-10"
                                                                {...field}
                                                            />
                                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">L</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-6 border rounded-lg gap-4 mt-4 grid grid-cols-2">
                        <FormField
                            control={form.control}
                            name="equipoId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel>Equipos</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {field.value ?
                                                        `${equipos.find((o) => o.id === field.value)?.numEconomico}`
                                                        : "Seleccionar equipo"}
                                                    <ChevronsUpDown className="ml-2 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar equipo..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontro equipo.</CommandEmpty>
                                                    <CommandGroup>
                                                        {equipos.map((equipo) => {
                                                            return (
                                                                <CommandItem
                                                                    key={equipo.id}
                                                                    onSelect={() => field.onChange(equipo.id)}
                                                                >
                                                                    {equipo.numEconomico}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value === equipo.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            );
                                                        })}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="operadorId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel>Operador</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className="w-full justify-between truncate">
                                                    {field.value ?
                                                        `${operadores.find((o) => o.id === field.value)?.nombres}
                                                                ${operadores.find((o) => o.id === field.value)?.apellidos}`
                                                        : "Seleccionar operador"}
                                                    <ChevronsUpDown className="ml-2 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar operador..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontro operador.</CommandEmpty>
                                                    <CommandGroup>
                                                        {operadores.map((operador) => {
                                                            return (
                                                                <CommandItem
                                                                    key={operador.id}
                                                                    onSelect={() => field.onChange(operador.id)}
                                                                >
                                                                    {operador.nombres} {operador.apellidos}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value === operador.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            );
                                                        })}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="p-6 place-items-end border rounded-lg gap-4 mt-4 grid grid-cols-9">
                        <FormField
                            control={form.control}
                            name="destino"
                            render={({ field }) => (
                                <FormItem className="col-span-4 w-full">
                                    <FormLabel>Destino</FormLabel>
                                    <FormControl>
                                        <Input className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="kilometraje"
                            render={({ field }) => (
                                <FormItem className="col-span-4 w-full">
                                    <FormLabel>Kilometraje</FormLabel>
                                    <FormControl>
                                        <Input className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            onClick={() => setShowTablaDestinos(!showTablaDestinos)}
                            className="h-10 w-full"
                            type="button"
                        >
                            <Table2Icon className="size-6" />
                        </Button>
                    </div>

                    <div className="p-6 border rounded-lg mt-4">
                        <FormField
                            control={form.control}
                            name="observaciones"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">Observaciones</FormLabel>
                                    <FormControl className="h-full">
                                        <Textarea
                                            className="h-56 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator className="my-4" />
                    {submitButton}

                    <SeleccionarDestinoDialog
                        setShowTablaDestinos={setShowTablaDestinos}
                        showTablaDestinos={showTablaDestinos}
                    />
                </form>
            </Form>

            <PlantillaOrdenConsumo
                observaciones={observaciones || ""}
                operadorNombre={operadorNombre}
                numEconomico={numEconomico}
                fechaString={fechaString}
                kilometraje={kilometraje}
                mediciones={mediciones}
                lastFolio={lastFolio}
                destino={destino}
                viewMode={false}
            />
        </div>
    )
}

export default OrdenConsumoForm