import { useAllEmpreas } from "@/modules/empresas/hooks/use-all-empresas";
import { useAreasByEmpresa } from "@/modules/areas/hooks/use-areas";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectUserByCompanyArea = () => {
    const router = useRouter();
    const { userBdd } = useAuth();
    const { empresas } = useAllEmpreas();

    const areasHook = useAreasByEmpresa(userBdd?.empresaId || "");

    useEffect(() => {
        if (!userBdd || !empresas || empresas.length === 0) return;

        const empresa = empresas.find(e => e.id === userBdd.empresaId);
        if (!empresa || !areasHook.areas) return;

        const lastAreaId = localStorage.getItem(`last_area_${userBdd.uid}`);
        const area = areasHook.areas.find(a => a.id === lastAreaId) || areasHook.areas[0];
        if (!area) return;

        localStorage.setItem(`last_area_${userBdd.uid}`, area.id);

        const empresaSlug = empresa.nombre
        const areaSlug = area.nombre

        router.push(`/${empresaSlug}/${areaSlug}`);
    }, [userBdd, empresas, areasHook.areas, router]);
};