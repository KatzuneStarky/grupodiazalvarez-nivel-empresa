"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { OperadoresSchemaType } from "../schemas/operadores.schema"
import UploadImage from "@/components/custom/upload-image-firebase"
import { TipoLicencia } from "../constants/tipo-licencia"
import { TipoSangre } from "../constants/tipo-sangre"
import { Separator } from "@/components/ui/separator"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Emisor } from "../constants/emisor"
import { Button } from "@/components/ui/button"
import { Contact, Contact2, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { relacionContactoMap } from "../../bdd/operadores/types/operadores"

interface OperadorFormProps {
    onSubmit: (data: OperadoresSchemaType) => void
    isSubmiting: boolean
    form: UseFormReturn<OperadoresSchemaType>
    submitButton: React.ReactNode
    photoUid: string | null
    handleImageUpload: (value: string) => void
    imageUrl: string
    useCamera: boolean
    showFileInfo: boolean
    operadorId?: string | null
}

const OperadorForm = ({
    onSubmit,
    isSubmiting,
    form,
    submitButton,
    photoUid,
    handleImageUpload,
    imageUrl,
    useCamera,
    showFileInfo,
    operadorId
}: OperadorFormProps) => {
    const nombres = form.watch("nombres")
    const apellidos = form.watch("apellidos")
    const nombreCompleto = `${nombres} ${apellidos}`

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "contactosEmergencia"
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                <h3 className="text-xl text-muted-foreground mt-4">Datos personales</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-6">
                        <UploadImage
                            path={`/empleados/${nombreCompleto.replace(/\s+/g, "")}`}
                            id={operadorId || "" || photoUid || ""}
                            image={imageUrl}
                            onImageUpload={handleImageUpload}
                            uploadText="Subir imagen"
                            uploadSubtext="JPG, PNG or WebP (max 5MB)"
                            maxFileSize={5 * 1024 * 1024}
                            showFileName={true}
                            showFileInfo={showFileInfo}
                            useCamera={useCamera}
                            showFileTypeIcon={true}
                        />

                        {imageUrl && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium dark:text-gray-800">Url de la imagen en base de datos:</p>
                                <p className="text-xs text-gray-700 break-all mt-1">{imageUrl}</p>
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="grid grid-rows-2 gap-8">
                            <FormField
                                control={form.control}
                                name="nombres"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">Nombre(s)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre(s)..." className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="apellidos"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">Apellido(s)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Apellido(s)..." className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 mt-4 w-full">
                    <div>
                        <FormField
                            control={form.control}
                            name="telefono"
                            render={({ field }) => (
                                <FormItem className="space-y-2 w-full">
                                    <FormLabel className="text-sm font-medium">Teléfono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(612) 123-4567" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" className="h-10" {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="nss"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">NSS</FormLabel>
                                    <FormControl>
                                        <Input placeholder="012345678901" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="curp"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">CURP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ABCDEFGH1234567890" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="ine"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">INE</FormLabel>
                                    <FormControl>
                                        <Input placeholder="012345678901234567" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="place-self-end justify-self-start">
                        <FormField
                            control={form.control}
                            name="tipoSangre"
                            render={({ field }) => (
                                <FormItem className="w-fit">
                                    <FormLabel>Tipo de sangre</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione tipo de sangre" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {TipoSangre.map((item, index) => (
                                                <SelectItem value={item.name} key={item.id}>
                                                    <div className='flex items-center'>
                                                        {item.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator className="mt-4" />
                <h3 className="text-xl text-muted-foreground mt-4">Informacion de domicilio</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6 gap-8 w-full mt-4">
                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="calle"
                            render={({ field }) => (
                                <FormItem className="space-y-2 w-full">
                                    <FormLabel className="text-sm font-medium">Calle</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Calle..." className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="colonia"
                            render={({ field }) => (
                                <FormItem className="space-y-2 w-full">
                                    <FormLabel className="text-sm font-medium">Colonia</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Colonia..." className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="externo"
                            render={({ field }) => (
                                <FormItem className="space-y-2 w-full">
                                    <FormLabel className="text-sm font-medium">Numero externo</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="123" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="cp"
                            render={({ field }) => (
                                <FormItem className="space-y-2 w-full">
                                    <FormLabel className="text-sm font-medium">Codigo postal</FormLabel>
                                    <FormControl>
                                        <Input placeholder="12345" type="number" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator className="mt-4" />
                <h3 className="text-xl text-muted-foreground mt-4">Informacion de licencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8 w-full mt-4">
                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="numLicencia"
                            render={({ field }) => (
                                <FormItem className="space-y-2 w-full">
                                    <FormLabel className="text-sm font-medium">Numero de licencia</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" className="h-10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="place-self-end justify-self-start">
                        <FormField
                            control={form.control}
                            name="tipoLicencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de licencia</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione tipo licencia" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {TipoLicencia.map((item, index) => (
                                                <SelectItem value={item.name} key={item.id}>
                                                    <div className='flex items-center'>
                                                        {item.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="place-self-end justify-self-start">
                        <FormField
                            control={form.control}
                            name="emisor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emisor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un emisor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Emisor.map((item, index) => (
                                                <SelectItem value={item.name} key={item.id}>
                                                    <div className='flex items-center'>
                                                        {item.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator className="mt-4" />
                <div className="flex items-center justify-between mt-4">
                    <h3 className="text-xl text-muted-foreground">Contactos de emergencia</h3>
                    <Button
                        onClick={() => append({
                            nombre: "",
                            telefono: "",
                            relacion: "",
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 space-y-4">
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
                                        name={`contactosEmergencia.${index}.nombre`}
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
                                        name={`contactosEmergencia.${index}.telefono`}
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

                                    <div className="place-self-end justify-self-start w-full">
                                        <FormField
                                            control={form.control}
                                            name={`contactosEmergencia.${index}.relacion`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Relacion del contacto</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder={field.value ? field.value: "Seleccione el parentesco"} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {relacionContactoMap.map((item) => (
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
                                    </div>
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

export default OperadorForm