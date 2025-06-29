"use client"

import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { TodaysEvents } from './TodaysEvents'
import { ExportCalendar } from './ExportCalendar'
import { CalendarDialogs } from './CalendarDialogs'
import { CalendarProps, CalendarEvent } from '@/types'

export function Calendar({ events, onEventCreate, onEventJoin, currentUserId }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [showCreateEvent, setShowCreateEvent] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>('')

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)

    // Get the start and end of the calendar grid (including padding days)
    // Start from Monday (weekStartsOn: 1) to match the Spanish locale and translations
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    // Get all days to display in the calendar grid
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleCreateEvent = (date: string) => {
        setSelectedDate(date)
        setShowCreateEvent(true)
    }

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event)
    }

    return (
        <div className="w-full">
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
            />

            <CalendarGrid
                calendarDays={calendarDays}
                monthStart={monthStart}
                monthEnd={monthEnd}
                events={events}
                onCreateEvent={handleCreateEvent}
                onEventClick={handleEventClick}
                currentUserId={currentUserId}
            />

            <TodaysEvents
                events={events}
                onEventClick={handleEventClick}
            />

            <ExportCalendar
                events={events}
            />

            <CalendarDialogs
                showCreateEvent={showCreateEvent}
                setShowCreateEvent={setShowCreateEvent}
                selectedDate={selectedDate}
                onEventCreate={onEventCreate}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                onEventJoin={onEventJoin}
                currentUserId={currentUserId}
            />
        </div>
    )
} 