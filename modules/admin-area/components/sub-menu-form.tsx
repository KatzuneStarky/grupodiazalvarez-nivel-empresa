"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createAreaSubMenu } from "@/modules/menus/actions/write"
import { SubMenu } from "@/modules/menus/types/menu-sistema"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { SubMenuSchema } from "../schema/sub-menu.schema"
import { useEmpresa } from "@/context/empresa-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { ICONS } from "../constants/menu-icons"
import { RolUsuario } from "@/enum/user-roles"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Icon from "@/components/global/icon"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { z } from "zod"

const SubMenuForm = ({
    menuId,
    menuTitle,
    subMenuId
}: {
    menuId: string,
    menuTitle: string,
    subMenuId?: string
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [subMenu, setSubMenu] = useState<SubMenu | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { empresa } = useEmpresa()
    const { area } = useArea()
    const router = useRouter();

    const form = useForm<z.infer<typeof SubMenuSchema>>({
        resolver: zodResolver(SubMenuSchema),
        defaultValues: {
            allowedRoles: [],
            areaId: area?.id,
            icon: "",
            link: "",
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof SubMenuSchema>) => {
        try {
            setIsSubmitting(true)

            toast.promise(createAreaSubMenu(empresa?.id ?? "", area?.id ?? "", menuId, {
                areaId: area?.id ?? "",
                path: values.link,
                title: values.name,
                visible: true,
                icon: values.icon,
                menuId,
                rolesAllowed: values.allowedRoles as RolUsuario[],
            }), {
                loading: "Creando submenu favor de esperar...",
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error.message || "Error al registrar el submenu.";
                },
            })

            form.reset()
            router.refresh()
        } catch (error) {
            console.log("Error al crear el submenu", error);
            toast.error("Error al crear el submenu", {
                description: `${error}`
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const name = form.watch("name")
    useEffect(() => {
        if (name) {
            form.setValue('link', `/${empresa?.nombre}/${area?.nombre}/${menuTitle}/${name}`);
        } else {
            form.setValue('link', `/${empresa?.nombre}/${area?.nombre}/${menuTitle}`);
        }
    }, [name, empresa?.nombre, area?.nombre, menuTitle, form.setValue]);

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {loading && subMenuId && (
                    <Alert className="my-4">
                        <Icon iconName="line-md:loading-twotone-loop" />
                        <AlertTitle className="text-center">
                            Se estan cargando los datos
                        </AlertTitle>
                    </Alert>
                )}
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

                <Button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-red-500
                                            text-white w-48 py-4 rounded-lg hover:bg-[#991d27] 
                                            transition-all duration-300 ease-in-out flex items-center 
                                            justify-center focus:shadow-outline focus:outline-none"
                    disabled={isSubmitting}
                >
                    {subMenu ? "Actualizar SubMenu" : "Crear SubMenu"}
                </Button>
            </form>
        </Form>
    )
}

export default SubMenuForm