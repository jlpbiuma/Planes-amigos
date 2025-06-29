import { CalendarEvent } from './Event'

export interface CalendarHeaderProps {
    currentDate: Date
    onPrevMonth: () => void
    onNextMonth: () => void
}

export interface CalendarGridProps {
    calendarDays: Date[]
    monthStart: Date
    monthEnd: Date
    events: CalendarEvent[]
    onCreateEvent: (date: string) => void
    onEventClick: (event: CalendarEvent) => void
    currentUserId: string
}

export interface TodaysEventsProps {
    events: CalendarEvent[]
    onEventClick: (event: CalendarEvent) => void
}

export interface ExportCalendarProps {
    events: CalendarEvent[]
}

export interface CalendarDialogsProps {
    showCreateEvent: boolean
    setShowCreateEvent: (show: boolean) => void
    selectedDate: string
    onEventCreate: (title: string, date: string) => void
    selectedEvent: CalendarEvent | null
    setSelectedEvent: (event: CalendarEvent | null) => void
    onEventJoin: (eventId: string) => void
    currentUserId: string
}

export interface CreateEventFormProps {
    selectedDate: string
    onEventCreate: (title: string, date: string) => void
    onCancel: () => void
}

export interface EventDetailsProps {
    event: CalendarEvent
    onJoin: () => void
    currentUserId: string
}

export interface CalendarProps {
    events: CalendarEvent[]
    onEventCreate: (title: string, date: string) => void
    onEventJoin: (eventId: string) => void
    currentUserId: string
}

export interface MyEventsTabProps {
    userEvents: CalendarEvent[]
    isLoadingEvents: boolean
} 