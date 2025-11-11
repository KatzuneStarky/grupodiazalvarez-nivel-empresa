import { calcularCumplimientoDocumentalDetallado } from "../documentos/types/file-rules"
import { getMaintenanceUrgency } from "../../utils/get-maintenance-urgency"
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
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

    const allMaintenance = equipos.filter(truck => {
        const lastMaintenance = getSafeMaintenanceDate(truck);
        return lastMaintenance ?
            getMaintenanceUrgency(lastMaintenance) !== "good" :
            true;
    }).length

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

    const maintenanceCompliance = Math.round(((equipos.length - overdueMaintenance) / equipos.length) * 100)
    const resultados = calcularCumplimientoDocumentalDetallado(equipos)

    return {
        maintenanceCompliance,
        compliancePercentage: resultados.porcentajeCumplimiento,
        upcomingMaintenance,
        outOfServiceTrucks,
        overdueMaintenance,
        maintenanceTrucks,
        operationalTrucks,
        inactiveTrucks,
        allMaintenance,
        dueMaintenance,
        activeTrucks,
        criticalDocs: resultados.porVencer,
        expiredDocs: resultados.vencidos,
        warningDocs: resultados.sinFecha,
        newTrucks,
        oldTrucks,
        allDocs: resultados.total,
        avgAge,
    };
}