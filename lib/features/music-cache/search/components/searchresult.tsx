"use client"

import Link from "next/link"

export interface ResultItemProps {
  type: 'album' | 'artist' | 'track'
  id: string
  spotifyId: string
  title: string
  albumArtUrl?: string
  albumTitle?: string
  artistName?: string
  slug: string
}




export default function ResultItem(item: ResultItemProps) {
  function generateLink(type: string, slug: string, id: string): string {
    switch (type) {
      case 'album':
        return `/album/${slug}/${id}`
      case 'artist':
        return `/artist/${slug}/${id}`
      case 'track':
        return `/track/${slug}/${id}`
      default:
        return '/'
    }
  }

  return (
    <Link href={generateLink(item.type, item.slug, item.id)}>
    <div className="flex items-center space-x-4 p-2 hover:bg-cyan-100 rounded-md py-2">
      {item.albumArtUrl && (
        <img src={item.albumArtUrl} alt={item.title} className="w-12 h-12 rounded-md" />
      )}
      <div>
        <p className="font-medium">{item.title}</p>
        {item.artistName && <p className="text-sm text-gray-600">{item.artistName}</p>}
        {item.albumTitle && <p className="text-sm text-gray-600">{item.albumTitle}</p>}
      </div>
    </div>
    </Link>
  )
}
