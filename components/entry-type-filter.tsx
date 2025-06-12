"use client"

import { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type EntryType = {
  id: string
  image: string
}

const entryTypes: EntryType[] = [
  {
    id: "rsd",
    image: "/R_Images/Entry Images/RSD.jpeg",
  },
  {
    id: "ska",
    image: "/R_Images/Entry Images/SKA.png",
  },
  {
    id: "nwa",
    image: "/R_Images/Entry Images/NWA.jpeg",
  },
  {
    id: "mhr",
    image: "/R_Images/Entry Images/MHR.jpeg",
  },
  {
    id: "isb",
    image: "/R_Images/Entry Images/ISB.jpeg",
  },
  {
    id: "hsn",
    image: "/R_Images/Entry Images/HSN.jpeg",
  },
]

interface EntryTypeFilterProps {
  onFilterChange: (selectedType: string | null) => void
}

export function EntryTypeFilter({ onFilterChange }: EntryTypeFilterProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleTypeClick = (typeId: string) => {
    if (selectedType === typeId) {
      setSelectedType(null)
      onFilterChange(null)
    } else {
      setSelectedType(typeId)
      onFilterChange(typeId)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {entryTypes.map((type) => (
        <button
          key={type.id}
          className={cn(
            "relative flex flex-col items-center rounded-md border border-white/20 p-3 transition-all hover:border-white/30",
            selectedType === type.id && "border-white bg-gray-900",
          )}
          onClick={() => handleTypeClick(type.id)}
        >
          <div className="relative h-28 w-28 overflow-hidden rounded-md">
            <Image
              src={type.image || "/placeholder.svg"}
              alt={type.id.toUpperCase()}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
          {selectedType === type.id && (
            <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <Check className="h-4 w-4 text-black" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
