"use client"

import { useEffect, useRef, useState } from "react"
import { slides } from "../constants/slides"
import { animate } from "animejs"

export const useHeroFunctions = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const slideInterval = useRef<NodeJS.Timeout>(null)
    const heroRef = useRef<HTMLElement>(null)

    useEffect(() => {
        startAutoSlide()

        animateSlideContent()

        return () => {
            if (slideInterval.current) {
                clearInterval(slideInterval.current)
            }
        }
    }, [])

    useEffect(() => {
        animateSlideContent()
    }, [currentSlide])

    const startAutoSlide = () => {
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 20000)
    }

    const stopAutoSlide = () => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current)
        }
    }

    const animateSlideContent = () => {
        if (!heroRef.current) return;
        animate(".slide-title", {
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutQuart",
        });

        animate(".slide-subtitle", {
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 600,
            easing: "easeOutQuart",
        });

        animate(".slide-description", {
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 500,
            easing: "easeOutQuart",
        });

        animate(".slide-cta", {
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            easing: "easeOutBack",
        });

        animate(".slide-icon", {
            scale: [0, 1],
            rotate: [180, 0],
            opacity: [0, 1],
            duration: 600,
            easing: "easeOutBack",
            delay: 200,
        })
    }

    const goToSlide = (index: number) => {
        stopAutoSlide()
        setCurrentSlide(index)
        setTimeout(startAutoSlide, 1000)
    }

    const nextSlide = () => {
        stopAutoSlide()
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setTimeout(startAutoSlide, 1000)
    }

    const prevSlide = () => {
        stopAutoSlide()
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setTimeout(startAutoSlide, 1000)
    }

    const handleCTAClick = () => {
        animate(".slide-cta", {
            scale: [1, 0.95, 1],
            duration: 200,
            easing: "easeOutQuart",
        })

        const targetSections = ["#contacto", "#contacto", "#acercade", "#flete"]
        const targetSection = targetSections[currentSlide]
        document.querySelector(targetSection)?.scrollIntoView({ behavior: "smooth" })
    }

    const currentSlideData = slides[currentSlide]

    return {
        currentSlide,
        goToSlide,
        nextSlide,
        prevSlide,
        handleCTAClick,
        currentSlideData,
        heroRef,
    }
}