"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, ArrowRight } from 'lucide-react'
import { getEventWithParticipants, joinEvent } from '@/lib/events'
import { Event } from '@/components/calendar/Calendar'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { tc } from '@/lib/translations'

// Simple toast implementation for now
const useToast = () => ({
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
        console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`)
    }
})

interface InvitePageProps {
    params: {
        eventId: string
    }
}

export default function InvitePage({ params }: InvitePageProps) {
    const { eventId } = params
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)

    useEffect(() => {
        loadEvent()
    }, [eventId])

    const loadEvent = async () => {
        setIsLoading(true)
        const eventData = await getEventWithParticipants(eventId)
        setEvent(eventData)
        setIsLoading(false)
    }

    const handleJoin = async () => {
        if (!user || !event) return

        setIsJoining(true)
        const result = await joinEvent(event.id, user.id)

        if (result.success) {
            toast({
                title: tc('successfullyJoined'),
                description: `${tc('youJoined')} "${event.title}". ${tc('redirectingToCalendar')}`,
            })

            // Redirect to main app after 2 seconds
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } else {
            toast({
                title: tc('failedToJoinEvent'),
                description: result.error || tc('somethingWentWrong'),
                variant: "destructive",
            })
        }

        setIsJoining(false)
    }

    const handleGoToApp = () => {
        router.push('/')
    }

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">{tc('loadingInvitation')}</p>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>{tc('eventNotFound')}</CardTitle>
                        <CardDescription>
                            {tc('eventNotFoundDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleGoToApp} className="w-full">
                            {tc('goToApp')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>{tc('joinEvent')}</CardTitle>
                        <CardDescription>
                            {tc('invitedToJoin')} "{event.title}"
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                            <div className={`w-6 h-6 rounded-full ${event.color} mx-auto mb-2`} />
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>{format(parseISO(event.date), 'EEEE, MMMM d, yyyy', { locale: es })}</span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1 mt-1">
                                <Users className="h-3 w-3" />
                                <span>{event.participant_count} {event.participant_count === 1 ? tc('participant') : tc('participants')}</span>
                            </p>
                        </div>

                        <p className="text-sm text-center text-muted-foreground">
                            {tc('pleaseSignInToJoin')}
                        </p>

                        <Button onClick={handleGoToApp} className="w-full">
                            {tc('signInSignUp')}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isAlreadyJoined = event.participants.some(p => p.id === user.id)

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>{tc('eventInvitation')}</CardTitle>
                    <CardDescription>
                        {isAlreadyJoined ? tc('alreadyPartOfEvent') : tc('invitedToJoinEvent')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <div className={`w-6 h-6 rounded-full ${event.color} mx-auto mb-2`} />
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(parseISO(event.date), 'EEEE, MMMM d, yyyy', { locale: es })}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1 mt-1">
                            <Users className="h-3 w-3" />
                            <span>{event.participant_count} {event.participant_count === 1 ? tc('participant') : tc('participants')}</span>
                        </p>
                    </div>

                    {/* Participants list */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">{tc('participants')}:</h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {event.participants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                                >
                                    <span>{participant.name}</span>
                                    {participant.id === event.creator_id && (
                                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                            {tc('creator')}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        {isAlreadyJoined ? (
                            <Button onClick={handleGoToApp} className="flex-1">
                                {tc('goToApp')}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleJoin} disabled={isJoining} className="flex-1">
                                    {isJoining ? tc('joining') : tc('joinEvent')}
                                </Button>
                                <Button variant="outline" onClick={handleGoToApp}>
                                    {tc('cancel')}
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 