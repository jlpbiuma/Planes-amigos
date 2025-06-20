import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          password_hash: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          password_hash: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          password_hash?: string
          color?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          creator_id: string
          created_at: string
          date: string
          color: string
        }
        Insert: {
          id?: string
          title: string
          creator_id: string
          created_at?: string
          date: string
          color?: string
        }
        Update: {
          id?: string
          title?: string
          creator_id?: string
          created_at?: string
          date?: string
          color?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          joined_at?: string
        }
      }
    }
  }
} 