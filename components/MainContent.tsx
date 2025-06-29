"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { CalendarEvent } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, User } from 'lucide-react'
import { createEvent, joinEvent, getAllEvents, getUserEvents } from '@/lib/events'
import { CalendarTab } from '@/components/tabs/CalendarTab'
import { MyEventsTab } from '@/components/tabs/MyEventsTab'
import { useToast } from '@/hooks/use-toast'

export function MainContent() {
    const { user, isLoading } = useAuth()
    const { t } = useTranslation()
    const [showLogin, setShowLogin] = useState(true)
    const [allEvents, setAllEvents] = useState<CalendarEvent[]>([])
    const [userEvents, setUserEvents] = useState<CalendarEvent[]>([])
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
                title: t('errorLoadingEvents'),
                description: t('failedToLoadEvents'),
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
                title: t('eventCreated'),
                description: `"${title}" ${t('eventCreatedDesc')}`,
            })

            // Refresh events
            await loadEvents()
        } else {
            // Check if error is a translation key
            const errorMessage = result.error && result.error.includes('oneEventPerDay')
                ? t('oneEventPerDay')
                : result.error || t('somethingWentWrong')

            const errorDescription = result.error && result.error.includes('oneEventPerDay')
                ? t('oneEventPerDayDesc')
                : errorMessage

            toast({
                title: result.error && result.error.includes('oneEventPerDay') ? t('oneEventPerDay') : t('failedToCreateEvent'),
                description: errorDescription,
                variant: "destructive",
            })
        }
    }

    const handleEventJoin = async (eventId: string) => {
        if (!user) return

        const result = await joinEvent(eventId, user.id)

        if (result.success) {
            toast({
                title: t('joinedEvent'),
                description: t('joinedEventDesc'),
            })

            // Refresh events
            await loadEvents()
        } else {
            toast({
                title: t('failedToJoinEvent'),
                description: result.error || t('somethingWentWrong'),
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">{t('loading')}</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="w-full max-w-sm mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('appName')}</h1>
                        <p className="text-muted-foreground text-sm">{t('appDescription')}</p>
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
        <main className="min-h-screen p-4">
            <div className="w-full max-w-4xl mx-auto">
                <Tabs defaultValue="calendar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="calendar" className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('calendar')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="events" className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('myEvents')}</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar" className="mt-4">
                        <CalendarTab
                            events={allEvents}
                            onEventCreate={handleEventCreate}
                            onEventJoin={handleEventJoin}
                            currentUserId={user.id}
                        />
                    </TabsContent>

                    <TabsContent value="events" className="mt-4">
                        <MyEventsTab
                            userEvents={userEvents}
                            isLoadingEvents={isLoadingEvents}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
} 