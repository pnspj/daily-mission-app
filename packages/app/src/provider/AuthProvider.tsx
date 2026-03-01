'use client'

import React, { useEffect } from 'react'
import { getSupabaseClient } from '@daily-mission/api'
import { useAuthStore } from '../store/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setSession = useAuthStore((s) => s.setSession)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // 既存セッションを初期化
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized()
    })

    // セッション変化を購読
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setInitialized])

  return <>{children}</>
}
