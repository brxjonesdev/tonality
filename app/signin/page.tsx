import AuthButton from '@/lib/auth/components/auth-button'
import React from 'react'

export default function SignInPage() {
  return (
    <main>
        <h2>Sign In Page</h2>
        <AuthButton mode='sign-in'/>
        <AuthButton mode='sign-out'/>
    </main>
  )
}
