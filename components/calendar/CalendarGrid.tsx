"use client"

import { Button } from '@/components/ui/button'
import { format, isToday, parseISO } from 'date-fns'
import { Users } from 'lucide-react'
import { tc } from '@/lib/translations'
import { CalendarEvent, CalendarGridProps } from '@/types'

export function CalendarGrid({
    calendarDays,
    monthStart,
    monthEnd,
    events,
    onCreateEvent,
    onEventClick,
    currentUserId
}: CalendarGridProps) {
    const getEventsForDay = (day: Date) => {
        const dayString = format(day, 'yyyy-MM-dd')
        return events.filter(event =>
            format(parseISO(event.date), 'yyyy-MM-dd') === dayString
        )
    }

    const getUserEventForDay = (day: Date) => {
        const dayString = format(day, 'yyyy-MM-dd')
        return events.find(event =>
            format(parseISO(event.date), 'yyyy-MM-dd') === dayString &&
            event.creator_id === currentUserId
        )
    }

    const getColorClasses = (color: string) => {
        // Map event colors to proper classes
        const colorMap: Record<string, string> = {
            'bg-blue-500': 'bg-blue-500 hover:bg-blue-600',
            'bg-green-500': 'bg-green-500 hover:bg-green-600',
            'bg-purple-500': 'bg-purple-500 hover:bg-purple-600',
            'bg-orange-500': 'bg-orange-500 hover:bg-orange-600',
            'bg-pink-500': 'bg-pink-500 hover:bg-pink-600',
            'bg-cyan-500': 'bg-cyan-500 hover:bg-cyan-600',
            'bg-red-500': 'bg-red-500 hover:bg-red-600',
            'bg-yellow-500': 'bg-yellow-500 hover:bg-yellow-600'
        }
        return colorMap[color] || 'bg-gray-500 hover:bg-gray-600'
    }

    return (
        <div className="grid grid-cols-7 gap-1 mb-4 px-2">
            {/* Week day headers */}
            {tc('daysOfWeek').map((day: string, index: number) => (
                <div key={index} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day) => {
                const dayEvents = getEventsForDay(day)
                const userEvent = getUserEventForDay(day)
                const dayString = format(day, 'yyyy-MM-dd')
                const isCurrentMonth = day >= monthStart && day <= monthEnd
                const isOtherMonth = !isCurrentMonth
                const isTodayDay = isToday(day)

                // If there are any events on this day, render with event styling
                if (dayEvents.length > 0) {
                    // Use the first event's color (or user's event color if they have one)
                    const primaryEvent = userEvent || dayEvents[0]
                    const colorClasses = getColorClasses(primaryEvent.color)

                    return (
                        <div key={day.toString()} className="relative min-h-16">
                            <div
                                className={`w-full h-full p-1 flex flex-col items-center justify-between text-white cursor-pointer rounded-md transition-all duration-200 ${colorClasses} ${isTodayDay ? 'ring-2 ring-offset-2 ring-yellow-400' : ''} ${isOtherMonth ? 'opacity-60' : ''}`}
                                onClick={() => onEventClick(primaryEvent)}
                            >
                                <span className="text-sm font-medium">{format(day, 'd')}</span>

                                <div className="flex flex-col items-center space-y-1">
                                    {/* Show participant count */}
                                    <div className="flex items-center space-x-1 text-white">
                                        <Users className="h-3 w-3" />
                                        <span className="text-xs font-medium">{primaryEvent.participant_count}</span>
                                    </div>

                                    {/* Show additional event indicators if there are multiple events */}
                                    {dayEvents.length > 1 && (
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {dayEvents.slice(0, 3).map((event, idx) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onEventClick(event)
                                                    }}
                                                    className={`w-1.5 h-1.5 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer`}
                                                />
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <span className="text-xs text-white/70">+{dayEvents.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }

                // If no events, render normally
                return (
                    <div key={day.toString()} className="relative min-h-16">
                        <Button
                            variant={isTodayDay ? "default" : "ghost"}
                            className={`w-full h-full p-1 flex flex-col items-center justify-start ${isTodayDay
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : isOtherMonth
                                    ? 'text-muted-foreground/50 hover:bg-accent/50'
                                    : 'hover:bg-accent'
                                }`}
                            onClick={() => onCreateEvent(dayString)}
                        >
                            <span className="text-sm font-medium">{format(day, 'd')}</span>
                        </Button>
                    </div>
                )
            })}
        </div>
    )
} 