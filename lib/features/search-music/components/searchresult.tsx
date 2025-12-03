"use client"
export interface ResultItemProps {
  type: 'album' | 'artist' | 'track'
  id: string
  spotifyId: string
  title: string
  albumArtUrl?: string
  albumTitle?: string
  artistName?: string
}




export default function ResultItem(item: ResultItemProps) {
  console.log("Rendering ResultItem:", item);

  return (
    <div className="flex items-center space-x-4 p-2 hover:bg-gray-200 rounded-md">
      {item.albumArtUrl && (
        <img src={item.albumArtUrl} alt={item.title} className="w-12 h-12 rounded-md" />
      )}
      <div>
        <p className="font-medium">{item.title}</p>
        {item.artistName && <p className="text-sm text-gray-600">{item.artistName}</p>}
        {item.albumTitle && <p className="text-sm text-gray-600">{item.albumTitle}</p>}
      </div>
    </div>
  )
}
