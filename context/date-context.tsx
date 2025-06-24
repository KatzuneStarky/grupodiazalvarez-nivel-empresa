"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

interface DateContextType {
    date: Date
    formattedDate: string
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [date, setDate] = useState<Date>(new Date())

    const formattedDate = useMemo(() => {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }, [date])

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date())
        }, 1000 * 60)

        return () => clearInterval(interval)
    }, [])

    const value = useMemo(() => ({
        date,
        formattedDate
    }), [date, formattedDate])

    return (
        <DateContext.Provider value={{ date, formattedDate }}>
            {children}
        </DateContext.Provider>
    )
}

export const useDate = () => {
    const context = useContext(DateContext)
    if (!context) {
        throw new Error("useDate must be used within a DateProvider")
    }
    return context
}