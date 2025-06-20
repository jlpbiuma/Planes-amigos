"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Calendar, Event } from '@/components/calendar/Calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { LogOut, Calendar as CalendarIcon, User, Moon, Sun, Languages, Settings } from 'lucide-react'
import { createEvent, joinEvent, getAllEvents, getUserEvents } from '@/lib/events'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { UserProfile } from '@/components/profile/UserProfile'
import { tc } from '@/lib/translations'

// Simple toast implementation for now
const useToast = () => ({
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
        console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`)
    }
})

export function MainApp() {
    const { user, logout, isLoading } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { language, toggleLanguage } = useLanguage()
    const [showLogin, setShowLogin] = useState(true)
    const [allEvents, setAllEvents] = useState<Event[]>([])
    const [userEvents, setUserEvents] = useState<Event[]>([])
    const [isLoadingEvents, setIsLoadingEvents] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
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

    const handleLogout = () => {
        logout()
        setAllEvents([])
        setUserEvents([])
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">{tc('loading')}</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
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
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-card p-4 backdrop-blur-sm bg-card/95">
                <div className="w-full max-w-none px-2 flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl font-semibold truncate">{tc('appName')}</h1>
                    <div className="flex items-center space-x-1">
                        <div className="hidden sm:flex items-center space-x-2 mr-2">
                            <div className={`w-6 h-6 rounded-full ${user.color}`} />
                            <span className="text-sm text-muted-foreground truncate max-w-20">{tc('hi')}, {user.name}!</span>
                        </div>
                        <div className="sm:hidden flex items-center mr-2">
                            <div className={`w-6 h-6 rounded-full ${user.color}`} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowProfile(true)} className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleLanguage} title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'} className="h-8 w-8">
                            <Languages className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
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
                        <Calendar
                            events={allEvents}
                            onEventCreate={handleEventCreate}
                            onEventJoin={handleEventJoin}
                            currentUserId={user.id}
                        />
                    </TabsContent>

                    <TabsContent value="my-events">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">{tc('myEvents')}</h2>

                            {isLoadingEvents ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                    <p className="text-sm text-muted-foreground">{tc('loading')}</p>
                                </div>
                            ) : userEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">{tc('noEventsJoined')}</p>
                                    <p className="text-sm text-muted-foreground">{tc('createOrJoinEvents')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userEvents.map((event) => (
                                        <div key={event.id} className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-4 h-4 rounded-full ${event.color}`} />
                                                    <div>
                                                        <h3 className="font-medium">{event.title}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric'
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* User Profile Dialog */}
            {showProfile && (
                <UserProfile
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                />
            )}
        </div>
    )
} 