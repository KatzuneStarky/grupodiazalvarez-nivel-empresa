"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ClienteSchemaType } from "@/modules/logistica/clientes/schemas/client.schema"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Contact, Contact2, Plus, Trash2 } from "lucide-react"
import { useRegionData } from "@/hooks/use-region-data"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/global/icon"

interface ClienteFormProps {
    onSubmit: (data: ClienteSchemaType) => void
    isSubmiting: boolean
    form: UseFormReturn<ClienteSchemaType>
    submitButton: React.ReactNode
}

const ClienteForm = ({
    onSubmit,
    isSubmiting,
    form,
    submitButton
}: ClienteFormProps) => {
    const { estados, municipios, setSelectedEstadoId } = useRegionData()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "contactos"
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <h3 className="text-xl text-muted-foreground mt-4">Datos personales</h3>
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mt-4 place-items-start">
                    <FormField
                        control={form.control}
                        name="nombreFiscal"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Nombre fiscal
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
                        name="nombreCorto"
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
                        name="curp"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    CURP
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
                        name="tipoCliente"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Tipo cliente
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled
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
                        name="grupo"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Grupo
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Icon iconName="mingcute:question-fill" className="w-4 h-4" />
                                        </TooltipTrigger>
                                        <TooltipContent className="text-sm">
                                            El cliente pertenece a un grupo? Si es asi agrega su nombre
                                        </TooltipContent>
                                    </Tooltip>
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
                        name="correo"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Correo electronico
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
                <h3 className="text-xl text-muted-foreground mt-4">Informacion de domicilio</h3>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4 place-items-start">
                    <FormField
                        control={form.control}
                        name="domicilio.pais"
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
                        name="domicilio.estado"
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
                                                placeholder={field.value ? field.value : "Selecciona un estado"}
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
                        name="domicilio.municipio"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Municipio</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={field.value ? field.value : "Selecciona un municipio"}
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
                        name="domicilio.localidad"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Localidad
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
                        name="domicilio.colonia"
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

                    <FormField
                        control={form.control}
                        name="domicilio.calle"
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

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="domicilio.exterior"
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
                            name="domicilio.interior"
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
                        name="domicilio.cp"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
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

                    <FormField
                        control={form.control}
                        name="domicilio.telefono"
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
                        name="domicilio.celular"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Celular
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
                <div className="flex items-center justify-between mt-4">
                    <h3 className="text-xl text-muted-foreground">Contactos del cliente</h3>
                    <Button
                        onClick={() => append({
                            email: "",
                            nombre: "",
                            telefono: ""
                        })}
                        type="button"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo contacto
                    </Button>
                </div>
                {fields.length === 0 ? (
                    <div className="space-y-2">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-200">
                            <Contact2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay contactos agregados</p>
                            <p className="text-sm">Haga clic en "Nuevo Contacto" para comenzar</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 space-y-4">
                        {fields.map((field, index) => (
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
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name={`contactos.${index}.nombre`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="text-sm font-medium">
                                                    Nombre
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
                                        name={`contactos.${index}.email`}
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
                                        name={`contactos.${index}.telefono`}
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                <Separator className="mt-8 mb-4" />
                {submitButton}
            </form>
        </Form>
    )
}

export default ClienteForm