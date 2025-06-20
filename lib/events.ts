import { supabase } from './supabase'
import { Event } from '@/components/calendar/Calendar'

export interface CreateEventData {
  title: string
  date: string
  creator_id: string
  color?: string
}

const eventColors = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-red-500',
  'bg-yellow-500'
]

export async function createEvent(data: CreateEventData): Promise<{ success: boolean; event?: Event; error?: string }> {
  try {
    // Assign random color if not provided
    const color = data.color || eventColors[Math.floor(Math.random() * eventColors.length)]
    
    // Create the event
    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          title: data.title,
          date: data.date,
          creator_id: data.creator_id,
          color: color
        }
      ])
      .select('*')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Automatically join the creator to the event
    const { error: joinError } = await supabase
      .from('event_participants')
      .insert([
        {
          event_id: event.id,
          user_id: data.creator_id
        }
      ])

    if (joinError) {
      console.error('Failed to join creator to event:', joinError)
    }

    // Get the event with participant data
    const fullEvent = await getEventWithParticipants(event.id)
    
    return { 
      success: true, 
      event: fullEvent || {
        ...event,
        participant_count: 1,
        participants: []
      }
    }
  } catch (error) {
    return { success: false, error: 'Failed to create event' }
  }
}

export async function joinEvent(eventId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user is already joined
    const { data: existing, error: checkError } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      return { success: false, error: 'Already joined to this event' }
    }

    // Join the event
    const { error } = await supabase
      .from('event_participants')
      .insert([
        {
          event_id: eventId,
          user_id: userId
        }
      ])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to join event' }
  }
}

export async function getEventWithParticipants(eventId: string): Promise<Event | null> {
  try {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return null
    }

    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('event_participants')
      .select(`
        user_id,
        users (
          id,
          name,
          color
        )
      `)
      .eq('event_id', eventId)

    if (participantsError) {
      console.error('Failed to fetch participants:', participantsError)
      return {
        ...event,
        participant_count: 0,
        participants: []
      }
    }

    const participantList = participants?.map(p => ({
      id: (p as any).users?.id || '',
      name: (p as any).users?.name || 'Unknown',
      color: (p as any).users?.color || 'bg-gray-500'
    })) || []

    return {
      ...event,
      participant_count: participantList.length,
      participants: participantList
    }
  } catch (error) {
    console.error('Failed to get event with participants:', error)
    return null
  }
}

export async function getUserEvents(userId: string): Promise<{ success: boolean; events?: Event[]; error?: string }> {
  try {
    // Get events where user is a participant
    const { data: participantEvents, error: participantError } = await supabase
      .from('event_participants')
      .select(`
        events (
          id,
          title,
          date,
          color,
          creator_id,
          created_at
        )
      `)
      .eq('user_id', userId)

    if (participantError) {
      return { success: false, error: participantError.message }
    }

    // Get full event data with participants for each event
    const eventIds = participantEvents?.map(pe => (pe as any).events?.id).filter(Boolean) || []
    const events: Event[] = []

    for (const eventId of eventIds) {
      const fullEvent = await getEventWithParticipants(eventId)
      if (fullEvent) {
        events.push(fullEvent)
      }
    }

    return { success: true, events }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user events' }
  }
}

export async function getAllEvents(): Promise<{ success: boolean; events?: Event[]; error?: string }> {
  try {
    // Get all events
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get full event data with participants for each event
    const fullEvents: Event[] = []
    
    for (const event of events || []) {
      const fullEvent = await getEventWithParticipants(event.id)
      if (fullEvent) {
        fullEvents.push(fullEvent)
      }
    }

    return { success: true, events: fullEvents }
  } catch (error) {
    return { success: false, error: 'Failed to fetch events' }
  }
} 