"use client"

import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { Mail, Menu, Phone, Truck, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { navItems } from '../constants/navbar-items'
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
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="nav-item flex items-center space-x-2 opacity-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-xl font-bold ${isScrolled ? "text-gray-900" : "text-white"}`}>
                                FuelTransport BCS
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavClick(item.href)}
                                    className={`nav-item opacity-0 px-3 py-2 text-sm font-medium 
                                        transition-colors duration-200 hover:text-red-500 cursor-pointer
                                        ${isScrolled ? "text-gray-700" : "text-white"}`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center space-x-4">
                            <div
                                className={`nav-item opacity-0 flex items-center space-x-2 text-sm ${isScrolled ? "text-gray-600" : "text-white/90"
                                    }`}
                            >
                                <Phone className="w-4 h-4" />
                                <span></span>
                            </div>
                            <button
                                onClick={() => handleNavClick("#contact")}
                                className="nav-item opacity-0 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                                Get Quote
                            </button>
                        </div>

                        <button
                            onClick={toggleMobileMenu}
                            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                                }`}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden z-50 md:z-0 fixed top-16 right-0 bottom-0 w-80 bg-white shadow-xl opacity-0"
                    >
                        <div className="p-6">
                            <div className="space-y-4">
                                {navItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNavClick(item.href)}
                                        className="mobile-nav-item block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 opacity-0"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="mobile-nav-item flex items-center space-x-2 text-gray-600 mb-4 opacity-0">
                                    <Phone className="w-4 h-4" />
                                    <span>+52 612 123 4567</span>
                                </div>
                                <div className="mobile-nav-item flex items-center space-x-2 text-gray-600 mb-6 opacity-0">
                                    <Mail className="w-4 h-4" />
                                    <span>info@fueltransportbcs.com</span>
                                </div>
                                <button
                                    onClick={() => handleNavClick("#contact")}
                                    className="mobile-nav-item w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 opacity-0"
                                >
                                    Request Quote
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
        </>
    )
}

export default RootNavbar