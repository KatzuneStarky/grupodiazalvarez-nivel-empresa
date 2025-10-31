"use client"

import CreateNewConsumoDialog from '@/modules/logistica/consumo/components/create-new-consumo-dialog'
import { useConsumoCalendarData } from '@/modules/logistica/consumo/hooks/use-consumo-calendar-data'
import ConsumoCalendarDialog from '@/modules/logistica/consumo/components/consumo-calendar-dialog'
import interactionPlugin from "@fullcalendar/interaction"
import allLocales from "@fullcalendar/core/locales-all"
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'

const CalendarioPage = () => {
    const {
        setOpenNewOrderDialog,
        openNewOrderDialog,
        setOpenDialogData,
        handleEventClick,
        handleDateSelect,
        getOperadorName,
        getNumEconomico,
        openDialogData,
        consumoEvents,
        selectedEvent,
        consumoDate
    } = useConsumoCalendarData()

    return (
        <div className='container mx-auto py-8 px-6'>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                eventClick={handleEventClick}
                initialView="dayGridMonth"
                select={handleDateSelect}
                events={consumoEvents}
                locales={allLocales}
                locale="es"
                selectable
                editable
            />

            <ConsumoCalendarDialog
                consumo={selectedEvent}
                equipoNombre={getNumEconomico(selectedEvent?.equipoId || "")}
                operadorNombre={getOperadorName(selectedEvent?.operadorId || "")}
                viajeNombre=''
                open={openDialogData}
                onOpenChange={setOpenDialogData}
            />

            <CreateNewConsumoDialog
                open={openNewOrderDialog}
                setOpen={setOpenNewOrderDialog}
                consumoDate={consumoDate}
            />
        </div>
    )
}

export default CalendarioPage