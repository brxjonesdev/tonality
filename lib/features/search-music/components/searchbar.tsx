"use client"
import { useEffect, useId, useState } from 'react'
import { Input } from '@/lib/components/shared/input'
import { Label } from '@/lib/components/shared/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/shared/select'
import { songTitleRandomizer } from './placeholders'
import ResultItem, { ResultItemProps } from './searchresult'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { Button } from "@/lib/components/shared/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/lib/components/shared/empty"
export const sampleResults: ResultItemProps[] = [
  {
    type: "track",
    id: "1",
    spotifyId: "3xXBBaG7w7xpT9V4kWQfJH",
    title: "As It Was",
    albumArtUrl: "https://i.scdn.co/image/as_it_was.jpg",
    albumTitle: "Harry's House",
    artistName: "Harry Styles"
  },
  {
    type: "track",
    id: "2",
    spotifyId: "7oORiWnEWYrD1jlNbRenYe",
    title: "Anti-Hero",
    albumArtUrl: "https://i.scdn.co/image/midnights.jpg",
    albumTitle: "Midnights",
    artistName: "Taylor Swift"
  },
  {
    type: "album",
    id: "3",
    spotifyId: "0bUTHlWbkSQysoM3VsWldT",
    title: "SOS",
    albumArtUrl: "https://i.scdn.co/image/sos_album.jpg",
    artistName: "SZA"
  },
  {
    type: "album",
    id: "4",
    spotifyId: "5C0YLr4OoK8jjY26TH9e3Z",
    title: "RENAISSANCE",
    albumArtUrl: "https://i.scdn.co/image/renaissance.jpg",
    artistName: "Beyoncé"
  },
  {
    type: "artist",
    id: "5",
    spotifyId: "6qqNVTkY8uBg9cP3Jd7DAH",
    title: "Billie Eilish"
  },
  {
    type: "artist",
    id: "6",
    spotifyId: "1uNFoZAHBGtllmzznpCI3s",
    title: "Justin Bieber"
  },
  {
    type: "track",
    id: "7",
    spotifyId: "0V3wPSX9ygBnCm8psDIegu",
    title: "Flowers",
    albumArtUrl: "https://i.scdn.co/image/flowers_album.jpg",
    albumTitle: "Endless Summer Vacation",
    artistName: "Miley Cyrus"
  },
  {
    type: "track",
    id: "8",
    spotifyId: "1Qrg8KqiBpW07V7PNxwwwL",
    title: "Kill Bill",
    albumArtUrl: "https://i.scdn.co/image/sos_album.jpg",
    albumTitle: "SOS",
    artistName: "SZA"
  },
  {
    type: "album",
    id: "9",
    spotifyId: "6s84u2TUpR3wdUv4NgKA2j",
    title: "HIT PARADE",
    albumArtUrl: "https://i.scdn.co/image/hit_parade.jpg",
    artistName: "Troye Sivan"
  },
  {
    type: "artist",
    id: "10",
    spotifyId: "66CXWjxzNUsdJxJ2JdwvnR",
    title: "Ariana Grande"
  }
];



export default function SearchBar() {
  const id = useId()
  const [searchMode, setSearchMode] = useState<'album' | 'artist' | 'track'>('track')
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<ResultItemProps[]>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  

  useEffect(()=> {
    if (!debouncedSearchQuery) return;
      const filteredResult = sampleResults.filter(item => 
        item.type === searchMode && 
        item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setResults(filteredResult);
    

  }, [debouncedSearchQuery, searchMode])


//   const {
//   data: results = [],
//   isLoading,
//   isError
// } = useQuery({
//   queryKey: ['search', searchMode, debouncedSearchQuery],
//   queryFn: async () => {
//     if (!debouncedSearchQuery) return [];
//     const response = spotifySearch(debouncedSearchQuery, searchMode);
//     console.log("Fetched results:", response);
//   },
//   enabled: debouncedSearchQuery.length > 0, // do NOT run when input empty
// })



  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Search</Label>
      <div className='flex rounded-md shadow-xs'>
        <Select defaultValue='track' onValueChange={(value) => setSearchMode(value as 'album' | 'artist' | 'track')}>
          <SelectTrigger id={id} className='rounded-r-none shadow-none focus-visible:z-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='track' className='pr-2 [&_svg]:hidden'>
              Track
            </SelectItem>
            <SelectItem value='album' className='pr-2 [&_svg]:hidden'>
              Album
            </SelectItem>
            <SelectItem value='artist' className='pr-2 [&_svg]:hidden'>
              Artist
            </SelectItem>
          </SelectContent>
        </Select>
        <Input 
        id={id} 
        type='text' 
        placeholder={songTitleRandomizer()} 
        className='-ms-px rounded-l-none shadow-none'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        suppressHydrationWarning />
      </div>
      <div>
        {debouncedSearchQuery && results.length === 0 && (
          <div className="animate-in fade-in-50 duration-300">
           <Empty className="from-cyan-100 to-blue-300 h-full bg-gradient-to-b from-20%">
     <EmptyHeader>
  <EmptyTitle>Uh… Hello?</EmptyTitle>
  <EmptyDescription>
    We searched everywhere...<br/> Nothing matched &ldquo;{debouncedSearchQuery}&quot;.  
    Not even in the weird basement of Spotify.
  </EmptyDescription>
</EmptyHeader>
    </Empty>
          </div>
        )}

        {debouncedSearchQuery && results.length > 0 && (
          <div className="animate-in fade-in-50 duration-300">
            {results.map(item => (
              <ResultItem key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

