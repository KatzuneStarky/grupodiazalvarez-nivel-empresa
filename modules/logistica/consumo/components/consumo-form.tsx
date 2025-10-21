"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ReporteViajes } from "../../reportes-viajes/types/reporte-viajes"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { Operador } from "../../bdd/operadores/types/operadores"
import { ConsumoSchemaType } from "../schema/consumo.schema"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { Separator } from "@/components/ui/separator"
import { Check, ChevronsUpDown } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ConsumoFormProps {
    isSubmiting: boolean
    form: UseFormReturn<ConsumoSchemaType>
    submitButton: React.ReactNode
    onSubmit: (data: ConsumoSchemaType) => void
    equipos: Equipo[]
    operadores: Operador[]
    viajes: ReporteViajes[]
    consumoId?: string
}

const ConsumoForm = ({
    isSubmiting,
    form,
    submitButton,
    onSubmit,
    equipos,
    operadores,
    viajes,
    consumoId
}: ConsumoFormProps) => {
    const [viajesFiltrados, setViajesFiltrados] = useState<ReporteViajes[]>([]);
    const litrosCargados = form.watch("litrosCargados") ?? 0;
    const fechaConsumo = form.watch("fecha") ?? new Date();
    const costoLitro = form.watch("costoLitro") ?? 0;
    const kmInicial = form.watch("kmInicial") ?? 0;
    const kmFinal = form.watch("kmFinal") ?? 0;

    const kmRecorridos = kmFinal - kmInicial;
    const rendimiento = kmRecorridos / litrosCargados;
    const costoTotal = litrosCargados * costoLitro;

    useEffect(() => {
        if (kmInicial > 0 && kmFinal > 0) {
            form.setValue("kmRecorridos", kmRecorridos);
        }
    }, [kmInicial, kmFinal, kmRecorridos])

    useEffect(() => {
        if (kmRecorridos > 0 && litrosCargados > 0) {
            form.setValue("rendimientoKmL", rendimiento)
        }
    }, [rendimiento, kmRecorridos, litrosCargados])

    useEffect(() => {
        if (litrosCargados > 0 && costoLitro > 0) {
            form.setValue("costoTotal", costoTotal)
        }
    }, [litrosCargados, costoLitro, costoTotal])

    useEffect(() => {
        const fechaFiltro =
            fechaConsumo instanceof Timestamp ? fechaConsumo.toDate() : new Date(fechaConsumo);

        const filtrados = viajes.filter((viaje) => {
            const fechaViaje =
                viaje.Fecha instanceof Timestamp ? viaje.Fecha.toDate() : new Date(viaje.Fecha);

            return (
                fechaViaje.getFullYear() === fechaFiltro.getFullYear() &&
                fechaViaje.getMonth() === fechaFiltro.getMonth() &&
                fechaViaje.getDate() === fechaFiltro.getDate()
            );
        });

        setViajesFiltrados(filtrados);
    }, [viajes, fechaConsumo]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                    <div className="p-6 border rounded-lg grid grid-cols-2 gap-4">
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
                                                <Button variant="outline" className="w-full justify-between">
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

                        <DatePickerForm<ConsumoSchemaType>
                            label="Fecha del consumo"
                            name="fecha"
                            disabled={isSubmiting}
                            className="w-full col-span-2"
                        />

                        <FormField
                            control={form.control}
                            name="viajeId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full col-span-2">
                                    <FormLabel>Viajes</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {field.value ?
                                                        `${parseFirebaseDate(viajesFiltrados.find((o) => o.id === field.value)?.Fecha).toLocaleDateString()}
                                                                - ${viajesFiltrados.find((o) => o.id === field.value)?.Equipo}`
                                                        : "Seleccionar viaje"}
                                                    <ChevronsUpDown className="ml-2 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar viaje..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontro el viaje.</CommandEmpty>
                                                    <CommandGroup>
                                                        {viajesFiltrados.map((viaje) => {
                                                            return (
                                                                <CommandItem
                                                                    key={viaje.id}
                                                                    onSelect={() => field.onChange(viaje.id)}
                                                                >
                                                                    {parseFirebaseDate(viaje.Fecha).toLocaleDateString()} - {viaje.Equipo}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value === viaje.id ? "opacity-100" : "opacity-0"
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

                    <div className="p-6 border rounded-lg grid grid-cols-3 grid-rows-3 gap-4">
                        <FormField
                            control={form.control}
                            name="kmInicial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Km Inicial
                                    </FormLabel>
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
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">KM</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="kmFinal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Km Final
                                    </FormLabel>
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
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">KM</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="kmRecorridos"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Km Recorridos
                                    </FormLabel>
                                    <FormControl className="cursor-not-allowed">
                                        <div className="flex items-center">
                                            <Input
                                                id="price"
                                                type="number"
                                                pattern="[0-9]*"
                                                inputMode="numeric"
                                                placeholder="0.00"
                                                className="rounded-none h-10 cursor-not-allowed"
                                                disabled
                                                {...field}
                                            />
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">KM</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="litrosCargados"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="text-sm font-medium">
                                        Litros cargados
                                    </FormLabel>
                                    <FormControl className="">
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

                        <FormField
                            control={form.control}
                            name="rendimientoKmL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Rendimiento
                                    </FormLabel>
                                    <FormControl className="">
                                        <div className="flex items-center">
                                            <Input
                                                id="price"
                                                type="number"
                                                pattern="[0-9]*"
                                                inputMode="numeric"
                                                placeholder="0.00"
                                                className="rounded-none h-10"
                                                disabled
                                                {...field}
                                            />
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">KM/L</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="costoLitro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Costo por litro
                                    </FormLabel>
                                    <FormControl className="">
                                        <div className="flex items-center">
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-l-md">$</span>
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

                        <FormField
                            control={form.control}
                            name="costoTotal"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="text-sm font-medium">
                                        Costo total
                                    </FormLabel>
                                    <FormControl className="">
                                        <div className="flex items-center">
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-l-md">$</span>
                                            <Input
                                                id="price"
                                                type="number"
                                                pattern="[0-9]*"
                                                inputMode="numeric"
                                                placeholder="0.00"
                                                className="rounded-none h-10"
                                                disabled
                                                {...field}
                                            />
                                            <span className="inline-block bg-muted px-2 py-2 text-muted-foreground rounded-r-md">KM/L</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="p-6 border rounded-lg grid grid-rows-5 gap-4">
                        <FormField
                            control={form.control}
                            name="observaciones"
                            render={({ field }) => (
                                <FormItem className="w-full h-full row-span-4">
                                    <FormLabel className="text-sm font-medium">Observaciones</FormLabel>
                                    <FormControl className="h-full">
                                        <Textarea
                                            className="h-full resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {submitButton}
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ConsumoForm