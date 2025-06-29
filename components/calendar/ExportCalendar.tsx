"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, ExternalLink } from 'lucide-react'
import { format, parseISO, isAfter, startOfDay } from 'date-fns'
import { useTranslation } from '@/contexts/LanguageContext'
import { CalendarEvent, ExportCalendarProps } from '@/types'

export function ExportCalendar({ events }: ExportCalendarProps) {
    const [showExportDialog, setShowExportDialog] = useState(false)
    const { t } = useTranslation()

    // Filter events to only show future events (today and future)
    const now = startOfDay(new Date())
    const futureEvents = events.filter(event =>
        isAfter(parseISO(event.date), now) || parseISO(event.date).toDateString() === now.toDateString()
    )

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
                    disabled={futureEvents.length === 0}
                >
                    <Download className="h-4 w-4" />
                    <span>{t('exportToGoogleCalendar')}</span>
                </Button>
            </div>

            {/* Export Dialog */}
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>{t('exportCalendar')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {futureEvents.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                {t('noEventsToExport')}
                            </p>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    {t('exportInstructions')}
                                </p>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {futureEvents.map((event) => (
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