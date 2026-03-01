import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Supabase client — null when env vars are not configured.
 * All api.ts functions fall back to mock data when this is null.
 */
export const supabase =
  url && key ? createClient(url, key) : null
