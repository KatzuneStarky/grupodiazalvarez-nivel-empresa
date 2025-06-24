"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export const AnimatedToggleMode = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.div whileHover={{ scale: 1.05 }}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="cursor-pointer"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: theme === "dark" ? 0 : 180 }}
                    transition={{ duration: 0.3, type: "spring" }}
                >
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </motion.div>
            </Button>
        </motion.div>
    )
}