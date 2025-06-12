"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MaloofTable } from "@/components/maloof-table"
import { EntryTypeFilter } from "@/components/entry-type-filter"
import { RhythmFilter } from "@/components/rhythm-filter"
import { CollapsibleFilter } from "@/components/collapsible-filter"
import { FilterBadge } from "@/components/filter-badge"
import { Button } from "@/components/ui/button"

export default function MaloofPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntryType, setSelectedEntryType] = useState<string | null>(null)
  const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [maloofEntries, setMaloofEntries] = useState<MaloofEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaloofEntries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/maloof-entries');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMaloofEntries(data.entries);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch Maloof entries:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMaloofEntries();
  }, []);

  // In a real application, you would filter the data based on these filters
  // For now, we'll just log the filter changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    console.log("Search query:", e.target.value)
  }

  const handleEntryTypeFilter = (entryType: string | null) => {
    setSelectedEntryType(entryType)
    console.log("Selected entry type:", entryType)
  }

  const handleRhythmFilter = (rhythm: string | null) => {
    setSelectedRhythm(rhythm)
    console.log("Selected rhythm:", rhythm)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedEntryType(null)
    setSelectedRhythm(null)
  }

  // Get entry type name for display
  const getEntryTypeName = (id: string) => {
    return id.toUpperCase()
  }

  // Get rhythm name for display
  const getRhythmName = (id: string) => {
    const rhythmMap: Record<string, string> = {
      berwel: "Berwel",
      treaty: "Treaty",
      sourcy: "Sourcy",
      squarey: "Squarey",
    }
    return rhythmMap[id] || id
  }

  const hasActiveFilters = selectedEntryType || selectedRhythm

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
              <span className="text-sm font-medium">Maloof</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Maloof</h1>
            <p className="text-gray-400 md:text-xl">Explore our collection of traditional Maloof entries</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:mr-4">
              <div className="relative w-full flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Maloof entries..."
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
                  {(selectedEntryType ? 1 : 0) + (selectedRhythm ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active filters:</span>
              {selectedEntryType && (
                <FilterBadge
                  label={`Entry Type: ${getEntryTypeName(selectedEntryType)}`}
                  onRemove={() => setSelectedEntryType(null)}
                />
              )}
              {selectedRhythm && (
                <FilterBadge
                  label={`Rhythm: ${getRhythmName(selectedRhythm)}`}
                  onRemove={() => setSelectedRhythm(null)}
                />
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
              <CollapsibleFilter title="Filter by Entry Type" defaultOpen={true}>
                <EntryTypeFilter onFilterChange={handleEntryTypeFilter} />
              </CollapsibleFilter>

              <CollapsibleFilter title="Filter by Rhythm">
                <RhythmFilter onFilterChange={handleRhythmFilter} />
              </CollapsibleFilter>
            </div>
          )}
          {loading && <p className="text-center text-gray-400">Loading Maloof entries...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {!loading && !error && maloofEntries.length > 0 && (
            <MaloofTable entries={maloofEntries} />
          )}
          {!loading && !error && maloofEntries.length === 0 && (
            <p className="text-center text-gray-400">No Maloof entries found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
