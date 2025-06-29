"use client"

import { Calendar } from '@/components/calendar/Calendar'
import { CalendarProps } from '@/types'

export function CalendarTab({ events, onEventCreate, onEventJoin, currentUserId }: CalendarProps) {
    return (
        <Calendar
            events={events}
            onEventCreate={onEventCreate}
            onEventJoin={onEventJoin}
            currentUserId={currentUserId}
        />
    )
} 