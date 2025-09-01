"use client"

import { useEquipos } from "@/modules/logistica/bdd/equipos/hooks/use-equipos";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, File, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const ArchivosForm = ({ equipoId }: { equipoId?: string }) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { equipos } = useEquipos()

    const form = useForm({

    })

    const onSubmit = async () => {

    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    {equipoId ? null : (
                        <FormField
                            control={form.control}
                            name="equipoId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel>Equipo</FormLabel>
                                    <Popover>
                                        <PopoverTrigger disabled={isSubmitting} asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? equipos.find(
                                                            (equipo) => equipo.id === field.value
                                                        )?.numEconomico
                                                        : "Selecciona un equipo"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar equipo..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontró ningún equipo.</CommandEmpty>
                                                    <CommandGroup className="">
                                                        {equipos.map((equipo) => (
                                                            <CommandItem
                                                                value={equipo.numEconomico}
                                                                key={equipo.numEconomico}
                                                                onSelect={() => {
                                                                    form.setValue("equipoId", equipo.id);
                                                                }}
                                                            >
                                                                {equipo.numEconomico} - {equipo.marca} - {equipo.serie}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        equipo.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
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
                    )}

                    <div className="w-full py-9 bg-gray-50 dark:bg-black rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                        <div className="grid gap-1">
                            <Upload className="mx-auto" size={40} />
                            <h2 className="text-center text-gray-400 text-xs leading-4">PNG, JPG, XLSX o PDF, menores a 15MB</h2>
                        </div>
                        <div className="grid gap-2">
                            <h4 className="text-center text-gray-900 dark:text-gray-400 text-sm font-medium leading-snug">
                                Arrastra o suleta los archivos aquí, o
                            </h4>
                            <div className="flex items-center justify-center">
                                <label>
                                    <input
                                        type="file"
                                        hidden
                                        multiple                                        
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex w-52 h-9 px-2
                                    bg-red-600 rounded-full shadow text-white text-xs font-semibold 
                                    leading-4 items-center justify-center cursor-pointer 
                                    focus:outline-none">
                                        <File className="w-4 h-4 mr-2" />
                                        Escoge un archivo
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className={cn("flex items-center justify-center w-full", selectedFiles.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100")}
                        disabled={selectedFiles.length === 0 || isSubmitting}
                    >
                        <File size={20} />
                        Subir Archivos
                        <span className='mr-1'>
                            {selectedFiles.length === 0 ? "" : `(${selectedFiles.length})`}
                        </span>
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ArchivosForm