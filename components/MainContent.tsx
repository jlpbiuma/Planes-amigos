"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Event } from '@/components/calendar/Calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, User } from 'lucide-react'
import { createEvent, joinEvent, getAllEvents, getUserEvents } from '@/lib/events'
import { CalendarTab } from '@/components/tabs/CalendarTab'
import { MyEventsTab } from '@/components/tabs/MyEventsTab'
import { tc } from '@/lib/translations'

// Simple toast implementation for now
const useToast = () => ({
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
        console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`)
    }
})

export function MainContent() {
    const { user, isLoading } = useAuth()
    const [showLogin, setShowLogin] = useState(true)
    const [allEvents, setAllEvents] = useState<Event[]>([])
    const [userEvents, setUserEvents] = useState<Event[]>([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (user) {
            loadEvents()
        }
    }, [user])

    const loadEvents = async () => {
        if (!user) return

        setIsLoadingEvents(true)

        try {
            const [allEventsResult, userEventsResult] = await Promise.all([
                getAllEvents(),
                getUserEvents(user.id)
            ])

            if (allEventsResult.success && allEventsResult.events) {
                setAllEvents(allEventsResult.events)
            }

            if (userEventsResult.success && userEventsResult.events) {
                setUserEvents(userEventsResult.events)
            }
        } catch (error) {
            toast({
                title: tc('errorLoadingEvents'),
                description: tc('failedToLoadEvents'),
                variant: "destructive",
            })
        }

        setIsLoadingEvents(false)
    }

    const handleEventCreate = async (title: string, date: string) => {
        if (!user) return

        const result = await createEvent({
            title,
            date,
            creator_id: user.id
        })

        if (result.success && result.event) {
            toast({
                title: tc('eventCreated'),
                description: `"${title}" ${tc('eventCreatedDesc')}`,
            })

            // Refresh events
            await loadEvents()
        } else {
            toast({
                title: tc('failedToCreateEvent'),
                description: result.error || tc('somethingWentWrong'),
                variant: "destructive",
            })
        }
    }

    const handleEventJoin = async (eventId: string) => {
        if (!user) return

        const result = await joinEvent(eventId, user.id)

        if (result.success) {
            toast({
                title: tc('joinedEvent'),
                description: tc('joinedEventDesc'),
            })

            // Refresh events
            await loadEvents()
        } else {
            toast({
                title: tc('failedToJoinEvent'),
                description: result.error || tc('somethingWentWrong'),
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">{tc('loading')}</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="w-full max-w-sm mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{tc('appName')}</h1>
                        <p className="text-muted-foreground text-sm">{tc('appDescription')}</p>
                    </div>

                    {showLogin ? (
                        <LoginForm onToggleForm={() => setShowLogin(false)} />
                    ) : (
                        <RegisterForm onToggleForm={() => setShowLogin(true)} />
                    )}
                </div>
            </main>
        )
    }

    return (
        <main className="w-full p-4">
            <Tabs defaultValue="calendar" className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="calendar" className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{tc('calendar')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="my-events" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{tc('myEvents')}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                    <CalendarTab
                        events={allEvents}
                        onEventCreate={handleEventCreate}
                        onEventJoin={handleEventJoin}
                        currentUserId={user.id}
                    />
                </TabsContent>

                <TabsContent value="my-events">
                    <MyEventsTab
                        userEvents={userEvents}
                        isLoadingEvents={isLoadingEvents}
                    />
                </TabsContent>
            </Tabs>
        </main>
    )
} 