"use client"

import { format, getMonth, getYear, setMonth as setDateMonth, setYear as setDateYear } from "date-fns"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { CustomDatePickerProps } from "@/types/custom-date-picker"
import { FieldValues, useFormContext } from "react-hook-form"
import { useState, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
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

export const DatePickerForm = <T extends FieldValues>({
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()) + 100,
    label,
    name,
    disabled,
    className,
    defaultToNow
}: CustomDatePickerProps<T>) => {
    const { control, setValue, getValues } = useFormContext<T>();

    const [month, setMonth] = useState<Date>(new Date())

    const months = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => {
            const date = new Date(new Date().getFullYear(), i, 15);
            const monthName = format(date, 'MMMM', { locale: es });
            return monthName.charAt(0).toUpperCase() + monthName.slice(1);
        });
    }, []);

    const years = useMemo(() => {
        return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    }, [startYear, endYear]);

    useEffect(() => {
        if (defaultToNow) {
            const currentValue = getValues(name);
            if (!currentValue) {
                setValue(name, new Date() as any, { shouldValidate: true });
            }
        }
    }, [defaultToNow, getValues, name, setValue])

    const handleMonthChange = (monthName: string) => {
        const monthIndex = months.indexOf(monthName);
        if (monthIndex !== -1) {
            const newDate = setDateMonth(month, monthIndex)
            setMonth(newDate)
        }
    }

    const handleYearChange = (year: string) => {
        const newDate = setDateYear(month, parseInt(year))
        setMonth(newDate)
    }

    const handleSelectToday = (onChange: (date: Date) => void) => {
        const today = new Date();
        onChange(today);
        setMonth(today);
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const selectedDate = field.value as Date | undefined;

                return (
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
                                        className={cn(
                                            "flex items-center gap-2 cursor-pointer w-full justify-start text-left font-normal",
                                            !selectedDate && "text-muted-foreground",
                                            className
                                        )}
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col items-center justify-center w-full p-4" align="start">
                                <div className="flex gap-2 mb-4 w-full">
                                    <Select onValueChange={handleMonthChange} value={months[getMonth(month)]}>
                                        <SelectTrigger className="w-[140px] cursor-pointer capitalize">
                                            <SelectValue placeholder="Mes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={handleYearChange} value={getYear(month).toString()}>
                                        <SelectTrigger className="w-[100px] cursor-pointer">
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
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        if (date) {
                                            field.onChange(date);
                                        }
                                    }}
                                    month={month}
                                    onMonthChange={setMonth}
                                    className="border rounded-md"
                                    locale={es}
                                />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full mt-2 text-primary font-medium hover:text-primary/90 hover:bg-primary/10"
                                    onClick={() => handleSelectToday(field.onChange)}
                                >
                                    Ir a Hoy
                                </Button>
                            </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500" />
                    </FormItem>
                )
            }}
        />
    )
}