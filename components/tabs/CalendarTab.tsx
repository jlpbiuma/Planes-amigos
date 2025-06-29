"use client"

import { Calendar, Event } from '@/components/calendar/Calendar'

interface CalendarTabProps {
    events: Event[]
    onEventCreate: (title: string, date: string) => void
    onEventJoin: (eventId: string) => void
    currentUserId: string
}

export function CalendarTab({ events, onEventCreate, onEventJoin, currentUserId }: CalendarTabProps) {
    return (
        <Calendar
            events={events}
            onEventCreate={onEventCreate}
            onEventJoin={onEventJoin}
            currentUserId={currentUserId}
        />
    )
} 