"use client"

import { MantenimientoSchema, MantenimientoSchemaType } from "@/modules/mantenimiento/mantenimientos/schemas/mantenimiento.schema";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import UploadEvidencia from "@/modules/mantenimiento/mantenimientos/components/upload-evidencia";
import { Camera, Check, CheckCircle2, ChevronsUpDown, Trash, Truck, Wrench, AlertCircle, Info, User, Mail, Phone, Building2 } from "lucide-react";
import { tipoServicio } from "@/modules/mantenimiento/mantenimientos/constants/tipo-servicio";
import { completeOrdenMantenimiento } from "@/modules/mantenimiento/actions/complete-order";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NuevoMantenimientoPage = () => {
    const [mantenimientoId, setMantenimientoId] = useState<string | null>(null);
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const { currentUser } = useAuth();
    const { mecanicos } = useMecanicos()
    const { equipos } = useEquipos()
    const router = useRouter()

    // Obtener parámetros de la URL
    const ordenId = searchParams.get('ordenId');
    const equipoIdParam = searchParams.get('equipoId');
    const incidenciaIdParam = searchParams.get('incidenciaId');
    const descripcionParam = searchParams.get('descripcion');
    const prioridadParam = searchParams.get('prioridad');
    const kmActualParam = searchParams.get('kmActual');

    // Buscar el mecánico actual
    const currentMecanico = mecanicos.find(m => m.email === currentUser?.email);

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
            estado: "Completado",
            tipoMantenimiento: "Correctivo",
            proximoKm: 0,
            ordenMantenimientoId: undefined,
            incidenciaId: undefined,
        }
    })

    // Prellenar el formulario cuando hay parámetros de URL
    useEffect(() => {
        const fetchIncidenciaData = async () => {
            if (ordenId && equipoIdParam) {
                // Prellenar equipo
                form.setValue('equipoId', equipoIdParam);

                // Prellenar mecánico si existe
                if (currentMecanico) {
                    form.setValue('mecanicoId', currentMecanico.id);
                }

                // Prellenar notas con la descripción del problema
                if (descripcionParam) {
                    form.setValue('notas', `Problema reportado: ${descripcionParam}\n\nTrabajo realizado:\n`);
                }

                // Buscar la incidencia para obtener el kilometraje
                if (incidenciaIdParam && equipoIdParam) {
                    try {
                        const { doc, getDoc } = await import('firebase/firestore');
                        const { db } = await import('@/firebase/client');

                        const incidenciaRef = doc(db, 'equipos', equipoIdParam, 'incidencias', incidenciaIdParam);
                        const incidenciaSnap = await getDoc(incidenciaRef);

                        if (incidenciaSnap.exists()) {
                            const incidenciaData = incidenciaSnap.data();
                            if (incidenciaData.kmActual) {
                                form.setValue('kmMomento', incidenciaData.kmActual);
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching incidencia:', error);
                    }
                }

                // Guardar referencias
                form.setValue('ordenMantenimientoId', ordenId);
                if (incidenciaIdParam) {
                    form.setValue('incidenciaId', incidenciaIdParam);
                }

                // Establecer tipo de mantenimiento según prioridad
                if (prioridadParam === 'Critica') {
                    form.setValue('tipoMantenimiento', 'Emergencia');
                } else {
                    form.setValue('tipoMantenimiento', 'Correctivo');
                }
            }
        };

        fetchIncidenciaData();
    }, [ordenId, equipoIdParam, incidenciaIdParam, descripcionParam, prioridadParam, currentMecanico, form]);


    const onSubmit = async (data: MantenimientoSchemaType) => {
        setIsSubmiting(true);
        try {
            // Primero crear el mantenimiento
            const loadingToast = toast.loading(ordenId ? "Completando orden de mantenimiento..." : "Creando mantenimiento, favor de esperar...");

            const result = await writeMantenimiento(data, data.equipoId);

            toast.dismiss(loadingToast);

            if (!result.success) {
                toast.error(result.message || "Error al registrar el mantenimiento");
                return;
            }

            setMantenimientoId(result.id || "");
            toast.success(result.message);

            // Si viene de una orden, completarla
            if (ordenId && result.id && currentMecanico) {
                const completeResult = await completeOrdenMantenimiento(ordenId, currentMecanico.id, result.id);

                if (completeResult.success) {
                    toast.success("Orden de mantenimiento completada exitosamente", {
                        description: "El estado de la orden ha sido actualizado a 'Completada'"
                    });
                } else {
                    toast.error("Error al completar la orden", {
                        description: completeResult.error || "No se pudo actualizar el estado de la orden"
                    });
                }
            }

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
                            <h1 className="text-3xl font-bold">
                                {ordenId ? 'Completar Orden de Mantenimiento' : 'Nuevo registro de mantenimiento'}
                            </h1>
                            <p className="text-muted-foreground">
                                {ordenId
                                    ? 'Complete los detalles del trabajo realizado para finalizar la orden'
                                    : 'Ingrese la información necesaria para generar el nuevo registro de un nuevo mantenimiento.'
                                }
                            </p>
                        </div>
                    </div>

                    {ordenId && (
                        <Alert className="mt-4 border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertTitle className="text-blue-900 dark:text-blue-100">Completando Orden de Mantenimiento</AlertTitle>
                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <div className="space-y-1 text-sm">
                                    <p>Esta orden de mantenimiento se marcará como <strong>Completada</strong> al guardar este registro.</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Orden ID: <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">{ordenId.slice(0, 8)}...</code>
                                        {incidenciaIdParam && (
                                            <> | Incidencia ID: <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">{incidenciaIdParam.slice(0, 8)}...</code></>
                                        )}
                                    </p>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    <Separator className="my-4" />
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-muted-foreground">Información del equipo y mecánico</h1>
                    </div>

                    {/* Tarjetas Informativas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        {/* Tarjeta de Equipo */}
                        <Card className="overflow-hidden border-2">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-lg">Equipo</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <FormField
                                    control={form.control}
                                    name="equipoId"
                                    render={({ field }) => {
                                        const selectedEquipo = equipos.find(e => e.id === field.value);

                                        return (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger disabled={isSubmiting} asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "justify-between h-11",
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
                                                    <PopoverContent className="w-[280px] p-0">
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

                                                {/* Información del equipo seleccionado */}
                                                {selectedEquipo && (
                                                    <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                                Unidad {selectedEquipo.numEconomico}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {selectedEquipo.tipoUnidad}
                                                            </Badge>
                                                        </div>
                                                        {selectedEquipo.marca && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Building2 className="h-3 w-3" />
                                                                <span>{selectedEquipo.marca} {selectedEquipo.modelo}</span>
                                                            </div>
                                                        )}
                                                        {selectedEquipo.placas && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Placas: <span className="font-mono font-semibold">{selectedEquipo.placas}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </FormItem>
                                        );
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Tarjeta de Mecánico */}
                        <Card className="overflow-hidden border-2">
                            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <CardTitle className="text-lg">Mecánico</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <FormField
                                    control={form.control}
                                    name="mecanicoId"
                                    render={({ field }) => {
                                        const selectedMecanico = mecanicos.find(m => m.id === field.value);

                                        return (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger disabled={isSubmiting} asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "justify-between h-11",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? (() => {
                                                                        const mecanico = mecanicos.find(m => m.id === field.value);
                                                                        return mecanico
                                                                            ? `${mecanico.nombre} ${mecanico.apellidos}`
                                                                            : "Selecciona un mecánico";
                                                                    })()
                                                                    : "Selecciona un mecánico"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[320px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Buscar mecánico..." />
                                                            <CommandList>
                                                                <CommandEmpty>No se encontró ningún mecánico.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {mecanicos.map((mecanico) => (
                                                                        <CommandItem
                                                                            value={`${mecanico.nombre} ${mecanico.apellidos}`}
                                                                            key={mecanico.id}
                                                                            onSelect={() => {
                                                                                form.setValue("mecanicoId", mecanico.id);
                                                                            }}
                                                                        >
                                                                            <div className="flex flex-col flex-1">
                                                                                <span className="font-medium">
                                                                                    {mecanico.nombre} {mecanico.apellidos}
                                                                                </span>
                                                                                {mecanico.email && (
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        {mecanico.email}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    mecanico.id === field.value
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

                                                {/* Información del mecánico seleccionado */}
                                                {selectedMecanico && (
                                                    <div className="mt-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                                                {selectedMecanico.nombre} {selectedMecanico.apellidos}
                                                            </span>
                                                            <Badge
                                                                variant={selectedMecanico.estado === 'DISPONIBLE' ? 'default' : 'secondary'}
                                                                className="text-xs"
                                                            >
                                                                {selectedMecanico.estado}
                                                            </Badge>
                                                        </div>
                                                        {selectedMecanico.email && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Mail className="h-3 w-3" />
                                                                <span className="truncate">{selectedMecanico.email}</span>
                                                            </div>
                                                        )}
                                                        {selectedMecanico.telefono && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Phone className="h-3 w-3" />
                                                                <span>{selectedMecanico.telefono}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </FormItem>
                                        );
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Campos adicionales de fecha y kilometraje */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
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
                        <DatePickerForm<MantenimientoSchemaType>
                            label="Proximo mantenimiento"
                            name="fechaProximo"
                            disabled={isSubmiting}
                        />

                        <FormField
                            control={form.control}
                            name="proximoKm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Próximo Km</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Kilometraje próximo mantenimiento"
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