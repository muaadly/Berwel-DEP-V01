"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
// Remove unused imports related to list/filter components
// import { Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
// Remove import for MaloofTable
// import { MaloofTable } from "@/components/maloof-table"
// Remove imports for filter components
// import { EntryTypeFilter } from "@/components/entry-type-filter"
// import { RhythmFilter } from "@/components/rhythm-filter"
// import { CollapsibleFilter } from "@/components/collapsible-filter"
// import { FilterBadge } from "@/components/filter-badge"
// import { Button } from "@/components/ui/button"
import { MaloofEntryDetails } from "@/app/library/maloof/[id]/maloof-entry-details"
import { MaloofEntry } from "@/app/library/page"
import { use } from "react"

interface MaloofPageProps {
  params: { id: string };
}

export default function MaloofPage({ params }: MaloofPageProps) {
  const entryParams = use(params as any) as { id: string }; // Cast use(params) to any and then to expected type
  const id = entryParams.id;
  const [entryData, setEntryData] = useState<MaloofEntry | null>(null);
  const [similarEntries, setSimilarEntries] = useState<MaloofEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch single Maloof entry data on mount
  useEffect(() => {
    setLoading(true);
    fetch(`/api/maloof-entries/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch entry');
        }
        return res.json();
      })
      .then((data) => {
        console.log("API data received in page:", data);
        // Assuming API now returns { entry: {...}, similarEntries: [...] }
        setEntryData(data.entry as MaloofEntry);
        setSimilarEntries(data.similarEntries as MaloofEntry[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Maloof entry:", err);
        setError("Failed to load Maloof entry details.");
        setLoading(false);
      });
  }, [id]); // Re-fetch if id changes

  // Remove state and handlers related to list/filter components
  // const [searchQuery, setSearchQuery] = useState("")
  // const [selectedEntryType, setSelectedEntryType] = useState<string | null>(null)
  // const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null)
  // const [showFilters, setShowFilters] = useState(false)

  // Remove filter/search handlers
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ }
  // const handleEntryTypeFilter = (entryType: string | null) => { /* ... */ }
  // const handleRhythmFilter = (rhythm: string | null) => { /* ... */ }
  // const handleClearFilters = () => { /* ... */ }

  // Remove display name helpers if only used for removed filters
  // const getEntryTypeName = (id: string) => { /* ... */ }
  // const getRhythmName = (id: string) => { /* ... */ }

  // Remove hasActiveFilters calculation
  // const hasActiveFilters = selectedEntryType || selectedRhythm

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/library" className="text-sm text-gray-400 hover:underline">
                Library
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-medium">Maloof Entry Details</span> {/* Updated breadcrumb text */}
            </div>
            {/* Remove title and description related to list view */}
            {/* <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Maloof</h1> */}
            {/* <p className="text-gray-400 md:text-xl">Explore our collection of traditional Maloof entries</p> */}
          </div>

          {/* Remove search and filter UI */}
          {/* <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center"> ... </div> */}

          {/* Remove Active filters UI */}
          {/* {hasActiveFilters && ( ... )} */}

          {/* Remove Collapsible filters UI */}
          {/* {showFilters && ( ... )} */}

          {/* Render single entry details or loading/error message */}
          {loading ? (
            <div className="text-center py-8">Loading entry details...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : entryData ? (
            <MaloofEntryDetails entry={entryData} similarEntries={similarEntries} />
          ) : (
            <div className="text-center py-8 text-gray-500">Entry not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
