"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, User, ChevronDown, ChevronUp } from 'lucide-react'
import { Event } from '@/components/calendar/Calendar'
import { tc } from '@/lib/translations'
import { parseISO, isAfter, isBefore, startOfDay } from 'date-fns'

interface MyEventsTabProps {
    userEvents: Event[]
    isLoadingEvents: boolean
}

export function MyEventsTab({ userEvents, isLoadingEvents }: MyEventsTabProps) {
    const [showPastEvents, setShowPastEvents] = useState(false)

    if (isLoadingEvents) {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-4">{tc('myEvents')}</h2>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">{tc('loading')}</p>
                </div>
            </div>
        )
    }

    if (userEvents.length === 0) {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-4">{tc('myEvents')}</h2>
                <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">{tc('noEventsJoined')}</p>
                    <p className="text-sm text-muted-foreground">{tc('createOrJoinEvents')}</p>
                </div>
            </div>
        )
    }

    const now = startOfDay(new Date())

    // Separate future and past events
    const futureEvents = userEvents
        .filter(event => isAfter(parseISO(event.date), now) || parseISO(event.date).toDateString() === now.toDateString())
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()) // Most upcoming first

    const pastEvents = userEvents
        .filter(event => isBefore(parseISO(event.date), now))
        .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()) // Most recent first

    const EventCard = ({ event }: { event: Event }) => (
        <div key={event.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${event.color}`} />
                    <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('es-ES', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center space-x-1">
                    <User className="h-3 w-3" />
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
    )

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">{tc('myEvents')}</h2>

            <div className="space-y-6">
                {/* Future Events */}
                <div>
                    <h3 className="text-md font-medium mb-3 text-primary">{tc('upcomingEvents')}</h3>
                    {futureEvents.length === 0 ? (
                        <div className="text-center py-4 border rounded-lg bg-muted/20">
                            <p className="text-sm text-muted-foreground">{tc('noUpcomingEvents')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {futureEvents.map(event => <EventCard key={event.id} event={event} />)}
                        </div>
                    )}
                </div>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full justify-between p-2 h-auto"
                            onClick={() => setShowPastEvents(!showPastEvents)}
                        >
                            <h3 className="text-md font-medium text-muted-foreground">{tc('pastEvents')} ({pastEvents.length})</h3>
                            {showPastEvents ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>

                        {showPastEvents && (
                            <div className="space-y-3 mt-3">
                                {pastEvents.map(event => (
                                    <div key={event.id} className="opacity-75">
                                        <EventCard event={event} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
} 