"use client"

import AreaSidebar from "@/modules/areas/components/layout/area-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AreaNavbar from "@/modules/areas/components/layout/area-navbar";
import { TimeProvider } from "@/context/time-context";
import { DateProvider } from "@/context/date-context";
import { AreaProvider } from "@/context/area-context"
import { use } from "react";

const AreaLayout = ({
    children,
    params,
}: {
    children: React.ReactNode,
    params: Promise<{ nombre: string, name: string }>;
}) => {
    const { nombre, name } = use(params);
    const empresaDecodedName = nombre ? decodeURIComponent(nombre) : '';
    const areaDecodedName = name ? decodeURIComponent(name) : '';

    return (
        <div>
            <AreaProvider
                empresaName={empresaDecodedName}
                areaName={areaDecodedName}
            >
                <TimeProvider>
                    <DateProvider>
                        <SidebarProvider>
                            <AreaSidebar />
                            <SidebarInset>
                                <AreaNavbar companyName={empresaDecodedName} />
                                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                    {children}
                                </div>
                            </SidebarInset>
                        </SidebarProvider>
                    </DateProvider>
                </TimeProvider>
            </AreaProvider>
        </div>
    )
}

export default AreaLayout