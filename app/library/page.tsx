"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LibyanSongsTable } from "@/components/libyan-songs-table"
import { MaloofTable } from "@/components/maloof-table"
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from "@/components/enhanced-tabs"
import { Button } from "@/components/ui/button"
import { SingerFilter } from "@/components/singer-filter"
import { SongTypeFilter } from "@/components/song-type-filter"
import { EntryTypeFilter } from "@/components/entry-type-filter"
import { RhythmFilter } from "@/components/rhythm-filter"
import { CollapsibleFilter } from "@/components/collapsible-filter"
import { FilterBadge } from "@/components/filter-badge"

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

// Mapping for Entry Type IDs to Arabic names from CSV
const entryTypeMap: Record<string, string> = {
  isb: "الإصبعين",
  rsd: "الرصد",
  ska: "السيكه",
  mhr: "المحير",
  nwa: "النوى",
  hsn: "الحسين",
}

// Mapping for Rhythm IDs to Arabic names from CSV
const rhythmMapCsv: Record<string, string> = {
  berwel: "برول",
  treaty: "علّاجي",
  sourcy: "مصدّر",
  squarey: "مربع",
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

export interface MaloofEntry {
  number: string | number;
  'Entry Name': string;
  'Entry Type': string;
  'Entry Rhythm': string;
  'Entry Audio File': string;
  'Entry Image': string;
  'Notes Audio File': string;
  'Notes Image': string;
  id: string;
  entryName: string;
  entryType: string;
  entryRhythm: string;
  composer: string;
  origin: string;
  period: string;
  recordingStatus: string;
  soundCloudLink: string;
  views: number;
  likes: number;
  image: string;
  entryImage: string;
  noteImage: string;
  lyrics: string;
  notes: string;
  comments: Array<{
    user: string
    text: string
    date: string
    avatar: string | null
  }>;
}

export default function LibraryPage() {
  // State for fetching Libyan Songs data
  const [allLibyanSongs, setAllLibyanSongs] = useState<Song[]>([])
  const [libyanSingers, setLibyanSingers] = useState<Singer[]>([])
  const [libyanCategories, setLibyanCategories] = useState<string[]>([])
  const [libyanLoading, setLibyanLoading] = useState(true)
  const [libyanError, setLibyanError] = useState<string | null>(null)

  // State for Libyan Songs tab filters
  const [libyanSearchQuery, setLibyanSearchQuery] = useState("")
  const [showLibyanFilters, setShowLibyanFilters] = useState(false)
  const [selectedSinger, setSelectedSinger] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // State for Maloof tab
  const [maloofSearchQuery, setMaloofSearchQuery] = useState("")
  const [showMaloofFilters, setShowMaloofFilters] = useState(false)
  const [selectedEntryType, setSelectedEntryType] = useState<string | null>(null)
  const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null)
  const [allMaloofEntries, setAllMaloofEntries] = useState<MaloofEntry[]>([])
  const [maloofLoading, setMaloofLoading] = useState(true)
  const [maloofError, setMaloofError] = useState<string | null>(null)

  // Fetch Libyan Songs data on mount
  useEffect(() => {
    setLibyanLoading(true);
    fetch("/api/libyan-songs")
      .then((res) => res.json())
      .then((data) => {
        setAllLibyanSongs(data.songs);
        setLibyanSingers(data.uniqueSingers);
        setLibyanCategories(data.uniqueCategories);
        setLibyanLoading(false);
      })
      .catch((err) => {
        setLibyanError("Failed to load Libyan Songs data.");
        setLibyanLoading(false);
      });
  }, [])

  // Fetch Maloof data on mount
  useEffect(() => {
    setMaloofLoading(true);
    fetch("/api/maloof-entries") // Assuming you have an API route for all Maloof entries
      .then((res) => res.json())
      .then((data) => {
        setAllMaloofEntries(data.entries);
        setMaloofLoading(false);
        console.log("Fetched Maloof Entries:", data.entries.slice(0, 5)); // Log first 5 entries
        console.log("Sample Entry Type values:", data.entries.slice(0, 5).map((entry: any) => entry['Entry Type']));
      })
      .catch((err) => {
        setMaloofError("Failed to load Maloof data.");
        setMaloofLoading(false);
      });
  }, [])

  // Handlers for Libyan Songs
  const handleLibyanSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibyanSearchQuery(e.target.value)
  }

  const handleSingerFilter = (singer: string | null) => {
    setSelectedSinger(singer)
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type)
  }

  const handleClearLibyanFilters = () => {
    setLibyanSearchQuery("")
    setSelectedSinger(null)
    setSelectedType(null)
  }

  // Handlers for Maloof
  const handleMaloofSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaloofSearchQuery(e.target.value)
  }

  const handleEntryTypeFilter = (entryType: string | null) => {
    setSelectedEntryType(entryType)
  }

  const handleRhythmFilter = (rhythm: string | null) => {
    setSelectedRhythm(rhythm)
  }

  const handleClearMaloofFilters = () => {
    setMaloofSearchQuery("")
    setSelectedEntryType(null)
    setSelectedRhythm(null)
  }

  // Get singer name for display
  const getSingerName = (name: string) => name;

  // Get type name for display
  const getTypeName = (id: string) => categoryMap[id] || id;

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

  const hasActiveLibyanFilters = selectedSinger || selectedType || libyanSearchQuery;
  const hasActiveMaloofFilters = selectedEntryType || selectedRhythm || maloofSearchQuery;

  // Filtered Libyan Songs based on state
  const filteredLibyanSongs = useMemo(() => {
    let filtered = allLibyanSongs;

    if (libyanSearchQuery) {
      filtered = filtered.filter(song =>
        song.name.toLowerCase().includes(libyanSearchQuery.toLowerCase()) ||
        song.singer.toLowerCase().includes(libyanSearchQuery.toLowerCase())
      );
    }

    if (selectedSinger) {
      filtered = filtered.filter(song => song.singer === selectedSinger);
    }

    if (selectedType) {
      filtered = filtered.filter(song => song.category === selectedType);
    }

    return filtered;
  }, [allLibyanSongs, libyanSearchQuery, selectedSinger, selectedType]);

  // Filtered Maloof Entries based on state
  const filteredMaloofEntries = useMemo(() => {
    let filtered = allMaloofEntries;

    if (maloofSearchQuery) {
      filtered = filtered.filter(entry =>
        entry['Entry Name'].toLowerCase().includes(maloofSearchQuery.toLowerCase())
      );
    }

    if (selectedEntryType) {
      // Look up the Arabic name for the selected ID and filter by that
      const arabicEntryType = entryTypeMap[selectedEntryType];
      if (arabicEntryType) {
        filtered = filtered.filter(entry => entry['Entry Type'] === arabicEntryType);
      }
    }

    if (selectedRhythm) {
      // Look up the Arabic name for the selected ID and filter by that
      const arabicRhythmName = rhythmMapCsv[selectedRhythm];
      if (arabicRhythmName) {
        filtered = filtered.filter(entry => entry['Entry Rhythm'] === arabicRhythmName);
      }
    }

    return filtered;
  }, [allMaloofEntries, maloofSearchQuery, selectedEntryType, selectedRhythm]);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-12 md:px-6 md:py-24">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Music Library</h1>
            <p className="text-gray-400 md:text-xl">
              Explore our collection of traditional Libyan songs and Maloof entries
            </p>
          </div>

          <EnhancedTabs defaultValue="libyan-songs" className="w-full">
            <EnhancedTabsList className="w-full border border-white/50">
              <EnhancedTabsTrigger value="libyan-songs" className="py-3 px-4">
                Libyan Songs
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="maloof" className="py-3 px-4">
                Maloof
              </EnhancedTabsTrigger>
            </EnhancedTabsList>

            {/* Libyan Songs Tab Content */}
            <EnhancedTabsContent value="libyan-songs" className="mt-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="w-full sm:mr-4">
                  <div className="relative w-full flex-grow">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Libyan songs..."
                      className="w-full rounded-md border border-white/20 bg-black py-2 pl-10 pr-4 outline-none focus:border-white/30"
                      value={libyanSearchQuery}
                      onChange={handleLibyanSearch}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border border-white/20 hover:border-white/30"
                  onClick={() => setShowLibyanFilters(!showLibyanFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveLibyanFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black">
                      {(selectedSinger ? 1 : 0) + (selectedType ? 1 : 0) + (libyanSearchQuery ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>

              {/* Active filters */}
              {hasActiveLibyanFilters && (
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
                  {libyanSearchQuery && (
                    <FilterBadge label={`Search: ${libyanSearchQuery}`} onRemove={() => setLibyanSearchQuery("")} />
                  )}
                  {hasActiveLibyanFilters && (
                    <button
                      onClick={handleClearLibyanFilters}
                      className="text-sm font-medium text-gray-400 hover:text-gray-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}

              {/* Collapsible filters */}
              {showLibyanFilters && (
                <div className="mb-6 space-y-4">
                  <CollapsibleFilter title="Filter by Singer" defaultOpen={true}>
                    <SingerFilter singers={libyanSingers} onFilterChange={handleSingerFilter} selectedSinger={selectedSinger} />
                  </CollapsibleFilter>

                  <CollapsibleFilter title="Filter by Song Type">
                    <SongTypeFilter categories={libyanCategories} onFilterChange={handleTypeFilter} selectedType={selectedType} />
                  </CollapsibleFilter>
                </div>
              )}

              {libyanLoading ? (
                <div className="text-center py-8">Loading songs...</div>
              ) : libyanError ? (
                <div className="text-center py-8 text-red-500">{libyanError}</div>
              ) : (
                <LibyanSongsTable songs={filteredLibyanSongs ?? []} />
              )}
            </EnhancedTabsContent>

            {/* Maloof Tab Content */}
            <EnhancedTabsContent value="maloof" className="mt-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="w-full sm:mr-4">
                  <div className="relative w-full flex-grow">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Maloof entries..."
                      className="w-full rounded-md border border-white/20 bg-black py-2 pl-10 pr-4 outline-none focus:border-white/30"
                      value={maloofSearchQuery}
                      onChange={handleMaloofSearch}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border border-white/20 hover:border-white/30"
                  onClick={() => setShowMaloofFilters(!showMaloofFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveMaloofFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black">
                      {(selectedEntryType ? 1 : 0) + (selectedRhythm ? 1 : 0) + (maloofSearchQuery ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>

              {/* Active filters */}
              {hasActiveMaloofFilters && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Active filters:</span>
                  {selectedEntryType && (
                    <FilterBadge
                      label={`Entry Type: ${getEntryTypeName(selectedEntryType)}`}
                      onRemove={() => setSelectedEntryType(null)}
                    />
                  )}
                  {selectedRhythm && (
                    <FilterBadge label={`Rhythm: ${getRhythmName(selectedRhythm)}`} onRemove={() => setSelectedRhythm(null)} />
                  )}
                  {maloofSearchQuery && (
                    <FilterBadge label={`Search: ${maloofSearchQuery}`} onRemove={() => setMaloofSearchQuery("")} />
                  )}
                  {hasActiveMaloofFilters && (
                    <button
                      onClick={handleClearMaloofFilters}
                      className="text-sm font-medium text-gray-400 hover:text-gray-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}

              {/* Collapsible filters */}
              {showMaloofFilters && (
                <div className="mb-6 space-y-4">
                  <CollapsibleFilter title="Filter by Entry Type" defaultOpen={true}>
                    <EntryTypeFilter onFilterChange={handleEntryTypeFilter} />
                  </CollapsibleFilter>

                  <CollapsibleFilter title="Filter by Rhythm">
                    <RhythmFilter onFilterChange={handleRhythmFilter} />
                  </CollapsibleFilter>
                </div>
              )}

              {maloofLoading ? (
                <div className="text-center py-8">Loading entries...</div>
              ) : maloofError ? (
                <div className="text-center py-8 text-red-500">{maloofError}</div>
              ) : (
                <MaloofTable entries={filteredMaloofEntries} />
              )}
            </EnhancedTabsContent>
          </EnhancedTabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
