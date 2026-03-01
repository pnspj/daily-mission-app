'use client'

import { useRouter } from 'next/navigation'
import { ThemeCreateScreen } from '@daily-mission/app'

export default function ThemeNewPage() {
  const router = useRouter()
  return (
    <ThemeCreateScreen
      onSuccess={(themeId) => router.push(`/themes/${themeId}`)}
      onCancel={() => router.back()}
    />
  )
}
