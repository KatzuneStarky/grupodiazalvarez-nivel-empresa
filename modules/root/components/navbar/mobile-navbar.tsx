"use client"

import { navItems } from "../../constants/navbar-items"
import { Mail, Phone } from "lucide-react"

const MobileNavbar = ({
    isOpen,
    mobileMenuRef,
    handleNavClick,
}: {
    isOpen: boolean,
    mobileMenuRef: React.MutableRefObject<HTMLDivElement | null>,
    handleNavClick: (href: string) => void,
}) => {
    return (
        <div>
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
    )
}

export default MobileNavbar