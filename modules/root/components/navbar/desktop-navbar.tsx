"use client"

import { navItems } from "../../constants/navbar-items"
import { Menu, Phone, Truck, X } from "lucide-react"

const DesktopNavbar = ({
    isScrolled,
    handleNavClick,
    toggleMobileMenu,
    isOpen,
}: {
    isScrolled: boolean,
    handleNavClick: (href: string) => void,
    toggleMobileMenu: () => void,
    isOpen: boolean,
}) => {
    return (
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
    )
}

export default DesktopNavbar