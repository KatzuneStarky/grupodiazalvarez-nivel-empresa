"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MecanicoSchemaType } from "../schemas/mecanico.schema"
import { Separator } from "@/components/ui/separator"
import { UseFormReturn } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { Mecanico } from "../../types/mecanico"
import { Input } from "@/components/ui/input"
import React from "react"

interface MechanicFormProps {
    onSubmit: (data: MecanicoSchemaType) => void
    form: UseFormReturn<MecanicoSchemaType>
    submitButton: React.ReactNode
    isSubmitting: boolean
    mecanico?: Mecanico
}

const MechanicForm = ({ form, onSubmit, submitButton, isSubmitting, mecanico }: MechanicFormProps) => {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Nombre(s)
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
                        name="apellido"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-sm font-medium">
                                    Apellido(s)
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="telefono"
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
                        name="email"
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

                {mecanico && (mecanico.estado || mecanico.activo) && (
                    <div>
                        <FormField
                            control={form.control}
                            name="estado"
                            render={({ field }) => (
                                <FormItem className='w-72'>
                                    <FormLabel>Estado</FormLabel>
                                    <Select
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={field.value ? field.value : "Selecciona un estado"}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[999]">
                                            <SelectItem
                                                value={"DISPONIBLE"}
                                            >
                                                DISPONIBLE
                                            </SelectItem>
                                            <SelectItem
                                                value={"OCUPADO"}
                                            >
                                                OCUPADO
                                            </SelectItem>
                                            <SelectItem
                                                value={"INACTIVO"}
                                            >
                                                INACTIVO
                                            </SelectItem>
                                            <SelectItem
                                                value={"FUERA_TALLER"}
                                            >
                                                FUERA TALLER
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem className="w-72 flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Activo
                                        </FormLabel>
                                        <FormDescription>
                                            El mecanico esta activo?
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
                )}

                <Separator className="space-y-4" />
                {submitButton}
            </form>
        </Form>
    )
}

export default MechanicForm