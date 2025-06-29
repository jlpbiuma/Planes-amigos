"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreateEventForm } from './CreateEventForm'
import { EventDetails } from './EventDetails'
import { tc } from '@/lib/translations'
import { CalendarEvent, CalendarDialogsProps } from '@/types'

export function CalendarDialogs({
    showCreateEvent,
    setShowCreateEvent,
    selectedDate,
    onEventCreate,
    selectedEvent,
    setSelectedEvent,
    onEventJoin,
    currentUserId
}: CalendarDialogsProps) {
    return (
        <>
            {/* Create Event Dialog */}
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
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
                <DialogContent className="w-[95vw] max-w-md mx-auto">
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
        </>
    )
} 