"use client"

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DescripcionOption {
    value: string;
    label: string;
    cliente?: string;
}

interface ComboboxProps {
    options: DescripcionOption[];
    value: string;
    onChange: (value: string) => void;
    disabledOptions?: string[];
}

export function ComboboxFiltro({ options, value, onChange, disabledOptions = [] }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between col-span-2"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : "Seleccionar ruta..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar la ruta..." />
                    <CommandList>
                        <CommandEmpty>No se encontraron rutas.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        if (disabledOptions.includes(option.value)) return;
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex justify-between",
                                        disabledOptions.includes(option.value) && "opacity-50 line-through cursor-not-allowed"
                                    )}
                                >
                                    {option.label}
                                    {option.cliente && (
                                        <span className="text-xs text-gray-500 ml-2">({option.cliente})</span>
                                    )}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}