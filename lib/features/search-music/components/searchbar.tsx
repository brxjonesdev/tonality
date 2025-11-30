"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import ResultItem from "./searchresult"
import { spotifySearch } from "@/lib/spotify/search"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced effect
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        setError(null)
        return
      }

      try {
        const result = await spotifySearch(query, "track")
        if (result.error){
          setResults([])
          setError("Sorry, there was an error fetching results for your search.")
        }

        // Example filter
        const filtered = data.filter((item: any) =>
          item.text.toLowerCase().includes(query.toLowerCase())
        )

        setResults(filtered)
      } catch (err) {
        console.error(err)
        setResults([])
      }
    }, 300) // debounce delay

    return () => clearTimeout(handler)
  }, [query])

  const handleClear = () => {
    setQuery("")
    setResults([])
    setError(null)
  }

  const showResults = isFocused && (query.trim() || results.length > 0)

  return (
    <div className="relative w-fit">
      {/* Search Input Container */}
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? "scale-105" : "scale-100"
        }`}
      >
        <div
          className={`absolute inset-0 rounded-xl blur-xl transition-all duration-300 ${
            isFocused
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-100"
              : "bg-gradient-to-r from-blue-500/0 to-purple-500/0 opacity-0"
          }`}
        />

        <div className="relative flex items-center bg-card border border-input rounded-xl shadow-lg transition-all duration-300 focus-within:shadow-xl focus-within:border-primary/50">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors duration-300 pointer-events-none" />

          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-12 py-3.5 bg-transparent text-foreground placeholder-muted-foreground outline-none text-base font-medium transition-all duration-300"
          />

          {error && (<p className="absolute left-12 text-sm text-red-500">{error}</p>)}

          {query && (
            <button
              onClick={handleClear}
              className="mr-4 p-1 hover:bg-muted rounded-lg transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Results Container */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-input rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <ResultItem key={result.id} result={result} index={index} />
              ))}
            </div>
          ) : query.trim() ? (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">
                No results found for "{query}"
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Backdrop Blur */}
      {isFocused && results.length > 0 && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsFocused(false)}
        />
      )}
    </div>
  )
}
