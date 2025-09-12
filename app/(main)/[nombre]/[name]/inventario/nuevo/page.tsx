"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { InventarioSchema, InventarioSchemaType } from "@/modules/mantenimiento/inventario/schema/inventario.schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CheckCircle2, CheckIcon, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { writeInventario } from "@/modules/mantenimiento/inventario/actions/write"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { useCatalogosSAT } from "@/hooks/use-catalogos-sat"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const NuevoInventarioPage = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { productos, unidades, query, setQuery, loading, error } = useCatalogosSAT()

    const form = useForm<InventarioSchemaType>({
        resolver: zodResolver(InventarioSchema),
        defaultValues: {
            fechaActualizacion: new Date(),
            nombre: "",
            ubicacion: "",
            productos: []
        }
    })

    const onSubmit = async (data: InventarioSchemaType) => {
        try {
            setIsSubmitting(true)

            toast.promise(writeInventario({
                nombre: data.nombre,
                fechaActualizacion: data.fechaActualizacion,
                ubicacion: data.ubicacion || "",
                productos: data.productos.map((producto) => ({
                    cantidad: producto.cantidad,
                    productoSAT: {
                        description: producto.productoSAT.description,
                        key: producto.productoSAT.key,
                        score: 0
                    },
                    unidad: {
                        description: producto.unidad.description,
                        key: producto.unidad.key,
                        score: 0
                    },
                    maximo: producto.maximo,
                    fechaUltimaEntrada: producto.fechaUltimaEntrada,
                    fechaUltimaSalida: producto.fechaUltimaSalida,
                    minimo: producto.minimo,
                    notas: producto.notas || "",
                    id: "",
                    inventarioId: ""
                }))
            }), {
                loading: "Creando registro de inventario, favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el inventario.";
                },
                finally: () => {
                    setIsSubmitting(false)
                }
            })

            form.reset()
        } catch (error) {
            console.log(error);
            toast.error("Se ha producido un error al guardar el inventario", {
                description: error as string
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const { append, fields, remove } = useFieldArray({
        control: form.control,
        name: "productos",
        rules: {
            required: "Debe agregar al menos un producto"
        }
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon iconName="mingcute:inventory-fill" className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Nuevo registro de estación</h1>
                            <p className="text-muted-foreground">
                                Ingrese la información necesaria para generar el nuevo registro de una nueva estación.
                            </p>
                        </div>
                    </div>
                    <Separator className="mt-4" />
                    <h3 className="text-xl text-muted-foreground mt-4">Datos del inventario</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 max-w-3xl gap-4 mt-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Nombre estante/inventario
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            placeholder="Ingrese el nombre del estante/inventario"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ubicacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Ubicación estante/inventario
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            placeholder="Ej. Estante 1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DatePickerForm<InventarioSchemaType>
                            label="Fecha de actualización"
                            name="fechaActualizacion"
                            disabled={isSubmitting}
                        />
                    </div>
                    <Separator className="mt-8" />
                    <div className="flex items-center justify-between mt-4">
                        <h3 className="text-xl text-muted-foreground">Informacion de los productos</h3>
                        <Button
                            onClick={() => append({
                                cantidad: 0,
                                fechaUltimaEntrada: new Date(),
                                fechaUltimaSalida: new Date(),
                                maximo: 0,
                                minimo: 0,
                                notas: "",
                                productoSAT: {
                                    description: "",
                                    key: "",
                                    score: 0
                                },
                                unidad: {
                                    description: "",
                                    key: "",
                                    score: 0
                                }
                            })}
                            type="button"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo producto
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4 mt-4 space-y-4">
                        {fields.length === 0 ? (
                            <div className="space-y-2">
                                <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                                    <Icon iconName="ix:product" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No hay productos agregados</p>
                                    <p className="text-sm">Haga clic en "Nuevo Producto" para comenzar</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-4">
                                {fields.map((field, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Icon iconName="fluent-mdl2:product-variant" className="h-4 w-4" />
                                                    Producto ({index + 1})
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`productos.${index}.productoSAT`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Producto SAT</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                "justify-between",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                <span className="truncate">
                                                                                    <b>{field.value.key}</b> - {field.value.description}
                                                                                </span>
                                                                            ) : (
                                                                                "Selecciona producto"
                                                                            )}
                                                                            <ChevronsUpDown className="opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-2">
                                                                    <Command>
                                                                        <div className="gap-2 items-center">
                                                                            <CommandInput
                                                                                placeholder="Buscar producto SAT..."
                                                                                className="h-9 flex-1"
                                                                                value={query}
                                                                                onValueChange={setQuery}
                                                                            />
                                                                        </div>
                                                                        <CommandList>
                                                                            {loading ? (
                                                                                <CommandEmpty>Buscando...</CommandEmpty>
                                                                            ) : error ? (
                                                                                <CommandEmpty>{error}</CommandEmpty>
                                                                            ) : productos.length === 0 ? (
                                                                                <CommandEmpty>No se encontraron productos</CommandEmpty>
                                                                            ) : (
                                                                                <CommandGroup>
                                                                                    {productos.map((p) => (
                                                                                        <CommandItem
                                                                                            key={p.key}
                                                                                            value={`${p.key} ${p.description}`}
                                                                                            onSelect={() => {
                                                                                                field.onChange({
                                                                                                    ...p,
                                                                                                    score: p.score ?? 0,
                                                                                                })
                                                                                                setQuery("")
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex flex-col">
                                                                                                <span className="font-medium">{p.key}</span>
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    {p.description}
                                                                                                </span>
                                                                                            </div>
                                                                                            <CheckIcon
                                                                                                className={cn(
                                                                                                    "ml-auto",
                                                                                                    p.key === field.value?.key
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </CommandItem>
                                                                                    ))}
                                                                                </CommandGroup>
                                                                            )}
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
                                                    name={`productos.${index}.unidad`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Unidad SAT</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            className={cn(
                                                                                "justify-between",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                <span className="truncate">
                                                                                    <b>{field.value.key}</b> - {field.value.description}
                                                                                </span>
                                                                            ) : (
                                                                                "Selecciona unidad"
                                                                            )}
                                                                            <ChevronsUpDown className="opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-2">
                                                                    <Command>
                                                                        <div className="gap-2 items-center">
                                                                            <CommandInput
                                                                                placeholder="Buscar unidad SAT..."
                                                                                className="h-9"
                                                                                value={query}
                                                                                onValueChange={setQuery}
                                                                            />
                                                                        </div>
                                                                        <CommandList>
                                                                            {loading ? (
                                                                                <CommandEmpty>Buscando...</CommandEmpty>
                                                                            ) : error ? (
                                                                                <CommandEmpty>{error}</CommandEmpty>
                                                                            ) : unidades.length === 0 ? (
                                                                                <CommandEmpty>No se encontraron unidades</CommandEmpty>
                                                                            ) : (
                                                                                <CommandGroup>
                                                                                    {unidades.map((p) => (
                                                                                        <CommandItem
                                                                                            key={p.key}
                                                                                            value={`${p.key} ${p.description}`}
                                                                                            onSelect={() => {
                                                                                                field.onChange({
                                                                                                    ...p,
                                                                                                    score: p.score ?? 0,
                                                                                                })
                                                                                                setQuery("")
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex flex-col">
                                                                                                <span className="font-medium">{p.key}</span>
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    {p.description}
                                                                                                </span>
                                                                                            </div>
                                                                                            <CheckIcon
                                                                                                className={cn(
                                                                                                    "ml-auto",
                                                                                                    p.key === field.value?.key
                                                                                                        ? "opacity-100"
                                                                                                        : "opacity-0"
                                                                                                )}
                                                                                            />
                                                                                        </CommandItem>
                                                                                    ))}
                                                                                </CommandGroup>
                                                                            )}
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`productos.${index}.cantidad`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium">
                                                                Cantidad actual del producto
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className="h-10"
                                                                    placeholder="Ingrese la cantidad"
                                                                    type="number"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`productos.${index}.minimo`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-sm font-medium">
                                                                    Cant. minima
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="h-10"
                                                                        type="number"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`productos.${index}.maximo`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-sm font-medium">
                                                                    Cant. maxima
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="h-10"
                                                                        type="number"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <DatePickerForm<InventarioSchemaType>
                                                    label="Fecha de última entrada"
                                                    name={`productos.${index}.fechaUltimaEntrada`}
                                                    disabled={isSubmitting}
                                                />

                                                <DatePickerForm<InventarioSchemaType>
                                                    label="Fecha de última salida"
                                                    name={`productos.${index}.fechaUltimaSalida`}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name={`productos.${index}.notas`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                                            Notas del producto
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                className="h-32 resize-none"
                                                                placeholder="Ejemplo: El producto X es para..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                    <Separator className="mt-8 mb-4" />
                    <div className="flex items-center justify-end w-full">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando inventario...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Guardar inventario
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NuevoInventarioPage