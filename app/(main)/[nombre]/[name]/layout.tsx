import AreaSidebar from "@/modules/areas/components/layout/area-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AutoLockWrapper } from "@/components/global/auto-lock-wrapper";
import AreaNavbar from "@/modules/areas/components/layout/area-navbar";
import { NotificationsProvider } from "@/context/notification-context";
import { TimeProvider } from "@/context/time-context";
import { DateProvider } from "@/context/date-context";
import { AreaProvider } from "@/context/area-context"

export async function generateMetadata({ params }: { params: Promise<{ nombre: string, name: string }> }) {
    const { nombre, name } = await params;
    return {
        title: `${decodeURIComponent(name)} - ${decodeURIComponent(nombre)}`,
    }
}

const AreaLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode,
    params: Promise<{ nombre: string, name: string }>;
}) => {
    const { nombre, name } = await params;
    const empresaDecodedName = nombre ? decodeURIComponent(nombre) : '';
    const areaDecodedName = name ? decodeURIComponent(name) : '';

    return (
        <div>
            <AutoLockWrapper>
                <AreaProvider
                    empresaName={empresaDecodedName}
                    areaName={areaDecodedName}
                >
                    <NotificationsProvider>
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
                    </NotificationsProvider>
                </AreaProvider>
            </AutoLockWrapper>
        </div>
    )
}

export default AreaLayout