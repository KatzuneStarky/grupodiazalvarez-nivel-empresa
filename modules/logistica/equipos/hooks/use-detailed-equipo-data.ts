
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date";
import { Equipo } from "../../bdd/equipos/types/equipos"
import { differenceInDays } from "date-fns";
import { calcularCumplimientoDocumentalDetallado, getSafeDocuments } from "../functions/detailed-equipo-data";

type MaintenanceStatus = "AL_DIA" | "PROXIMO" | "VENCIDO" | "SIN_REGISTRO";

interface MaintenanceResult {
    fechaUltimo: Date | null;
    fechaProximo: Date | null;
    estado: MaintenanceStatus;
    diasRestantes?: number | null;
}

interface GrupoPorYear {
    rango: string;
    equipos: Equipo[];
}

export const useDetailedEquipoData = (equipos: Equipo[], currentYear: number) => {
    if (!equipos.length) {
        return {
            outOfServiceTrucks: 0,
            maintenanceTrucks: 0,
            operationalTrucks: 0,
            inactiveTrucks: 0,
            activeTrucks: 0,
            newTrucks: 0,
            oldTrucks: 0,
            avgAge: 0,
            avgRendimiento: 0,
            enViajeTrucks: 0,
            availableWithIssues: 0,
            groupsSummary: {}
        };
    }

    //General
    const activeTrucks = equipos.filter((t) => t.activo).length;
    const inactiveTrucks = equipos.filter((t) => !t.activo).length;
    const operationalTrucks = equipos.filter((t) => t.estado === EstadoEquipos.DISPONIBLE).length;
    const maintenanceTrucks = equipos.filter((t) => t.estado === EstadoEquipos.EN_TALLER).length;
    const outOfServiceTrucks = equipos.filter((t) => t.estado === EstadoEquipos.FUERA_DE_SERVICIO).length;
    const enViajeTrucks = equipos.filter((t) => t.estado === EstadoEquipos.EN_VIAJE).length;
    const availableWithIssues = equipos.filter((t) => t.estado === EstadoEquipos.DISPONIBLE_CON_DETALLES).length;

    const stats = equipos.reduce(
        (acc, t) => {
            const age = Math.max(0, currentYear - (t.year ?? currentYear));
            acc.totalAge += age;
            if (age <= 2) acc.newTrucks++;
            if (age > 10) acc.oldTrucks++;

            if (typeof t.rendimientoPromedioKmPorLitro === "number")
                acc.totalRendimiento += t.rendimientoPromedioKmPorLitro;

            const grupo = t.grupoUnidad || "GENERAL";
            if (!acc.grupos[grupo]) acc.grupos[grupo] = { total: 0, activos: 0 };
            acc.grupos[grupo].total++;
            if (t.activo) acc.grupos[grupo].activos++;

            return acc;
        },
        {
            totalAge: 0,
            newTrucks: 0,
            oldTrucks: 0,
            totalRendimiento: 0,
            grupos: {} as Record<string, { total: number; activos: number }>
        }
    );
    const avgAge = equipos.length > 0 ? stats.totalAge / equipos.length : 0;
    const trucksWithRendimiento = equipos.filter((t) => typeof t.rendimientoPromedioKmPorLitro === "number").length;
    const avgRendimiento =
        trucksWithRendimiento > 0 ? stats.totalRendimiento / trucksWithRendimiento : 0;

    const agruparEquiposPorAño = (equipos: Equipo[]): GrupoPorYear[] => {
        const añoActual = new Date().getFullYear();

        const grupos: GrupoPorYear[] = [];
        const tamañoGrupo = 2;
        const cantidadGrupos = 4;

        for (let i = 0; i < cantidadGrupos; i++) {
            const añoInicio = añoActual - i * tamañoGrupo;
            const añoFin = añoInicio - (tamañoGrupo - 1);

            grupos.push({
                rango: `${añoFin} - ${añoInicio}`,
                equipos: [],
            });
        }

        grupos.push({
            rango: `≤ ${añoActual - cantidadGrupos * tamañoGrupo}`,
            equipos: [],
        });

        equipos.forEach((eq) => {
            const year = eq.year;
            if (!year) return;

            let asignado = false;

            for (const grupo of grupos.slice(0, cantidadGrupos)) {
                const [añoFin, añoInicio] = grupo.rango.split(" - ").map(Number);
                if (year >= añoFin && year <= añoInicio) {
                    grupo.equipos.push(eq);
                    asignado = true;
                    break;
                }
            }

            if (!asignado) {
                grupos[grupos.length - 1].equipos.push(eq);
            }
        });

        return grupos;
    };

    const edadEquiposChartData = agruparEquiposPorAño(equipos)

    //Mantenimiento
    const getSafeMaintenanceDate = (truck: Equipo): MaintenanceResult => {
        if (!truck.mantenimiento?.length) {
            return { fechaUltimo: null, fechaProximo: null, estado: "SIN_REGISTRO" };
        }

        const sorted = [...truck.mantenimiento].sort((a, b) => {
            const dateA = parseFirebaseDate(a.fecha)?.getTime() ?? 0;
            const dateB = parseFirebaseDate(b.fecha)?.getTime() ?? 0;
            return dateB - dateA;
        });

        const last = sorted[0];
        const fechaUltimo = parseFirebaseDate(last.fecha);
        const fechaProximo = parseFirebaseDate(last.fechaProximo);

        if (!fechaProximo || isNaN(fechaProximo.getTime())) {
            return {
                fechaUltimo: fechaUltimo ?? null,
                fechaProximo: null,
                estado: "SIN_REGISTRO"
            };
        }

        const today = new Date();
        const diasRestantes = differenceInDays(fechaProximo, today);

        let estado: MaintenanceStatus = "AL_DIA";
        if (diasRestantes <= 0) estado = "VENCIDO";
        else if (diasRestantes <= 15) estado = "PROXIMO";

        return {
            fechaUltimo: fechaUltimo ?? null,
            fechaProximo,
            estado,
            diasRestantes
        };
    };

    const maintenanceSummary = equipos.reduce(
        (acc, truck) => {
            const { estado, diasRestantes } = getSafeMaintenanceDate(truck);

            if (estado === "SIN_REGISTRO") return acc;
            if (estado === "VENCIDO") acc.overdue++;
            else if (estado === "PROXIMO") {
                if (typeof diasRestantes === "number" && diasRestantes <= 100) acc.dueSoon++;
                else acc.upcoming++;
            } else if (estado === "AL_DIA") acc.ok++;

            acc.total++;
            return acc;
        },
        {
            total: 0,
            overdue: 0,
            dueSoon: 0,
            upcoming: 0,
            ok: 0,
        }
    );

    const documentos = calcularCumplimientoDocumentalDetallado(equipos)
    const { enTiempo, porVencer, porcentajeCumplimiento, sinFecha, total, vencidos } = documentos

    //Funcion para evitar infinitos o valores NaN
    const sanitize = (v: number) => (isFinite(v) && !isNaN(v) ? v : 0);

    return {
        maintenanceUpcoming: sanitize(maintenanceSummary.upcoming),
        maintenanceDueSoon: sanitize(maintenanceSummary.dueSoon),
        maintenanceOverdue: sanitize(maintenanceSummary.overdue),
        totalMaintenance: sanitize(maintenanceSummary.total),
        availableWithIssues: sanitize(availableWithIssues),
        outOfServiceTrucks: sanitize(outOfServiceTrucks),
        maintenanceTrucks: sanitize(maintenanceTrucks),
        operationalTrucks: sanitize(operationalTrucks),
        maintenanceOk: sanitize(maintenanceSummary.ok),
        inactiveTrucks: sanitize(inactiveTrucks),
        avgRendimiento: sanitize(avgRendimiento),
        enViajeTrucks: sanitize(enViajeTrucks),
        activeTrucks: sanitize(activeTrucks),
        newTrucks: sanitize(stats.newTrucks),
        oldTrucks: sanitize(stats.oldTrucks),
        documentosTotales: sanitize(total),
        groupsSummary: stats.grupos,
        totalTrucks: equipos.length,
        avgAge: sanitize(avgAge),
        edadEquiposChartData,
    }
}