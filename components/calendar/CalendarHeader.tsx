"use client"

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarHeaderProps } from '@/types'

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6 px-2">
            <Button variant="ghost" size="icon" onClick={onPrevMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <Button variant="ghost" size="icon" onClick={onNextMonth}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
} 