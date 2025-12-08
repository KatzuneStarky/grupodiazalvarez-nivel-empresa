"use client"

import { MantenimientoSchema, MantenimientoSchemaType } from "@/modules/mantenimiento/mantenimientos/schemas/mantenimiento.schema";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import UploadEvidencia from "@/modules/mantenimiento/mantenimientos/components/upload-evidencia";
import { Camera, Check, CheckCircle2, ChevronsUpDown, Trash, Truck, Wrench } from "lucide-react";
import { tipoServicio } from "@/modules/mantenimiento/mantenimientos/constants/tipo-servicio";
import { writeMantenimiento } from "@/modules/mantenimiento/mantenimientos/actions/write";
import { useMecanicos } from "@/modules/mantenimiento/mecanicos/hooks/use-mecanicos";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos";
import { DatePickerForm } from "@/components/custom/date-picker-form";
import { useFieldArray, useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconTools } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NuevoMantenimientoPage = () => {
    const [mantenimientoId, setMantenimientoId] = useState<string | null>(null);
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const { mecanicos } = useMecanicos()
    const { equipos } = useEquipos()
    const router = useRouter()

    const form = useForm<MantenimientoSchemaType>({
        resolver: zodResolver(MantenimientoSchema),
        defaultValues: {
            equipoId: "",
            Evidencia: [],
            fecha: new Date(),
            fechaProximo: new Date(),
            kmMomento: 0,
            mecanicoId: "",
            notas: "",
            tipoServicio: "",
            mantenimientoData: [],
            estado: "Pendiente",
            tipoMantenimiento: "Preventivo",
            proximoKm: 0,
        }
    })

    const onSubmit = async (data: MantenimientoSchemaType) => {
        setIsSubmiting(true);
        try {
            toast.promise(writeMantenimiento(data, data.equipoId), {
                loading: "Creando mantenimiento, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        setMantenimientoId(result.id || "");
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el mantenimiento.";
                },
            })

            form.reset()
            router.back()
        } catch (error) {
            console.log(error);
            toast.error("Error al crear el mantenimiento", {
                duration: 5000,
                description: "Por favor, intente de nuevo",
            })
        } finally {
            setIsSubmiting(false);
        }
    }

    const { fields, append, remove } = useFieldArray({
        name: "mantenimientoData",
        control: form.control
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Wrench className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Nuevo registro de mantenimiento</h1>
                            <p className="text-muted-foreground">
                                Ingrese la información necesaria para generar el nuevo registro de un nuevo mantenimiento.
                            </p>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-muted-foreground">Informacion del equipo</h1>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <FormField
                            control={form.control}
                            name="equipoId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Equipo</FormLabel>
                                    <Popover>
                                        <PopoverTrigger disabled={isSubmiting} asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? equipos.find(
                                                            (equipo) => equipo.id === field.value
                                                        )?.numEconomico
                                                        : "Selecciona un equipo"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar equipo..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontró ningún equipo.</CommandEmpty>
                                                    <CommandGroup>
                                                        {equipos.map((equipo) => (
                                                            <CommandItem
                                                                value={equipo.numEconomico}
                                                                key={equipo.numEconomico}
                                                                onSelect={() => {
                                                                    form.setValue("equipoId", equipo.id);
                                                                }}
                                                            >
                                                                {equipo.numEconomico}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        equipo.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DatePickerForm<MantenimientoSchemaType>
                            label="Fecha de mantenimiento"
                            name="fecha"
                            disabled={isSubmiting}
                        />

                        <FormField
                            control={form.control}
                            name="kmMomento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Kilometraje</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="X Kilometraje"
                                            className="h-10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator className="my-4" />
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Wrench className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-muted-foreground">Informacion del mantenimiento</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        <FormField
                            control={form.control}
                            name="mecanicoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Mecanico</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="X Mecanico"
                                            className="h-10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DatePickerForm<MantenimientoSchemaType>
                            label="Proximo mantenimiento"
                            name="fechaProximo"
                            disabled={isSubmiting}
                        />

                        <FormField
                            control={form.control}
                            name="tipoServicio"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Tipo de servicio</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    field.value ? field.value : "Selecciona un tipo de servicio"
                                                } />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {tipoServicio.map((item, index) => (
                                                <SelectItem value={item.value} key={item.key}>
                                                    <div className='flex items-center'>
                                                        {item.value}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notas"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-3">
                                    <FormLabel className="text-sm font-medium">Notas</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notas del mantenimiento"
                                            className="h-32 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <IconTools className="h-4 w-4 text-primary" />
                            </div>
                            <h1 className="text-muted-foreground">Datos del mantenimiento</h1>
                        </div>

                        <Button
                            onClick={() => append({
                                cantidad: "",
                                descripcion: "",
                                mantenimientoId: ""
                            })}
                            type="button"
                        >
                            Agregar item
                        </Button>
                    </div>

                    {fields.length === 0 ? (
                        <div className="space-y-2">
                            <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No hay datos del mantenimento</p>
                                <p className="text-sm">Haga clic en "Agregar item" para comenzar</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-4">
                            {fields.map((field, index) => (
                                <div key={index} className="grid grid-cols-11 gap-4 place-items-end">
                                    <FormField
                                        control={form.control}
                                        name={`mantenimientoData.${index}.descripcion`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-5 w-full">
                                                <FormLabel className="text-sm font-medium">Descripcion</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="X Descripcion"
                                                        className="h-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`mantenimientoData.${index}.cantidad`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-5 w-full">
                                                <FormLabel className="text-sm font-medium">Cantidad</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="X Cantidad"
                                                        className="h-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        variant={"destructive"}
                                        className="w-full"
                                        size={"lg"}
                                        type="button"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash className="w-8 h-8" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Separator className="my-4" />
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Camera className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-muted-foreground">Evidencia del mantenimiento</h1>
                    </div>

                    <div className="mt-4">
                        <UploadEvidencia
                            control={form.control}
                            name="Evidencia"
                            mantenimientoId={mantenimientoId || ""}
                            isSubmitting={isSubmiting}
                        />
                    </div>

                    <Separator className="my-4" />
                    <div className="flex items-center justify-end w-full">
                        <Button type="submit" disabled={isSubmiting}>
                            {isSubmiting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando mantenimiento...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Guardar mantenimiento
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevoMantenimientoPage