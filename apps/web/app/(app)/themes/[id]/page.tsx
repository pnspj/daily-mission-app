'use client'

import { useRouter, useParams } from 'next/navigation'
import { DailyCheckInScreen } from '@daily-mission/app'

export default function ThemeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const themeId = params.id as string

  return (
    <DailyCheckInScreen
      themeId={themeId}
      onBack={() => router.push('/')}
    />
  )
}
