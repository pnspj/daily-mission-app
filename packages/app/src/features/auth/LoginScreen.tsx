'use client'

import React, { useState } from 'react'
import { getSupabaseClient } from '@daily-mission/api'
import { Button } from '@daily-mission/ui'

interface LoginScreenProps {
  onLoginSuccess: () => void
  onGoToSignUp: () => void
}

export function LoginScreen({ onLoginSuccess, onGoToSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onLoginSuccess()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'ログインに失敗しました'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="text-4xl">⚔️</div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Daily Mission</h1>
          <p className="mt-1 text-sm text-gray-500">ログインしてミッションを始めよう</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full py-2.5">
            ログイン
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          アカウントをお持ちでない方は{' '}
          <button
            type="button"
            onClick={onGoToSignUp}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            サインアップ
          </button>
        </p>
      </div>
    </div>
  )
}
