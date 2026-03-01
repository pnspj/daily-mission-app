'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@daily-mission/api'
import { ThemeListScreen } from '@daily-mission/app'
import { useAuthStore } from '@daily-mission/app'

export default function HomePage() {
  const router = useRouter()
  const setSession = useAuthStore((s) => s.setSession)

  const handleLogout = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setSession(null)
    router.push('/login')
  }

  return (
    <ThemeListScreen
      onSelectTheme={(themeId) => router.push(`/themes/${themeId}`)}
      onCreateTheme={() => router.push('/themes/new')}
      onLogout={handleLogout}
    />
  )
}
