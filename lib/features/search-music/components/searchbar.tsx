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
import { formatSpotifyResults, spotifySearch } from '@/lib/spotify/utils'




export default function SearchBar() {
  const id = useId()
  const [searchMode, setSearchMode] = useState<'album' | 'artist' | 'track'>('track')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)



 const {
  data: results = [],
  isLoading,
  isError
} = useQuery({
  queryKey: ['search', debouncedSearchQuery, searchMode],
  queryFn: async () => {
    if (!debouncedSearchQuery) return [];
    const response = await spotifySearch(debouncedSearchQuery, searchMode);

    if (!response.ok) {
      throw new Error("Spotify Search Error");
    }

    return formatSpotifyResults(response.data, searchMode);
  },
  enabled: debouncedSearchQuery.length > 0,
});




  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Search</Label>
      <div className="flex rounded-md shadow-xs ">
  <Select
    defaultValue="track"
    onValueChange={(value) =>
      setSearchMode(value as "album" | "artist" | "track")
    }
  >
    <SelectTrigger id={id} className="rounded-r-none shadow-none focus-visible:z-1">
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="track" className="pr-2 [&_svg]:hidden">
        Track
      </SelectItem>
      <SelectItem value="album" className="pr-2 [&_svg]:hidden">
        Album
      </SelectItem>
      <SelectItem value="artist" className="pr-2 [&_svg]:hidden">
        Artist
      </SelectItem>
    </SelectContent>
  </Select>

  <div className="relative flex-1">
    <Input
      id={id}
      type="text"
      placeholder={songTitleRandomizer()}
      className="rounded-l-none shadow-none pr-10" // space for button
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      suppressHydrationWarning
    />

    {searchQuery.length > 0 && (
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        onClick={() => setSearchQuery("")}
      >
        ✕
      </Button>
    )}
  </div>
</div>

      <div>

  {isLoading && debouncedSearchQuery.length > 0 && (
    <div className="animate-in fade-in-50 duration-300">
      <p>Loading results...</p>
    </div>
  )}

  
  {!isLoading &&
    debouncedSearchQuery.length > 0 &&
    results.length === 0 && (
      <div className="animate-in fade-in-50 duration-300">
        <Empty className="from-cyan-100 to-blue-300 h-full bg-gradient-to-b from-20%">
          <EmptyHeader>
            <EmptyTitle>Uh… Hello?</EmptyTitle>
            <EmptyDescription>
              We searched everywhere...<br />Nothing matched &ldquo;
              {debouncedSearchQuery}&rdquo;.<br />
              Not even in the weird basement of Spotify.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )}

  {!isLoading && results.length > 0 && (
    <div className="animate-in fade-in-50 duration-300">
      {results.map((item) => (
        <ResultItem key={item.id} {...item} />
      ))}
    </div>
  )}


  {isError && (
    <div className="animate-in fade-in-50 duration-300">
      <p>Error fetching results. Please try again later.</p>
    </div>
  )}
</div>

    </div>
  )
}

