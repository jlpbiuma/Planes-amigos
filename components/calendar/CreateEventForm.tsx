"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { tc } from '@/lib/translations'

interface CreateEventFormProps {
    selectedDate: string
    onEventCreate: (title: string, date: string) => void
    onCancel: () => void
}

export function CreateEventForm({ selectedDate, onEventCreate, onCancel }: CreateEventFormProps) {
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsLoading(true)
        await onEventCreate(title.trim(), selectedDate)
        setIsLoading(false)
        setTitle('')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                        {tc('eventTitle')}
                    </label>
                    <Input
                        id="title"
                        placeholder={tc('enterEventTitle')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{tc('date')}</label>
                    <div className="text-sm text-muted-foreground">
                        {selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy', { locale: es }) : tc('noDateSelected')}
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button type="submit" disabled={isLoading || !title.trim()}>
                        {isLoading ? tc('creating') : tc('createEvent')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        {tc('cancel')}
                    </Button>
                </div>
            </div>
        </form>
    )
} 