"use client"

import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "@/components/custom/sidebar"
import Navbar from "@/components/custom/navbar"
import { useEffect, useState } from "react"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev)
    }

    const toggleSidebarCollapsed = () => {
        setIsSidebarCollapsed((prev) => !prev)
    }

    const getMainMargin = () => {
        if (isMobile) return "ml-0"
        if (!isSidebarOpen) return "ml-0"
        return isSidebarCollapsed ? "ml-0" : "ml-64"
    }

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />

            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 bg-black"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                toggleCollapsed={toggleSidebarCollapsed}
            />

            <motion.main
                className={`pt-16 transition-all duration-300 ${getMainMargin()}`}
                initial={false}
                animate={{
                    marginLeft: getMainMargin(),
                }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
                <div className="container mx-auto p-6">{children}</div>
            </motion.main>
        </div>
    )
}

export default AdminLayout