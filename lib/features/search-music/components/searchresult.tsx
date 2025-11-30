"use client"

import { useState } from "react"

interface Result {
  id: string
  title: string
  category: string
  description: string
  icon: string
}

interface ResultItemProps {
  result: Result
  index: number
}

export default function ResultItem({ result, index }: ResultItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="px-4 py-3 border-b border-input last:border-b-0 transition-all duration-200 animate-in fade-in slide-in-from-left-4"
      style={{
        animationDelay: `${index * 40}ms`,
        animationFillMode: "both",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
          isHovered ? "bg-muted/80 scale-102 pl-4" : "bg-transparent hover:bg-muted/40"
        }`}
      >
        <span className="text-2xl flex-shrink-0">{result.icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground truncate">{result.title}</p>
            <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full flex-shrink-0">
              {result.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{result.description}</p>
        </div>

        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 transition-all duration-300 ${
            isHovered ? "bg-primary/20 scale-110" : "opacity-0"
          }`}
        >
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
