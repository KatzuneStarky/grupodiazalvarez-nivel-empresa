"use client"

import { TanquesSchema, TanquesSchemaType } from "@/modules/logistica/tanques/schemas/tanques.schema"
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import Icon from "@/components/global/icon"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

const NuevoTanquePage = () => {
    const [isSubmitting, setIsSubmiting] = useState<boolean>(false)
    const [tanqueId, setTanqueId] = useState<string>()
    const { equipos } = useEquipos()
    const router = useRouter()
    const uid = uuidv4()

    const form = useForm<TanquesSchemaType>({
        resolver: zodResolver(TanquesSchema),
        defaultValues: {
            marca: "",
            modelo: "",
            year: 0,
            serie: "",
            placas: "",
            equipoId: "",
            capacidadLitros: 0,
            tipoCombustible: "Diesel",
            numeroTanque: "",
            ubicacion: "Izquierdo",
            activo: true,
            estadoFisico: "Bueno",
            seguro: {
                numeroPoliza: "",
                aseguradora: "",
                vigenciaHasta: new Date(),
                tipoCobertura: "",
            },
            permisoSCT: {
                numero: "",
                tipo: "",
                vigenciaHasta: new Date(),
            },
        }
    })

    const onSubmit = async (data: TanquesSchemaType) => {

    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon iconName="mdi:train-car-tank" className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Nuevo registro de tanque</h1>
                            <p className="text-muted-foreground">
                                Ingrese la información necesaria para generar el nuevo registro de un nuevo tanque.
                            </p>
                        </div>
                    </div>
                    <Separator className="my-4" />

                    <p className="text-muted-foreground mb-2">
                        *Seleccione el equipo al que pertenece el tanque.
                    </p>
                    <div className="w-52">
                        <FormField
                            control={form.control}
                            name="equipoId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full col-span-4">
                                    <FormLabel>Equipo</FormLabel>
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
                    </div>

                    <Separator className="my-4" />
                    <div className="p-6 border rounded-lg">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Marca</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Freightliner" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="modelo"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Modelo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. CASCADIA 125" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Año</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Ej. 2025" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="placas"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Placas</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. XXXXXX" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="serie"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-sm font-medium">Serie</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. 3WKDD40X5FF861812" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevoTanquePage