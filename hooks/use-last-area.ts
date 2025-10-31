import { useEffect, useState } from "react";

export const useLastArea = (userId: string | undefined, initialAreaId?: string) => {
    const [areaId, setAreaId] = useState<string | undefined>(() => {
        if (!userId) return undefined;
        return localStorage.getItem(`last_area_${userId}`) || initialAreaId;
    });

    useEffect(() => {
        if (!userId || !areaId) return;
        localStorage.setItem(`last_area_${userId}`, areaId);
    }, [areaId, userId]);

    const updateArea = (newAreaId: string) => {
        setAreaId(newAreaId);
    };

    const clearArea = () => {
        if (!userId) return;
        localStorage.removeItem(`last_area_${userId}`);
        setAreaId(undefined);
    };

    return { areaId, updateArea, clearArea };
};