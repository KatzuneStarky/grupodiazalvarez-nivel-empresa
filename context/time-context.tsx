"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TimeContextType } from "@/types/time-context";

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [time, setTime] = useState<Date>(new Date());
    const [is24Hour, setIs24Hour] = useState<boolean>(true);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = useMemo<string>(() => {
        if (!mounted) return "";

        const hours = is24Hour
            ? time.getHours().toString().padStart(2, "0")
            : (time.getHours() % 12 || 12).toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");
        const seconds = time.getSeconds().toString().padStart(2, "0");

        if (!is24Hour) {
            const amPm = time.getHours() >= 12 ? "PM" : "AM";
            return `${hours}:${minutes}:${seconds} ${amPm}`;
        }

        return `${hours}:${minutes}:${seconds}`;
    }, [time, is24Hour, mounted]);

    return (
        <TimeContext.Provider value= {{ time, is24Hour, setIs24Hour, formattedTime }
}>
    { children }
    </TimeContext.Provider>
    );
};

export const useTime = () => {
    const context = useContext(TimeContext);
    if (context === undefined) {
        throw new Error('useTime must be used within a TimeProvider');
    }
    return context;
};