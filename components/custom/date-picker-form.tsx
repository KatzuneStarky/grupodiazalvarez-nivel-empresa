"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { CustomDatePickerProps } from "@/types/custom-date-picker"
import { FieldValues, useFormContext } from "react-hook-form"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DatePickerForm = <T extends FieldValues>({
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()) + 100,
    label,
    name,
    disabled,
    className
}: CustomDatePickerProps<T>) => {
    const { control, watch, setValue } = useFormContext<T>();
    const selected = watch(name);

    const [date, setDate] = useState<Date>(selected || new Date())
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    const handleMonthChange = (month: string) => {
        const newDate = setMonth(date, meses.indexOf(month))
        setDate(newDate)
    }

    const handleYearChange = (year: string) => {
        const newDate = setYear(date, parseInt(year))
        setDate(newDate)
    }

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            setValue(name, selectedDate as T[typeof name]);
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-col space-y-2", className)}>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        {label}
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl className="flex items-center justify-start">
                                <Button
                                    variant={"outline"}
                                    disabled={disabled}
                                    className={"text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 cursor-pointer"}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="flex flex-col items-center justify-center w-full" align="center">
                            <div className="w-full p-4 grid grid-cols-2 gap-4">
                                <Select onValueChange={handleMonthChange} value={meses[getMonth(date)]}>
                                    <SelectTrigger className="w-[180px] cursor-pointer">
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {meses.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
                                    <SelectTrigger className="w-[180px] cursor-pointer">
                                        <SelectValue placeholder="Año" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y} value={y.toString()}>
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleSelect}
                                month={date}
                                onMonthChange={setDate}
                                initialFocus
                                className="border-2 capitalize"
                                modifiersClassNames={{
                                    selected: "cursor-pointer bg-white text-black",
                                    disabled: "cursor-not-allowed opacity-50",
                                }}
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}