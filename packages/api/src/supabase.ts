import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

/**
 * ブラウザ用 Supabase クライアントのシングルトン
 * createBrowserClient を使うことでセッションが cookie に保存され、
 * Next.js middleware (createServerClient) がセッションを認識できる
 */
export function getSupabaseClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください',
      )
    }
    client = createBrowserClient(url, key)
  }
  return client
}
