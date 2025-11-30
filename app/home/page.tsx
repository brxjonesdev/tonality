import React from 'react'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Homepage() {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
  if (!session || !session.user) {
    redirect("/signin")
  }
  console.log("Session on homepage:", session)
  return (
    <div>Homepage</div>
  )
}
