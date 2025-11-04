import { ConsumoCombustible, ConsumoEventProps, SelectedEvent } from "../types/consumo"
import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core/index.js"
import { useOperadores } from "../../bdd/operadores/hooks/use-estaciones"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { useEquipos } from "../../bdd/equipos/hooks/use-equipos"
import { useCallback, useState } from "react"
import { useConsumo } from "./use-consumo"

export const useConsumoCalendarData = () => {
    const { operadores } = useOperadores()
    const { consumo } = useConsumo()
    const { equipos } = useEquipos()

    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null)
    const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false)
    const [consumoDate, setConsumoDate] = useState<Date | null>(null)
    const [openDialogData, setOpenDialogData] = useState(false)

    const getNumEconomico = (equipoId: string) => {
        const equipo = equipos.find((equipo) => equipo.id === equipoId)
        return equipo ? equipo.numEconomico : "N/A"
    }

    const getOperadorName = (operadorId: string) => {
        const operador = operadores.find((operador) => operador.id === operadorId)
        return operador ? `${operador.nombres} ${operador.apellidos}` : "N/A"
    }

    function getPerformanceColor(rendimientoKmL?: number): string {
        if (rendimientoKmL == null) return "hsl(0, 0%, 60%)"
        if (rendimientoKmL >= 1) return "hsl(142, 70%, 45%)"
        if (rendimientoKmL >= 2.2) return "hsl(48, 90%, 55%)"
        return "hsl(0, 75%, 55%)"
    }

    const handleEventClick = useCallback((clickInfo: EventClickArg) => {
        const eventData = clickInfo.event.extendedProps as ConsumoEventProps
        setSelectedEvent(eventData)
        setOpenDialogData(true)
    }, [])


    const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {        
        const calendarApi = selectInfo.view.calendar
        setConsumoDate(selectInfo.start || new Date())
        calendarApi.unselect()
        setOpenNewOrderDialog(true)
    }, [])

    const mapConsumosToEvents = (consumos: ConsumoCombustible[]): EventInput[] => {
        return consumos.map((item) => ({
            id: item.id,
            title: `EQUIPO ${equipos.find((equipo) => equipo.id === item.equipoId)?.numEconomico} — ${item.litrosCargados} L`,
            start: parseFirebaseDate(item.fecha),
            allDay: true,
            backgroundColor: getPerformanceColor(item.rendimientoKmL),
            borderColor: getPerformanceColor(item.rendimientoKmL),
            textColor: "hsl(0, 0%, 100%)",
            extendedProps: {
                ...item,
            },
        }));
    }

    return {
        selectedEvent,
        getNumEconomico,
        getOperadorName,
        getPerformanceColor,
        handleEventClick,
        openDialogData,
        setOpenDialogData,
        consumoEvents: mapConsumosToEvents(consumo),
        handleDateSelect,
        openNewOrderDialog,
        setOpenNewOrderDialog,
        consumoDate
    }
}