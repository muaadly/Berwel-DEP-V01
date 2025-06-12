"use client"

import { X } from "lucide-react"

interface FilterBadgeProps {
  label: string
  onRemove: () => void
}

export function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-gray-700">
        <X className="h-3 w-3" />
        <span className="sr-only">Remove</span>
      </button>
    </div>
  )
}
