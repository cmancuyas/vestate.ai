// types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          role?: string | null
          created_at?: string
        }
        Relationships: []
      }
      // Add more tables here
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
