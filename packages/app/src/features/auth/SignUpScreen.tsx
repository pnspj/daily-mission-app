'use client'

import React, { useState } from 'react'
import { getSupabaseClient } from '@daily-mission/api'
import { Button } from '@daily-mission/ui'

interface SignUpScreenProps {
  onSignUpSuccess: () => void
  onGoToLogin: () => void
}

export function SignUpScreen({ onSignUpSuccess, onGoToLogin }: SignUpScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      const { error, data } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      // メール確認が不要な場合（ローカル開発）は自動ログイン
      if (data.session) {
        onSignUpSuccess()
      } else {
        setSuccess(true)
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'サインアップに失敗しました'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center space-y-4">
          <div className="text-4xl">📧</div>
          <h2 className="text-xl font-bold text-gray-900">確認メールを送信しました</h2>
          <p className="text-sm text-gray-500">
            {email} に確認メールを送りました。リンクをクリックしてアカウントを有効化してください。
          </p>
          <Button variant="ghost" onClick={onGoToLogin} className="w-full">
            ログインに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="text-4xl">⚔️</div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">アカウント作成</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daily Mission で冒険を始めよう
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
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
              パスワード（6文字以上）
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full py-2.5">
            アカウント作成
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          すでにアカウントをお持ちの方は{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  )
}
