"use client"

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SidebarToggleButtonProps {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
}

const SidebarToggleButton = ({
    isCollapsed,
    toggleCollapsed
}: SidebarToggleButtonProps) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="absolute -right-3 top-3 z-50 hidden h-6 w-6 rounded-full border 
                border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 
                lg:flex lg:items-center lg:justify-center"
        >
            <ChevronRight
                className={`h-3 w-3 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}
            />
        </Button>
    )
}

export default SidebarToggleButton