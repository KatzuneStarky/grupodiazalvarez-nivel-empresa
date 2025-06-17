"use client"

import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

export const useAboutFunctions = (
    years: number = 0, 
    liters: number = 0, 
    clients:number = 0, 
    routes: number = 0
) => {
    const [counters, setCounters] = useState({
        years: 0,
        liters: 0,
        clients: 0,
        routes: 0,
    })

    const aboutRef = useRef<HTMLElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true
                        animateCounters()
                    }
                })
            },
            { threshold: 0.5 },
        )

        if (aboutRef.current) {
            observer.observe(aboutRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const animateCounters = () => {
        animate({ value: 0 }, {
            value: 15,
            duration: 2000,
            easing: "easeOutQuart",
            update: (anim: any) => {
                setCounters((prev) => ({ ...prev, years: years }));
            },
        })


        animate({ value: 0 }, {
            value: 50,
            duration: 2500,
            easing: "easeOutQuart",
            update: (anim: any) => {
                setCounters((prev) => ({ ...prev, liters: liters }));
            },
        })

        animate({ value: 0 }, {
            value: 200,
            duration: 2200,
            easing: "easeOutQuart",
            update: (anim: any) => {
                setCounters((prev) => ({ ...prev, clients: clients }));
            },
        })

        animate({ value: 0 }, {
            value: 25,
            duration: 1800,
            easing: "easeOutQuart",
            update: (anim: any) => {
                setCounters((prev) => ({ ...prev, routes: routes }));
            },
        })
    }

    return {
        counters,
        aboutRef,
    }
}