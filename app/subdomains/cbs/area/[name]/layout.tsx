"use client"

import LoadingState from "@/modules/cbs/skeletons/area-skeleton";
import CBSSidebar from "@/modules/cbs/components/sidebar";
import { IpAddressProvider } from "@/context/ip-context";
import CBSNavbar from "@/modules/cbs/components/navbar";
import { AnimatePresence, motion } from "framer-motion"
import { TimeProvider } from "@/context/time-context";
import { DateProvider } from "@/context/date-context";
import { YearProvider } from "@/context/year-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CBSAreaNameLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const isMobile = useIsMobile()
    const router = useRouter()

    if (isCheckingAccess) {
        return <LoadingState />;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev)
    }

    const toggleSidebarCollapsed = () => {
        setIsSidebarCollapsed((prev) => !prev)
    }

    const getMainMargin = () => {
        if (isMobile) return "ml-0"
        if (!isSidebarOpen) return "ml-0"
        return isSidebarCollapsed ? "ml-16" : "ml-64"
    }

    return (
        <YearProvider>
            <DateProvider>
                <TimeProvider>
                    <IpAddressProvider>

                        <CBSNavbar toggleSidebar={toggleSidebar} />

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

                        <CBSSidebar
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
                    </IpAddressProvider>
                </TimeProvider>
            </DateProvider>
        </YearProvider>
    )
}

export default CBSAreaNameLayout