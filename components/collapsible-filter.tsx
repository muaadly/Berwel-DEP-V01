"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleFilterProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function CollapsibleFilter({ title, children, defaultOpen = false }: CollapsibleFilterProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-4 rounded-lg border border-white/20">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-t border-white/10 px-4 py-3">{children}</div>
      </div>
    </div>
  )
}
