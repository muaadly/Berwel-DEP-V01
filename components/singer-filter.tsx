"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Singer {
  name: string;
  imageName: string;
}

interface SingerFilterProps {
  singers: Singer[];
  onFilterChange: (selectedSinger: string | null) => void;
  selectedSinger: string | null;
}

export function SingerFilter({ singers, onFilterChange, selectedSinger }: SingerFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSingerClick = (singerName: string) => {
    if (selectedSinger === singerName) {
      onFilterChange(null);
    } else {
      onFilterChange(singerName);
    }
  };

  const filteredSingers = singers.filter((singer) =>
    singer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-3 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search singers..."
          className="w-full rounded-md border border-white/20 bg-black py-2 pl-10 pr-4 outline-none focus:border-white/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="max-h-60 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredSingers.map((singer) => (
            <button
              key={singer.name}
              className={cn(
                "flex items-center gap-2 rounded-md border border-white/20 p-2 text-left transition-all hover:border-white/30",
                selectedSinger === singer.name && "border-white bg-gray-900",
              )}
              onClick={() => handleSingerClick(singer.name)}
            >
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={singer.imageName ? `/R_Images/Singers_Images/${singer.imageName}` : "/placeholder.svg"}
                  alt={singer.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="text-sm font-medium truncate">{singer.name}</span>
              {selectedSinger === singer.name && <Check className="ml-auto h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
