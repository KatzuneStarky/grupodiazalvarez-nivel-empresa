"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GradientPicker } from "@/components/global/gradient-picker"
import { RolesSchemaType } from "../../schema/roles.schema"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

interface NewRolDialogProps {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: RolesSchemaType) => void
    form: UseFormReturn<RolesSchemaType>
    submitButton: React.ReactNode
    isSubmiting: boolean
    open: boolean
}

const NewRolDialog = ({
    open,
    onOpenChange,
    isSubmiting,
    form,
    submitButton,
    onSubmit
}: NewRolDialogProps) => {
    const [color, setColor] = useState<string>("#000000")

    useEffect(() => {
        form.setValue("color", color)
    }, [color])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Nuevo Rol</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h3 className="text-xl text-muted-foreground mt-4">Datos iniciales</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 col-span-2">
                                        <FormLabel className="text-sm font-medium">Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre..." className="h-10" disabled={isSubmiting} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tipo de rol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmiting}>
                                            <FormControl className="w-full h-full">
                                                <SelectTrigger className="w-full h-full">
                                                    <SelectValue placeholder="Seleccione tipo de rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="w-full h-full">
                                                <SelectItem value="Global">
                                                    <div className='flex items-center'>
                                                        Global
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Personalizado">
                                                    <div className='flex items-center'>
                                                        Personalizado
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-4">
                            <Label className="mb-3 block">Color</Label>
                            <GradientPicker
                                background={color}
                                setBackground={setColor}
                            />
                        </div>

                        <Separator className="mt-8 mb-4" />
                        <h3 className="text-xl text-muted-foreground mt-4">Permisos</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                            <FormField
                                control={form.control}
                                name="permisos.crear"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmiting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Crear
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="permisos.leer"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmiting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Leer
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="permisos.actualizar"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmiting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Actualizar
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="permisos.aprobar"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmiting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Aprobar
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="permisos.exportar"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmiting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Exportar
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="permisos.eliminar"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmiting}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Eliminar
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator className="mt-8 mb-4" />
                        {submitButton}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default NewRolDialog