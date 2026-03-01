'use client'

import React, { useState } from 'react'
import { useCreateTheme, ApiError } from '@daily-mission/api'
import { Button } from '@daily-mission/ui'

interface ThemeCreateScreenProps {
  onSuccess: (themeId: string) => void
  onCancel: () => void
}

export function ThemeCreateScreen({ onSuccess, onCancel }: ThemeCreateScreenProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const createTheme = useCreateTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const theme = await createTheme.mutateAsync({
        name,
        description: description || undefined,
      })
      onSuccess(theme.id)
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 403) {
        setError(
          '無料プランのテーマ作成上限（2件）に達しました。プレミアムにアップグレードしてください。',
        )
      } else {
        const msg = e instanceof Error ? e.message : 'テーマの作成に失敗しました'
        setError(msg)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="戻る"
          >
            ← 戻る
          </button>
          <h1 className="text-lg font-bold text-gray-900">テーマ作成</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                テーマ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                  focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="例：英語学習、運動習慣"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                説明（任意）
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                  focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="このテーマで達成したいことを書いてみよう"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                loading={createTheme.isPending}
                className="flex-1"
              >
                テーマを作成
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
