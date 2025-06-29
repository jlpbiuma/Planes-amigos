export interface Participant {
    id: string
    name: string
    color: string
}

export interface CalendarEvent {
    id: string
    title: string
    date: string
    color: string
    creator_id: string
    participant_count: number
    participants: Participant[]
}

// For backward compatibility, export as Event as well
export type Event = CalendarEvent
