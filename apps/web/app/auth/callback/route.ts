import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// OAuth callback: Supabase redirects here after authentication.
// We forward the code to the root page where createBrowserClient handles
// the PKCE exchange client-side via detectSessionInUrl.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    return NextResponse.redirect(`${origin}/?code=${code}`)
  }

  return NextResponse.redirect(`${origin}/login`)
}
