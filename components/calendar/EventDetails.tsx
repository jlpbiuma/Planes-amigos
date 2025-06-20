"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Users, Share2, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Event } from './Calendar'
import { tc } from '@/lib/translations'

interface EventDetailsProps {
    event: Event
    onJoin: () => void
    currentUserId: string
}

export function EventDetails({ event, onJoin, currentUserId }: EventDetailsProps) {
    const [isJoining, setIsJoining] = useState(false)
    const [shareUrl, setShareUrl] = useState('')

    const isUserJoined = event.participants.some(p => p.id === currentUserId)
    const isCreator = event.creator_id === currentUserId

    const handleJoin = async () => {
        setIsJoining(true)
        await onJoin()
        setIsJoining(false)
    }

    const handleShare = () => {
        // Create invitation URL with auto-authentication
        const inviteUrl = `${window.location.origin}/invite/${event.id}`
        navigator.clipboard.writeText(inviteUrl)
        setShareUrl(inviteUrl)

        // Show success message briefly
        setTimeout(() => setShareUrl(''), 3000)
    }

    return (
        <div className="space-y-4">
            {/* Event Info */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {format(parseISO(event.date), 'EEEE, MMMM d, yyyy', { locale: es })}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${event.color}`} />
                    <span className="text-sm text-muted-foreground">{tc('eventColor')}</span>
                </div>
            </div>

            {/* Participants */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">
                        {tc('participants')} ({event.participant_count})
                    </span>
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto">
                    {event.participants.map((participant) => (
                        <div
                            key={participant.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                            <span className="text-sm">{participant.name}</span>
                            {participant.id === event.creator_id && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                    {tc('creator')}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
                {!isUserJoined && !isCreator && (
                    <Button onClick={handleJoin} disabled={isJoining} className="flex-1">
                        {isJoining ? tc('joining') : tc('joinEvent')}
                    </Button>
                )}

                {(isUserJoined || isCreator) && (
                    <Button
                        variant="outline"
                        onClick={handleShare}
                        className="flex items-center space-x-2"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>{tc('shareInvite')}</span>
                    </Button>
                )}
            </div>

            {shareUrl && (
                <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">
                        {tc('invitationLinkCopied')}
                    </p>
                    <code className="text-xs break-all bg-background p-2 rounded border">
                        {shareUrl}
                    </code>
                </div>
            )}

            {isUserJoined && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                        ✓ {tc('alreadyJoined')}
                    </p>
                </div>
            )}
        </div>
    )
} 