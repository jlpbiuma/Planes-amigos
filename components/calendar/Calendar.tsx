"use client"

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreateEventForm } from './CreateEventForm'
import { EventDetails } from './EventDetails'
import { tc } from '@/lib/translations'

export interface Event {
    id: string
    title: string
    date: string
    color: string
    creator_id: string
    participant_count: number
    participants: Array<{ id: string; name: string; color: string }>
}

interface CalendarProps {
    events: Event[]
    onEventCreate: (title: string, date: string) => void
    onEventJoin: (eventId: string) => void
    currentUserId: string
}



const eventColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-red-500',
    'bg-yellow-500'
]

export function Calendar({ events, onEventCreate, onEventJoin, currentUserId }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [showCreateEvent, setShowCreateEvent] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>('')

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const getEventsForDay = (day: Date) => {
        const dayString = format(day, 'yyyy-MM-dd')
        return events.filter(event =>
            format(parseISO(event.date), 'yyyy-MM-dd') === dayString
        )
    }

    const handleCreateEvent = (date: string) => {
        setSelectedDate(date)
        setShowCreateEvent(true)
    }

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event)
    }

    return (
        <div className="w-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4 px-2">
                {/* Week day headers */}
                {tc('daysOfWeek').map((day: string, index: number) => (
                    <div key={index} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {monthDays.map((day) => {
                    const dayEvents = getEventsForDay(day)
                    const dayString = format(day, 'yyyy-MM-dd')

                    return (
                        <div key={day.toString()} className="relative min-h-16">
                            <Button
                                variant={isToday(day) ? "default" : "ghost"}
                                className={`w-full h-full p-1 flex flex-col items-center justify-start ${isToday(day) ? '' : 'hover:bg-accent'
                                    }`}
                                onClick={() => handleCreateEvent(dayString)}
                            >
                                <span className="text-sm">{format(day, 'd')}</span>

                                {/* Event indicators */}
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {dayEvents.slice(0, 2).map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEventClick(event)
                                            }}
                                            className={`w-2 h-2 rounded-full ${event.color} hover:scale-125 transition-transform cursor-pointer`}
                                        />
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>
                                    )}
                                </div>
                            </Button>
                        </div>
                    )
                })}
            </div>

            {/* Today's Events */}
            <div className="space-y-2 px-2">
                <h3 className="text-sm font-medium text-muted-foreground">{tc('todaysEvents')}</h3>
                {getEventsForDay(new Date()).length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">{tc('noEventsToday')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {getEventsForDay(new Date()).map((event) => (
                            <div key={event.id} className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEventClick(event)}>
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

            {/* Create Event Dialog */}
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{tc('createNewEvent')}</DialogTitle>
                    </DialogHeader>
                    <CreateEventForm
                        selectedDate={selectedDate}
                        onEventCreate={(title, date) => {
                            onEventCreate(title, date)
                            setShowCreateEvent(false)
                        }}
                        onCancel={() => setShowCreateEvent(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="max-w-sm sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-left text-lg font-semibold pr-8">{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <EventDetails
                            event={selectedEvent}
                            onJoin={() => {
                                onEventJoin(selectedEvent.id)
                                setSelectedEvent(null)
                            }}
                            currentUserId={currentUserId}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
} 