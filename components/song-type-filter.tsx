"use client"

import type React from "react"

import { useState } from "react"
import { Music, Landmark, Users, Radio, Mic2, BookOpen, Flag, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Mapping for English categories to Arabic - Keep this mapping
const categoryMap: Record<string, string> = {
  bob: "بوب",
  heritage: "تراث",
  popular: "شعبي",
  "libyan-tarab": "طرب ليبي",
  maloof: "مالوف",
  muwashahat: "موشحات",
  patriotic: "وطنيات",
}

// Add mapping for icons based on category id
const categoryIconMap: Record<string, React.ReactNode> = {
  bob: <Music className="h-4 w-4" />,
  heritage: <Landmark className="h-4 w-4" />,
  popular: <Users className="h-4 w-4" />,
  "libyan-tarab": <Radio className="h-4 w-4" />,
  maloof: <Mic2 className="h-4 w-4" />,
  muwashahat: <BookOpen className="h-4 w-4" />,
  patriotic: <Flag className="h-4 w-4" />,
}

interface SongTypeFilterProps {
  categories: string[];
  onFilterChange: (selectedType: string | null) => void;
  selectedType: string | null;
}

export function SongTypeFilter({ categories, onFilterChange, selectedType }: SongTypeFilterProps) {
  const handleTypeClick = (typeId: string) => {
    if (selectedType === typeId) {
      onFilterChange(null);
    } else {
      onFilterChange(typeId);
    }
  };

  // Map category ids to objects with id, name (Arabic), and icon
  const songTypesWithNamesAndIcons = categories.map(category => ({
    id: category,
    name: categoryMap[category] || category,
    icon: categoryIconMap[category] || <Music className="h-4 w-4" />,
  }));

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {songTypesWithNamesAndIcons.map((type) => (
        <button
          key={type.id}
          className={cn(
            "flex items-center gap-2 rounded-md border border-white/20 p-2 text-left transition-all hover:border-white/30",
            selectedType === type.id && "border-white bg-gray-900",
          )}
          onClick={() => handleTypeClick(type.id)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800">{type.icon}</div>
          <span className="text-sm font-medium">{type.name}</span>
          {selectedType === type.id && <Check className="ml-auto h-4 w-4" />}
        </button>
      ))}
    </div>
  );
}
