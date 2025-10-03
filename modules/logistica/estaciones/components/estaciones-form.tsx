"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EstacionDeServicioType } from "../schemas/estacion-servicio.schema"
import { DatePickerForm } from "@/components/custom/date-picker-form"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { useRegionData } from "@/hooks/use-region-data"
import MapPicker from "@/components/custom/map-picker"
import { Separator } from "@/components/ui/separator"
import { Contact, Plus, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"

interface EstacionesFormProps {
    isSubmiting: boolean
    form: UseFormReturn<EstacionDeServicioType>
    submitButton: React.ReactNode
    onSubmit: (data: EstacionDeServicioType) => void
}

const EstacionesForm = ({
    isSubmiting,
    form,
    submitButton,
    onSubmit
}: EstacionesFormProps) => {
    const { estados, municipios, setSelectedEstadoId } = useRegionData()

    const { append, fields, remove } = useFieldArray({
        control: form.control,
        name: "tanques",
        rules: {
            required: "Debe agregar al menos un tanque"
        }
    })

    const { append: appendContacto, fields: fieldsContactos, remove: removeContacto } = useFieldArray({
        control: form.control,
        name: "contacto",
        rules: {
            required: "Debe agregar al menos un contacto"
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("❌ Errores de validación", errors);
            })}>
                <h3 className="text-xl text-muted-foreground mt-4">Datos generales</h3>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-4">
                    <FormField
                        control={form.control}
                        name="razonSocial"
                        render={({ field }) => (
                            <FormItem className="w-full col-span-2">
                                <FormLabel className="text-sm font-medium">
                                    Razón social
                                </FormLabel>
                                <FormControl>
                                    <Input
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
                        name="nombre"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Nombre corto
                                </FormLabel>
                                <FormControl>
                                    <Input
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
                        name="rfc"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    RFC
                                </FormLabel>
                                <FormControl>
                                    <Input
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
                        name="numeroPermisoCRE"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Número de permiso CRE
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-10"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DatePickerForm<EstacionDeServicioType>
                        label="Fecha de registro"
                        name="fechaRegistro"
                        disabled={isSubmiting}
                    />

                    <div className="col-span-4">
                        <FormField
                            control={form.control}
                            name="horarios"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Horario
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="h-32 resize-none"
                                            placeholder="Ej. Lunes a Viernes: 8:00 AM - 6:00 PM (separa con coma cada dia)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-end w-full col-span-2">
                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="w-96 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Estación activa?</FormLabel>
                                        <FormDescription>
                                            Marque esta opcion si la estación se encuentra activa.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                    </div>
                </div>
                <Separator className="mt-8" />
                <div className="flex items-center justify-between mt-4">
                    <h3 className="text-xl text-muted-foreground">Informacion de tanques</h3>
                    <Button
                        onClick={() => append({
                            capacidadActual: 0,
                            capacidadTotal: 0,
                            fechaUltimaRecarga: new Date(),
                            numeroTanque: "",
                            tipoCombustible: "Magna"
                        })}
                        type="button"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo tanque
                    </Button>
                </div>
                {fields.length === 0 ? (
                    <div className="space-y-2">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                            <Icon iconName="mdi:storage-tank" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay tanques agregados</p>
                            <p className="text-sm">Haga clic en "Nuevo Tanque" para comenzar</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-4 space-y-4">
                        {fields.map((field, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon iconName="mdi:storage-tank" className="h-4 w-4" />
                                            Tanque ({index + 1})
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
                                <CardContent className="grid grid-cols-5 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`tanques.${index}.tipoCombustible`}
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel>Tipo de combustible</FormLabel>
                                                <Select
                                                    onValueChange={(value) => { field.onChange(value) }}
                                                    defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={"Selecciona un tipo de combustible"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="z-[999]">
                                                        <SelectItem value="Magna">
                                                            Magna
                                                        </SelectItem>
                                                        <SelectItem value="Premium">
                                                            Premium
                                                        </SelectItem>
                                                        <SelectItem value="Diesel">
                                                            Diesel
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`tanques.${index}.capacidadActual`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Capacidad Actual
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
                                        name={`tanques.${index}.capacidadTotal`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Capacidad Total
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
                                        name={`tanques.${index}.numeroTanque`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Numero de Tanque
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="h-10"
                                                        placeholder="Ej. 1 o Numero de serie"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <DatePickerForm<EstacionDeServicioType>
                                        label="Fecha de ultima recarga"
                                        name={`tanques.${index}.fechaUltimaRecarga`}
                                        disabled={isSubmiting}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                <Separator className="mt-8" />
                <div className="flex items-center justify-between mt-4">
                    <h3 className="text-xl text-muted-foreground">Encargados de la estacion</h3>
                    <Button
                        onClick={() => appendContacto({
                            email: "",
                            responsable: "",
                            cargo: "Gerente",
                            telefono: ""
                        })}
                        type="button"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo contacto
                    </Button>
                </div>
                {fieldsContactos.length === 0 ? (
                    <div className="space-y-2">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                            <Icon iconName="mdi:storage-tank" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay contactos agregados</p>
                            <p className="text-sm">Haga clic en "Nuevo Contacto" para comenzar</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 space-y-4">
                        {fieldsContactos.map((field, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Contact className="h-4 w-4" />
                                            Nuevo contacto ({index + 1})
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
                                <CardContent className="space-y-4 grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`contacto.${index}.responsable`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Nombre del responsable
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
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
                                        name={`contacto.${index}.email`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
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
                                        name={`contacto.${index}.telefono`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Telefono
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
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
                                        name={`contacto.${index}.cargo`}
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel>Cargo del contacto</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue
                                                                placeholder={field.value ? field.value : "Seleccione el cargo"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="z-[999]">
                                                        <SelectItem value={"Gerente"}>
                                                            Gerente
                                                        </SelectItem>
                                                        <SelectItem value={"Encargado"}>
                                                            Encargado
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                <Separator className="mt-8" />
                <h3 className="text-xl text-muted-foreground mt-4">Informacion de direccion</h3>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4 place-items-end">
                    <FormField
                        control={form.control}
                        name="direccion.pais"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Pais
                                </FormLabel>
                                <FormControl>
                                    <Input
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
                        name="direccion.estado"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        const estadoSeleccionado = estados.find((e) => e.name === value)
                                        if (estadoSeleccionado) {
                                            setSelectedEstadoId(estadoSeleccionado.id)
                                        }
                                    }}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={"Selecciona un estado"}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-[999]">
                                        {estados.map((estado, index) => (
                                            <SelectItem
                                                value={estado.name}
                                                key={estado.id}
                                            >
                                                {estado.name}
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
                        name="direccion.ciudad"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Municipio</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={"Selecciona un municipio"}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-[999]">
                                        {municipios.map((municipio, index) => (
                                            <SelectItem
                                                value={municipio.name}
                                                key={municipio.id}
                                            >
                                                {municipio.name}
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
                        name="direccion.calle"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Calle
                                </FormLabel>
                                <FormControl>
                                    <Input
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
                        name="direccion.colonia"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Colonia
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-10"
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
                            name="direccion.numeroExterior"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        No. Exterior
                                    </FormLabel>
                                    <FormControl>
                                        <Input
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
                            name="direccion.numeroInterior"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        No. Interior
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="direccion.codigoPostal"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Codigo Postal
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-10"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator className="mt-8" />
                <h3 className="text-xl text-muted-foreground mt-4">Informacion de ubicacion</h3>
                <div className="grid grid-cols-6 gap-4 mt-4">
                    <div className="col-span-1 flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="ubicacion.lat"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Latitud
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            type="number"
                                            disabled
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ubicacion.lng"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Longitud
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            type="number"
                                            disabled
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mapa</CardTitle>
                                <CardDescription>
                                    Selecciona la ubicacion de la estacion en el mapa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MapPicker />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Separator className="mt-8 mb-4" />
                {submitButton}
            </form>
        </Form>
    )
}

export default EstacionesForm