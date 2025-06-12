"use client"

import type React from "react"

import { useState } from "react"
import { Music, Disc, Radio, Waves, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Rhythm = {
  id: string
  name: string
  icon: React.ReactNode
}

const rhythms: Rhythm[] = [
  {
    id: "berwel",
    name: "Berwel",
    icon: <Music className="h-4 w-4" />,
  },
  {
    id: "treaty",
    name: "Treaty",
    icon: <Disc className="h-4 w-4" />,
  },
  {
    id: "sourcy",
    name: "Sourcy",
    icon: <Radio className="h-4 w-4" />,
  },
  {
    id: "squarey",
    name: "Squarey",
    icon: <Waves className="h-4 w-4" />,
  },
]

interface RhythmFilterProps {
  onFilterChange: (selectedRhythm: string | null) => void
}

export function RhythmFilter({ onFilterChange }: RhythmFilterProps) {
  const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null)

  const handleRhythmClick = (rhythmId: string) => {
    if (selectedRhythm === rhythmId) {
      setSelectedRhythm(null)
      onFilterChange(null)
    } else {
      setSelectedRhythm(rhythmId)
      onFilterChange(rhythmId)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {rhythms.map((rhythm) => (
        <button
          key={rhythm.id}
          className={cn(
            "flex items-center gap-2 rounded-md border border-white/20 p-2 text-left transition-all hover:border-white/30",
            selectedRhythm === rhythm.id && "border-white bg-gray-900",
          )}
          onClick={() => handleRhythmClick(rhythm.id)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800">{rhythm.icon}</div>
          <span className="text-sm font-medium">{rhythm.name}</span>
          {selectedRhythm === rhythm.id && <Check className="ml-auto h-4 w-4" />}
        </button>
      ))}
    </div>
  )
}
