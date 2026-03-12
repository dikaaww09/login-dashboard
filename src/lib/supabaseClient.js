import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key:", supabaseKey ? "ADA" : "TIDAK ADA")

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Environment variables SUPABASE tidak ditemukan!")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
