"use client"

import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import React, { useEffect, useRef, useState } from 'react'
import DesktopNavbar from './navbar/desktop-navbar'
import MobileNavbar from './navbar/mobile-navbar'
import { animate } from 'animejs'

const RootNavbar = () => {
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)

    const { isScrolled } = useScrollAnimation()

    useEffect(() => {
        animate(".nav-item", {
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: 100,
            easing: "easeOutQuart",
        })
    }, [])

    const toggleMobileMenu = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (isOpen) {
            if (mobileMenuRef.current) {
                animate(mobileMenuRef.current, {
                    translateX: [300, 0],
                    opacity: [0, 1],
                    duration: 300,
                    easing: "easeOutQuart",
                })
            }

            animate(".mobile-nav-item", {
                translateX: [50, 0],
                opacity: [0, 1],
                duration: 400,
                delay: 100,
                easing: "easeOutQuart",
            });
        } else {
            if (mobileMenuRef.current) {
                animate(mobileMenuRef.current, {
                    translateX: [0, 300],
                    opacity: [1, 0],
                    duration: 300,
                    easing: "easeInQuart",
                })
            }
        }
    }, [isOpen])

    const handleNavClick = (href: string) => {
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
        setIsOpen(false)
    }

    return (
        <>
            <div
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
                    ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
            >
                <DesktopNavbar
                    handleNavClick={handleNavClick}
                    isOpen={isOpen}
                    isScrolled={isScrolled}
                    toggleMobileMenu={toggleMobileMenu}
                />

                <MobileNavbar
                    isOpen={isOpen}
                    mobileMenuRef={mobileMenuRef}
                    handleNavClick={handleNavClick}
                />
            </div>

            {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
        </>
    )
}

export default RootNavbar