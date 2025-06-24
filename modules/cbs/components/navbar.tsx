"use client"

import { AnimatedToggleMode } from "@/components/global/animated-toggle-mode";
import YearCombobox from "@/components/global/year-combobox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface NavbarProps {
    toggleSidebar: () => void
}

const CBSNavbar = ({ toggleSidebar }: NavbarProps) => {

    return (
        <motion.nav
            className={
                `fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between 
                    px-4 transition-colors duration-200 border-b-2 bg-card`
            }
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
                <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
                    <div className="h-12 w-12 rounded-md bg-red-600 flex items-center justify-center font-bold">
                        CBS
                    </div>
                    <span className="hidden font-semibold md:inline-block">Combustibles Baja Sur</span>
                </motion.div>
            </div>

            {/** <UserDataComponent /> */}

            <div className="flex items-center gap-2 h-full">
                <motion.div whileHover={{ scale: 1.05 }} className="mr-2">
                    <YearCombobox />
                </motion.div>
                <Separator orientation="vertical" />
                <AnimatedToggleMode />
                {/** <NotificationDropdown /> */}
            </div>
        </motion.nav>
    );
};

export default CBSNavbar;