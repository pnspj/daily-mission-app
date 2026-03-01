'use client'

import { useRouter } from 'next/navigation'
import { LoginScreen } from '@daily-mission/app'

export default function LoginPage() {
  const router = useRouter()
  return (
    <LoginScreen
      onLoginSuccess={() => router.push('/')}
      onGoToSignUp={() => router.push('/signup')}
    />
  )
}
