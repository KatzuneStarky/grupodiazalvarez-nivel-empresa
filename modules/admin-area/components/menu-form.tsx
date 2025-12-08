"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createAreaMenu, updateMenuData } from "@/modules/menus/actions/write"
import { useMenusByArea } from "@/modules/menus/hooks/use-menus-by-area"
import { useIconifySearch } from "@/hooks/use-iconify-search"
import { AreaMenuSchema, AreaMenuType } from "../schema/menu.schema"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Menu } from "@/modules/menus/types/menu-sistema"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useArea } from "@/context/area-context"
import { Button } from "@/components/ui/button"
import { RolUsuario } from "@/enum/user-roles"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Icon from "@/components/global/icon"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
    const [search, setSearch] = useState<string>("")
    const { results, loading: iconLoading } = useIconifySearch(search)
    const router = useRouter()
    const { area } = useArea()
    const { menus, loading, empresa } = useMenusByArea(area?.id)

    const form = useForm<AreaMenuType>({
        resolver: zodResolver(AreaMenuSchema),
        defaultValues: {
            name: "",
            areaId: areaId,
            icon: "",
            link: "",
            allowedRoles: []
        },
    })

    const onSubmit = async (values: AreaMenuType) => {
        try {
            setIsSubmitting(true)

            const isEditing = !!menuId && !!menu

            if (isEditing) {
                toast.promise(updateMenuData(empresa?.id ?? "", area?.id ?? "", menuId, {
                    areaId: area?.id ?? "",
                    path: values.link,
                    title: values.name,
                    icon: values.icon,
                    rolesAllowed: values.allowedRoles as RolUsuario[],
                    subMenus: menu.subMenus || [],
                }), {
                    loading: "Actualizando menú, favor de esperar...",
                    success: (result) => {
                        if (result.success) {
                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => {
                        return error.message || "Error al actualizar el menu.";
                    },
                })
            } else {
                toast.promise(createAreaMenu(empresa?.id ?? "", area?.id ?? "", {
                    areaId: area?.id ?? "",
                    path: values.link,
                    title: values.name,
                    visible: true,
                    icon: values.icon,
                    rolesAllowed: values.allowedRoles as RolUsuario[],
                    subMenus: [],
                }), {
                    loading: "Creando menú favor de esperar...",
                    success: (result) => {
                        if (result.success) {
                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => {
                        return error.message || "Error al registrar el menu.";
                    },
                })

                form.reset()
            }

            router.refresh()
        } catch (error) {
            console.log("Error al procesar el menu", error);
            toast.error("Error al procesar el menu", {
                description: `${error}`
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (menuId && menus.length > 0) {
            const fetchedMenu = menus.find((menu) => menu.id === menuId) || null;

            if (fetchedMenu) {
                setMenu(fetchedMenu);
                form.reset({
                    name: fetchedMenu.title,
                    icon: fetchedMenu.icon,
                    link: fetchedMenu.path,
                    allowedRoles: fetchedMenu.rolesAllowed,
                    areaId: area?.id ?? "",
                });
            }
        }
    }, [menuId, menus, form, area?.id]);

    const name = form.watch("name")
    useEffect(() => {
        if (name) {
            form.setValue('link', `/${empresaName}/${area?.nombre}/${name}`);
        } else {
            form.setValue('link', `/${empresaName}/${area?.nombre}`);
        }
    }, [name, empresaName, area?.nombre, form]);

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {loading && menuId && (
                    <Alert className="my-4">
                        <Icon iconName="line-md:loading-twotone-loop" />
                        <AlertTitle className="text-center">
                            Se estan cargando los datos
                        </AlertTitle>
                    </Alert>
                )}

                {!area?.nombre || !empresaName ? (
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
                            <span>Menu perteneciente a la empresa <b>{empresaName}</b> y al area <b>{area?.nombre}</b></span>
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
                                                {field.value ? (
                                                    <div className="flex items-center gap-2">
                                                        <Icon iconName={field.value} />
                                                        {field.value}
                                                    </div>
                                                ) : "Seleccionar icono"}
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
                                            {iconLoading && <div className="p-4 text-center text-sm">Cargando iconos...</div>}
                                            {!iconLoading && results.length === 0 && search && (
                                                <div className="p-4 text-center text-sm">No se encontraron iconos para &quot;{search}&quot;</div>
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
                                                                form.trigger("icon");
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
