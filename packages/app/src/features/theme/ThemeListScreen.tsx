'use client'

import React from 'react'
import { useThemes } from '@daily-mission/api'
import { Button, ThemeCard } from '@daily-mission/ui'

interface ThemeListScreenProps {
  onSelectTheme: (themeId: string) => void
  onCreateTheme: () => void
  onLogout: () => void
}

export function ThemeListScreen({
  onSelectTheme,
  onCreateTheme,
  onLogout,
}: ThemeListScreenProps) {
  const { data: themes, isLoading, error, refetch } = useThemes()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <h1 className="text-lg font-bold text-gray-900">Daily Mission</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={onCreateTheme}>
              + テーマ作成
            </Button>
            <Button variant="ghost" onClick={onLogout}>
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            <p className="font-medium">テーマの取得に失敗しました</p>
            <p className="mt-1">{error.message}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 underline"
            >
              再試行
            </button>
          </div>
        )}

        {!isLoading && !error && themes && themes.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">🗺️</div>
            <h2 className="text-xl font-bold text-gray-800">冒険を始めよう！</h2>
            <p className="text-gray-500">
              テーマ（目標）を作成して、毎日のミッションを始めましょう。
            </p>
            <Button onClick={onCreateTheme} className="mt-2">
              最初のテーマを作成する
            </Button>
          </div>
        )}

        {!isLoading && themes && themes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              {themes.length} 件のテーマ
            </p>
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onClick={() => onSelectTheme(theme.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
