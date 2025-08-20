"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { format, getMonth, getYear, setMonth, setYear } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { meses } from '@/constants/meses'
import { Calendar } from '../ui/calendar'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { es } from 'date-fns/locale'

interface ChartDatePickerProps {
    startDate: Date | undefined
    endDate: Date | undefined
    startYear?: number
    endYear?: number
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

const ChartDatePicker = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()) + 100,
}: ChartDatePickerProps) => {
    const [visibleMonth, setVisibleMonth] = useState<Date>(startDate ?? new Date())
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    const handleSelect = (date: Date | undefined, type: "start" | "end") => {
        if (!date) return
        if (type === "start") setStartDate(date)
        if (type === "end") setEndDate(date)
    }

    const handleMonthChange = (month: string) => {
        setVisibleMonth(setMonth(visibleMonth, meses.indexOf(month)))
    }

    const handleYearChange = (year: string) => {
        setVisibleMonth(setYear(visibleMonth, parseInt(year)))
    }

    return (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="capitalize w-full truncate flex justify-start px-3 text-xs"
                        aria-label="Seleccionar fecha inicial"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {startDate ? format(startDate, "PPP", { locale: es }) : "Fecha inicial"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col items-center justify-center w-auto max-w-[95vw] p-4">
                    <div className="w-full p-4 grid grid-cols-2 gap-4">
                        <Select onValueChange={handleMonthChange} value={meses[getMonth(visibleMonth)]}>
                            <SelectTrigger className="w-[120px] cursor-pointer">
                                <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {meses.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleYearChange} value={getYear(visibleMonth).toString()}>
                            <SelectTrigger className="w-[100px] cursor-pointer">
                                <SelectValue placeholder="Año" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(d) => handleSelect(d, "start")}
                        month={visibleMonth}
                        onMonthChange={setVisibleMonth}
                        initialFocus
                        locale={es}
                        className="border-2 capitalize"
                        disabled={(date) => !!endDate && date > endDate}
                    />
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="capitalize w-full truncate flex justify-start px-3 text-xs"
                        aria-label="Seleccionar fecha final"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {endDate ? format(endDate, "PPP", { locale: es }) : "Fecha final"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col items-center justify-center w-auto max-w-[95vw] p-4" align="center">
                    <div className="w-full p-4 grid grid-cols-2 gap-4">
                        <Select onValueChange={handleMonthChange} value={meses[getMonth(visibleMonth)]}>
                            <SelectTrigger className="w-[120px] cursor-pointer">
                                <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {meses.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleYearChange} value={getYear(visibleMonth).toString()}>
                            <SelectTrigger className="w-[100px] cursor-pointer">
                                <SelectValue placeholder="Año" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(d) => handleSelect(d, "end")}
                        month={visibleMonth}
                        onMonthChange={setVisibleMonth}
                        initialFocus
                        locale={es}
                        className="border-2 capitalize"
                        disabled={(date) => !!startDate && date < startDate}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ChartDatePicker