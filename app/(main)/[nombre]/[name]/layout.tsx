import AreaSidebar from "@/modules/areas/components/layout/area-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AutoLockWrapper } from "@/components/global/auto-lock-wrapper";
import AreaNavbar from "@/modules/areas/components/layout/area-navbar";
import { NotificationsProvider } from "@/context/notification-context";
import { AreaAccessWrapper } from "@/components/guards/area-access-wrapper";
import { IpAddressProvider } from "@/context/ip-context";
import { TimeProvider } from "@/context/time-context";
import { DateProvider } from "@/context/date-context";
import { AreaProvider } from "@/context/area-context";
import { RoleGuard } from "@/components/auth/role-guard";
import { EmpresaProvider } from "@/context/empresa-context";

export async function generateMetadata({ params }: { params: Promise<{ nombre: string, name: string }> }) {
    const { nombre, name } = await params;
    return {
        title: `${decodeURIComponent(name).toUpperCase()} - ${decodeURIComponent(nombre)}`,
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
                    <EmpresaProvider empresaName={empresaDecodedName}>
                        <AreaAccessWrapper empresaName={empresaDecodedName}>
                            <NotificationsProvider>
                                <IpAddressProvider>
                                    <TimeProvider>
                                        <DateProvider>
                                            <SidebarProvider>
                                                <AreaSidebar />
                                                <SidebarInset>
                                                    <AreaNavbar companyName={empresaDecodedName} />
                                                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                                        <RoleGuard checkMenu={true}>
                                                            {children}
                                                        </RoleGuard>
                                                    </div>
                                                </SidebarInset>
                                            </SidebarProvider>
                                        </DateProvider>
                                    </TimeProvider>
                                </IpAddressProvider>
                            </NotificationsProvider>
                        </AreaAccessWrapper>
                    </EmpresaProvider>
                </AreaProvider>
            </AutoLockWrapper>
        </div>
    )
}

export default AreaLayout