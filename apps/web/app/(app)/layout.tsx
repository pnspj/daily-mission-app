'use client'

import React from 'react'
import { useAuthStore } from '@daily-mission/app'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { initialized, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login')
    }
  }, [initialized, user, router])

  // 初期化前はローディング表示
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-pulse">⚔️</div>
          <p className="text-gray-500 text-sm">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 未認証（middleware でリダイレクトされるが念のため）
  if (!user) return null

  return <>{children}</>
}
