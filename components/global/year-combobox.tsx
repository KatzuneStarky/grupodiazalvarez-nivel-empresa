"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { useYear } from "@/context/year-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear + 100 - 2024 + 1 }, (_, i) => 2024 + i)

const YearCombobox = () => {
    const { selectedYear, setSelectedYear } = useYear()
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-fit justify-between"
                >
                    {selectedYear !== null ? selectedYear : "Seleccione un año..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Seleccione un año..." />
                    <CommandList>
                        <CommandEmpty>No se encontró el año.</CommandEmpty>
                        <CommandGroup>
                            {years.map((year) => (
                                <CommandItem
                                    key={year}
                                    value={year.toString()}
                                    onSelect={(currentValue) => {
                                        const selected = parseInt(currentValue, 10)
                                        setSelectedYear(selected === selectedYear ? null : selected)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedYear === year ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {year}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default YearCombobox