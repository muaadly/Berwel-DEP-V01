"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LibyanSongsTable } from "@/components/libyan-songs-table"
import { SingerFilter } from "@/components/singer-filter"
import { SongTypeFilter } from "@/components/song-type-filter"
import { CollapsibleFilter } from "@/components/collapsible-filter"
import { FilterBadge } from "@/components/filter-badge"
import { Button } from "@/components/ui/button"

// Mapping for English categories to Arabic
const categoryMap: Record<string, string> = {
  bob: "بوب",
  heritage: "تراث",
  popular: "شعبي",
  "libyan-tarab": "طرب ليبي",
  maloof: "مالوف",
  muwashahat: "موشحات",
  patriotic: "وطنيات",
}

interface Singer {
  name: string;
  imageName: string;
}

interface Song {
  number: string | number
  name: string
  singer: string
  category: string
  play: string
  imageName: string;
}

export default function LibyanSongsPage() {
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const [uniqueSingers, setUniqueSingers] = useState<Singer[]>([])
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSinger, setSelectedSinger] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/libyan-songs")
      .then((res) => res.json())
      .then((data) => {
        setAllSongs(data.songs);
        setUniqueSingers(data.uniqueSingers);
        setUniqueCategories(data.uniqueCategories);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load data.")
        setLoading(false)
      })
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSingerFilter = (singer: string | null) => {
    setSelectedSinger(singer)
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedSinger(null)
    setSelectedType(null)
  }

  const getSingerName = (name: string) => name; // Singers names are already in Arabic

  const getTypeName = (id: string) => categoryMap[id] || id;

  const hasActiveFilters = selectedSinger || selectedType || searchQuery;

  const filteredSongs = useMemo(() => {
    let filtered = allSongs;

    if (searchQuery) {
      filtered = filtered.filter(song =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.singer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSinger) {
      filtered = filtered.filter(song => song.singer === selectedSinger);
    }

    if (selectedType) {
      filtered = filtered.filter(song => song.category === selectedType);
    }

    return filtered;
  }, [allSongs, searchQuery, selectedSinger, selectedType]);


  if (loading) {
    return <div className="text-center py-8">Loading songs and filters...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/library" className="text-sm text-gray-400 hover:underline">
                Library
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-medium">Libyan Songs</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Libyan Songs</h1>
            <p className="text-gray-400 md:text-xl">Explore our collection of traditional Libyan songs</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:mr-4">
              <div className="relative w-full flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Libyan songs..."
                  className="w-full rounded-md border border-white/20 bg-black py-2 pl-10 pr-4 outline-none focus:border-white/30"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border border-white/20 hover:border-white/30"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black">
                  {(selectedSinger ? 1 : 0) + (selectedType ? 1 : 0) + (searchQuery ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active filters:</span>
              {selectedSinger && (
                <FilterBadge
                  label={`Singer: ${getSingerName(selectedSinger)}`}
                  onRemove={() => handleSingerFilter(null)}
                />
              )}
              {selectedType && (
                <FilterBadge label={`Type: ${getTypeName(selectedType)}`} onRemove={() => handleTypeFilter(null)} />
              )}
               {searchQuery && (
                <FilterBadge label={`Search: ${searchQuery}`} onRemove={() => setSearchQuery("")} />
              )}
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="text-sm font-medium text-gray-400 hover:text-gray-300">
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Collapsible filters */}
          {showFilters && (
            <div className="mb-6 space-y-4">
              <CollapsibleFilter title="Filter by Singer" defaultOpen={true}>
                <SingerFilter singers={uniqueSingers} onFilterChange={handleSingerFilter} selectedSinger={selectedSinger} />
              </CollapsibleFilter>

              <CollapsibleFilter title="Filter by Song Type">
                <SongTypeFilter categories={uniqueCategories} onFilterChange={handleTypeFilter} selectedType={selectedType} />
              </CollapsibleFilter>
            </div>
          )}

          <LibyanSongsTable songs={filteredSongs} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
