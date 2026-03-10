import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * True when env vars are present. Use for sync null-guards in render logic
 * (e.g. showing "Supabase not configured" UI without awaiting anything).
 */
export const isSupabaseConfigured = !!(url && key)

let _client: SupabaseClient | null = null
let _loading: Promise<SupabaseClient> | null = null

/**
 * Returns the Supabase client, dynamically importing the SDK only on first call.
 * This keeps @supabase/supabase-js out of the initial JS bundle.
 * Returns null when env vars are not configured.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null
  if (_client) return _client
  if (!_loading) {
    _loading = import('@supabase/supabase-js').then(({ createClient }) => {
      _client = createClient(url!, key!)
      return _client
    })
  }
  return _loading
}
