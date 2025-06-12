"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, X, Loader2, Music, BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface SearchResult {
  id: string
  title: string
  type: "song" | "maloof"
  image?: string
  subtitle?: string
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog(props: SearchDialogProps) {
  // Avoid destructuring props
  const open = props.open
  const onOpenChange = props.onOpenChange

  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isFocused, setIsFocused] = useState(false)

  // Reset search when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("")
      setResults([])
      // Auto-focus the input when dialog opens
      setTimeout(() => {
        setIsFocused(true)
      }, 100)
    } else {
      setIsFocused(false)
    }
  }, [open])

  // Mock search function
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)

    if (searchQuery.length > 1) {
      setIsLoading(true)

      // Simulate API call delay
      setTimeout(() => {
        // Mock results based on query
        const mockResults: SearchResult[] = [
          {
            id: "1",
            title: "Ya Bladi",
            type: "song" as "song" | "maloof",
            subtitle: "Mohammed Hassan",
            image: "/libyan-singer-portrait.png",
          },
          {
            id: "2",
            title: "Layla",
            type: "song" as "song" | "maloof",
            subtitle: "Ahmed Ali",
            image: "/libyan-folk-singer.png",
          },
          {
            id: "1",
            title: "Al-Andalusi",
            type: "maloof" as "song" | "maloof",
            subtitle: "Nawba",
            image: "/generic-music-sheet.png",
          },
        ].filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        setResults(mockResults)
        setIsLoading(false)
      }, 500)
    } else {
      setResults([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 gap-0 bg-black border border-gray-800 max-h-[90vh] overflow-hidden"
        closeButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col h-full">
          {/* Search header with blue highlight when focused */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <div className={`relative flex-1 ${isFocused ? "ring-2 ring-amber-500 rounded-full" : ""}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
              <input
                type="text"
                placeholder="Search music library..."
                className={`w-full rounded-full border ${
                  isFocused ? "border-amber-500 bg-amber-500/10" : "border-gray-800 bg-gray-900"
                } py-3 pl-10 pr-4 outline-none text-base transition-colors duration-300`}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
              />
              {query && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
                  onClick={() => handleSearch("")}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
              </div>
            )}

            {/* Empty state with quick links */}
            {!isLoading && query.length <= 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-amber-500">Quick Links</h3>
                <div className="grid gap-2">
                  <Link
                    href="/library/libyan-songs"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Music className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Libyan Songs</p>
                      <p className="text-sm text-gray-400">Browse traditional Libyan songs</p>
                    </div>
                  </Link>
                  <Link
                    href="/library/maloof"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Maloof</p>
                      <p className="text-sm text-gray-400">Explore Maloof entries</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Results */}
            {!isLoading && query.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-amber-500">
                  {results.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}
                </h3>

                {results.length > 0 ? (
                  <div className="grid gap-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/library/${result.type === "song" ? "libyan-songs" : "maloof"}/${result.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors"
                          onClick={() => onOpenChange(false)}
                        >
                          <div className="h-12 w-12 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={result.image || "/placeholder.svg"}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{result.title}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              {result.type === "song" ? (
                                <Music className="h-3 w-3 inline" />
                              ) : (
                                <BookOpen className="h-3 w-3 inline" />
                              )}
                              <span>{result.subtitle}</span>
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No results found. Try a different search term.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
