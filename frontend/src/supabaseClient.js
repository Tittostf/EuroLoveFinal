import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jkchphrbvjqcheufeiti.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprY2hwaHJidmpxY2hldWZlaXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTE2NzcsImV4cCI6MjA2NTQyNzY3N30.7Kjvdz_qOGKKAEaTT2UUuQkKavdc_35AjWLpzAx1HMQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
