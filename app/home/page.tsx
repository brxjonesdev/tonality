import React from 'react'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import SearchBar from '@/lib/features/search-music/components/searchbar'

export default async function Homepage() {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
  if (!session || !session.user) {
    redirect("/signin")
  }
  return (
    <section className='max-w-6xl mx-auto p-4'>
      <SearchBar/>
    </section>
  )
}
