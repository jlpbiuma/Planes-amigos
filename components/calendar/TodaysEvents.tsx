"use client"

import { Users } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { tc } from '@/lib/translations'
import { CalendarEvent, TodaysEventsProps } from '@/types'

export function TodaysEvents({ events, onEventClick }: TodaysEventsProps) {
    const getEventsForDay = (day: Date) => {
        const dayString = format(day, 'yyyy-MM-dd')
        return events.filter(event =>
            format(parseISO(event.date), 'yyyy-MM-dd') === dayString
        )
    }

    const todaysEvents = getEventsForDay(new Date())

    return (
        <div className="space-y-2 px-2">
            <h3 className="text-sm font-medium text-muted-foreground">{tc('todaysEvents')}</h3>
            {todaysEvents.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">{tc('noEventsToday')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {todaysEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEventClick(event)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${event.color}`} />
                                    <div>
                                        <h3 className="font-medium">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {tc('today')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                        {event.participant_count} {event.participant_count === 1 ? tc('participant') : tc('participants')}
                                    </span>
                                </div>
                            </div>

                            {/* Participant list with names */}
                            <div className="mt-3 space-y-1">
                                <p className="text-xs text-muted-foreground font-medium">{tc('participants')}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {event.participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center space-x-1 bg-muted rounded-full px-2 py-1"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${participant.color}`} />
                                            <span className="text-xs">{participant.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 