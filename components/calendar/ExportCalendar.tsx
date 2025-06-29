"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, ExternalLink } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { tc } from '@/lib/translations'
import { CalendarEvent, ExportCalendarProps } from '@/types'

export function ExportCalendar({ events }: ExportCalendarProps) {
    const [showExportDialog, setShowExportDialog] = useState(false)

    const generateGoogleCalendarUrl = (event: CalendarEvent) => {
        const startDate = format(parseISO(event.date), 'yyyyMMdd')
        const endDate = format(parseISO(event.date), 'yyyyMMdd')

        const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render')
        googleCalendarUrl.searchParams.set('action', 'TEMPLATE')
        googleCalendarUrl.searchParams.set('text', event.title)
        googleCalendarUrl.searchParams.set('dates', `${startDate}/${endDate}`)
        googleCalendarUrl.searchParams.set('details', `Participants: ${event.participants.map(p => p.name).join(', ')}`)

        return googleCalendarUrl.toString()
    }

    const handleExportToGoogleCalendar = (event: CalendarEvent) => {
        const url = generateGoogleCalendarUrl(event)
        window.open(url, '_blank')
    }

    return (
        <>
            {/* Export to Google Calendar Button */}
            <div className="px-2 mt-6">
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => setShowExportDialog(true)}
                    disabled={events.length === 0}
                >
                    <Download className="h-4 w-4" />
                    <span>{tc('exportToGoogleCalendar')}</span>
                </Button>
            </div>

            {/* Export Dialog */}
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>{tc('exportCalendar')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                {tc('noEventsToExport')}
                            </p>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    {tc('exportInstructions')}
                                </p>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                            onClick={() => handleExportToGoogleCalendar(event)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${event.color}`} />
                                                <div>
                                                    <h4 className="font-medium text-sm">{event.title}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(parseISO(event.date), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 