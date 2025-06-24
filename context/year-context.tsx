"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface YearContextType {
    selectedYear: number | null
    setSelectedYear: (year: number | null) => void
}

const YearContext = createContext<YearContextType | undefined>(undefined)

export const YearProvider = ({ children }: { children: ReactNode }) => {
    const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear())

    return (
        <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
            {children}
        </YearContext.Provider>
    )
}

export const useYear = () => {
    const context = useContext(YearContext)
    if (!context) {
        throw new Error("useYear must be used within a YearProvider")
    }
    return context
}