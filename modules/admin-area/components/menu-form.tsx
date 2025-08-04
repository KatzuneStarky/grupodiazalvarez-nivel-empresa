"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Menu } from "@/modules/menus/types/menu-sistema"
import { areaMenuSchema } from "../schema/menu.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useArea } from "@/context/area-context"
import { ICONS } from "../constants/menu-icons"
import { Button } from "@/components/ui/button"
import { RolUsuario } from "@/enum/user-roles"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Icon from "@/components/global/icon"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { z } from "zod"

const CreateAreaMenuForm = ({
    areaId,
    empresaName,
    menuId
}: {
    areaId: string,
    menuId?: string,
    empresaName: string
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [menu, setMenu] = useState<Menu | null>(null)
    const router = useRouter();
    const { area } = useArea()

    const form = useForm<z.infer<typeof areaMenuSchema>>({
        resolver: zodResolver(areaMenuSchema),
        defaultValues: {
            name: "",
            areaId: areaId,
            icon: "",
            link: "",
            allowedRoles: []
        },
    })

    const onSubmit = async (values: z.infer<typeof areaMenuSchema>) => {
        try {
            setIsSubmitting(true)

            router.refresh()
        } catch (error) {
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (menuId) {
            const fetchMenu = async () => {
                //const fetchedMenu = await getMenuByAreaId(areaId, menuId);
                //setMenu(fetchedMenu);
                {/*form.reset({
                name: fetchedMenu.name,
                icon: fetchedMenu.icon,
                link: fetchedMenu.link,
                allowedRoles: fetchedMenu.allowedRoles,
                areaId: areaId,
            }); */}
            };
            fetchMenu();
        }
    }, [menuId, areaId, form]);

    const name = form.watch("name")
    useEffect(() => {
        if (name) {
            form.setValue('link', `/${empresaName}/${area?.nombre}/${name}`);
        } else {
            form.setValue('link', `/${empresaName}/${area?.nombre}`);
        }
    }, [name, empresaName, area?.nombre, form.setValue]);

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex items-center gap-4'>
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icono</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un icono" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {ICONS.map((icon, index) => (
                                            <SelectItem value={icon.name} key={index}>
                                                <div className='flex items-center'>
                                                    <Icon iconName={icon.name || ""} className="mr-2" />
                                                    {icon.name}
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

                <Button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-red-500
                                            text-white w-48 py-4 rounded-lg hover:bg-[#991d27] 
                                            transition-all duration-300 ease-in-out flex items-center 
                                            justify-center focus:shadow-outline focus:outline-none"
                    disabled={isSubmitting}
                >
                    {menu ? "Actualizar menu" : "Crear menu"}
                </Button>
            </form>
        </Form>
    )
}

export default CreateAreaMenuForm