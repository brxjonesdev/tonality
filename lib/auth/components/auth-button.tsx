"use client"
import React from 'react'
import { signOut, signIn } from '../utils'

export default function AuthButton({mode}: {mode:"sign-in" | "sign-out"}) {
  return (
    <button onClick={mode === "sign-in" ? signIn : signOut} className='bg-blue-600'>
      {mode === "sign-in" ? "Sign In" : "Sign Out"}
    </button>
  )
}
