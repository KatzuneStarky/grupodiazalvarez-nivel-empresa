"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AreaMenuType } from "@/modules/admin-area/schema/menu.schema"
import { useIconifySearch } from "@/hooks/use-iconify-search"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { RolUsuario } from "@/enum/user-roles"
import { Input } from "@/components/ui/input"
import { Menu } from "../types/menu-sistema"
import Icon from "@/components/global/icon"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"


interface MenuFormProps {
    onSubmit: (data: AreaMenuType) => void
    form: UseFormReturn<AreaMenuType>
    submitButton: React.ReactNode
    isSubmitting: boolean
    empresaName: string
    empresaId: string
    areaName: string
    areaId: string
    menuId: string
    menuData?: Menu
}

const MenuForm = ({
    submitButton,
    isSubmitting,
    empresaName,
    empresaId,
    onSubmit,
    areaName,
    menuData,
    areaId,
    menuId,
    form,
}: MenuFormProps) => {
    const [search, setSearch] = useState<string>("");
    const { results, loading } = useIconifySearch(search);

    useEffect(() => {
        if (menuId && menuData) {
            form.setValue('name', menuData.title)
            form.setValue('link', menuData.path)
            form.setValue('icon', menuData.icon || "")
            form.setValue('allowedRoles', menuData.rolesAllowed || [])
        }
    }, [menuId, menuData, form])

    const name = form.watch("name")
    useEffect(() => {
        if (name) {
            form.setValue('link', `/${empresaName}/${areaName}/${name}`);
        } else {
            form.setValue('link', `/${empresaName}/${areaName}`);
        }
    }, [name, empresaName, areaName, form.setValue]);

    console.log(results);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {!areaName || !empresaName ? (
                    <Alert className="my-4">
                        <Icon iconName="line-md:menu-fold-right" />
                        <AlertTitle className="text-center">
                            <span>Antes de continuar, selecciona una empresa y un area</span>
                        </AlertTitle>
                    </Alert>
                ) : (
                    <Alert className="my-4">
                        <Icon iconName="line-md:menu-fold-right" />
                        <AlertTitle className="text-center">
                            <span>Menu perteneciente a la empresa <b>{empresaName}</b> y al area <b>{areaName}</b></span>
                        </AlertTitle>
                    </Alert>
                )}

                <div className='flex items-center gap-4'>
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel>Icono</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className="w-full justify-between">
                                                {field.value ? <div className="flex items-center gap-2">
                                                    <Icon iconName={field.value} />
                                                    {field.value}
                                                </div> : "Seleccionar icono"}
                                                <ChevronsUpDown className="ml-2 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Buscar icono..."
                                                onValueChange={(value) => setSearch(value)}
                                            />
                                            {loading && <div className="p-4 text-center text-sm">Cargando iconos...</div>}
                                            {!loading && results.length === 0 && search && (
                                                <div className="p-4 text-center text-sm">No se encontraron iconos para "{search}"</div>
                                            )}
                                            <CommandList>
                                                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                                                <CommandGroup className="max-h-64 overflow-y-auto">
                                                    {results.map((iconName) => (
                                                        <CommandItem
                                                            value={iconName}
                                                            key={iconName}
                                                            onSelect={() => {
                                                                form.setValue("icon", iconName);
                                                                form.trigger("icon"); // Trigger validation for the icon field
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Icon iconName={iconName} className="mr-2 h-4 w-4" />
                                                                {iconName}
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    iconName === field.value ? "opacity-100" : "opacity-0"
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

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombre para el menu</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
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
                    name="link"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Link del menu</FormLabel>
                            <FormControl>
                                <Input
                                    className="cursor-not-allowed"
                                    disabled
                                    readOnly
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="allowedRoles"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel>Roles</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" className="w-full justify-between">
                                            {field.value.length > 0
                                                ? `${field.value.length} rol(es) seleccionado(s)`
                                                : "Seleccionar roles"}
                                            <ChevronsUpDown className="ml-2 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Buscar roles..." />
                                        <CommandList>
                                            <CommandEmpty>No se encontraron roles.</CommandEmpty>
                                            <CommandGroup>
                                                {Object.values(RolUsuario).map((role) => {
                                                    const isSelected = field.value.includes(role);
                                                    return (
                                                        <CommandItem
                                                            key={role}
                                                            onSelect={() => {
                                                                if (isSelected) {
                                                                    field.onChange(
                                                                        field.value.filter((r) => r !== role)
                                                                    );
                                                                } else {
                                                                    field.onChange([...field.value, role]);
                                                                }
                                                            }}
                                                        >
                                                            {role}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    isSelected ? "opacity-100" : "opacity-0"
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

                <Separator className="my-4" />
                {submitButton}
            </form>
        </Form>
    )
}

export default MenuForm