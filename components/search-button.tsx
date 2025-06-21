"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchDialog } from "@/components/search-dialog"

export function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="h-10 w-10 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-all group"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
        </Button>
      </div>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
} 