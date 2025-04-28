import { createClient } from '@supabase/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

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
  symptom: string[]
  temperature?: number
  detected_at: string
}

export async function getFaceProfile(faceEmbedding: number[]) {
  const { data, error } = await supabase
    .from('face_profiles')
    .select('*')
    .contains('face_embedding', faceEmbedding)
    .limit(1)

  if (error) throw error
  return data?.[0] as FaceProfile | null
}

export async function createHealthEvent(event: Omit<HealthEvent, 'id' | 'detected_at'>) {
  const { data, error } = await supabase
    .from('health_events')
    .insert([{
      ...event,
      detected_at: new Date().toISOString()
    }])
    .select()

  if (error) throw error
  return data?.[0] as HealthEvent
}

export async function getHealthEvents(faceId: string) {
  const { data, error } = await supabase
    .from('health_events')
    .select('*')
    .eq('face_id', faceId)
    .order('detected_at', { ascending: false })

  if (error) throw error
  return data as HealthEvent[]
}