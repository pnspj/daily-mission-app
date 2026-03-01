'use client'

import { useRouter } from 'next/navigation'
import { SignUpScreen } from '@daily-mission/app'

export default function SignUpPage() {
  const router = useRouter()
  return (
    <SignUpScreen
      onSignUpSuccess={() => router.push('/')}
      onGoToLogin={() => router.push('/login')}
    />
  )
}
