import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

/** ブラウザ用 Supabase クライアントのシングルトン */
export function getSupabaseClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください',
      )
    }
    client = createClient(url, key)
  }
  return client
}
