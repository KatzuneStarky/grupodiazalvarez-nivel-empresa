import { getMaintenanceUrgency } from "../../utils/get-maintenance-urgency"
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { getDaysUntilExpiry } from "../../utils/documents-expiricy"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Equipo } from "../../bdd/equipos/types/equipos"

export const useDetailedEquipoData = ({
    equipos,
    currentYear
}: {
    equipos: Equipo[],
    currentYear: number
}) => {
    const activeTrucks = equipos.filter((truck) => truck.activo).length
    const inactiveTrucks = equipos.filter((truck) => !truck.activo).length
    const operationalTrucks = equipos.length > 0 ? equipos.filter((truck) => truck.estado === EstadoEquipos.DISPONIBLE).length : 0
    const maintenanceTrucks = equipos.filter((truck) => truck.estado === EstadoEquipos.EN_TALLER).length
    const outOfServiceTrucks = equipos.filter((truck) => truck.estado === EstadoEquipos.FUERA_DE_SERVICIO).length

    const getSafeMaintenanceDate = (truck: Equipo) => {
        return parseFirebaseDate(truck.mantenimiento?.[0]?.fecha) || null;
    };

    const getSafeDocuments = (truck: Equipo) => {
        return [
            ...(truck.Certificado || []),
            ...(truck.ArchivosVencimiento || []),
            ...(truck.archivos || [])
        ];
    };

    const overdueMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) === "overdue" :
            true;
    }).length;

    const dueMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) === "due" :
            false;
    }).length;

    const upcomingMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) === "upcoming" :
            false;
    }).length;

    const allDocs = equipos.flatMap(truck => getSafeDocuments(truck));
    const expiredDocs = allDocs.filter(doc => doc?.createdAt && getDaysUntilExpiry(doc.updatedAt) < 0);
    const criticalDocs = allDocs.filter(doc => {
        if (!doc?.createdAt) return false;
        const days = getDaysUntilExpiry(doc.createdAt);
        return days >= 0 && days <= 7;
    });
    const warningDocs = allDocs.filter(doc => {
        if (!doc?.createdAt) return false;
        const days = getDaysUntilExpiry(doc.createdAt);
        return days > 7 && days <= 30;
    });

    const stats = equipos.reduce(
        (acc, truck) => {
            const age = currentYear - truck.year;
            acc.totalAge += age;
            if (age <= 2) acc.newTrucks++;
            if (age > 10) acc.oldTrucks++;
            return acc;
        },
        { totalAge: 0, newTrucks: 0, oldTrucks: 0 }
    );

    const avgAge = equipos.length > 0 ? stats.totalAge / equipos.length : 0;
    const { newTrucks, oldTrucks } = stats;

    const compliancePercentage = Math.round(((allDocs.length - expiredDocs.length) / allDocs.length) * 100)
    const maintenanceCompliance = Math.round(((equipos.length - overdueMaintenance) / equipos.length) * 100)

    return {
        activeTrucks,
        inactiveTrucks,
        operationalTrucks,
        maintenanceTrucks,
        outOfServiceTrucks,
        overdueMaintenance,
        dueMaintenance,
        upcomingMaintenance,
        expiredDocs,
        criticalDocs,
        warningDocs,
        avgAge,
        newTrucks,
        oldTrucks,
        compliancePercentage,
        maintenanceCompliance,
        allDocs
    }
}