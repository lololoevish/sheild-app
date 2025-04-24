import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Типы для таблиц
export interface FaceProfile {
  id: string
  name: string
  role: 'student' | 'teacher' | 'staff'
  face_embedding: number[]
  photo_url?: string
  created_at: string
}

export interface HealthEvent {
  id: string
  face_id: string
  is_sick: boolean
  confidence: number
  symptoms: string[]
  temperature?: number
  detected_at: string
}