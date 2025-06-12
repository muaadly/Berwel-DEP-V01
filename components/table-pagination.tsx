"use client"

import { Music, BookOpen } from "lucide-react"

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
  contentType: "songs" | "entries"
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  contentType,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const contentLabel = contentType === "songs" ? "Songs" : "Entries"
  const icon = contentType === "songs" ? <Music className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("ellipsis-start")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end")
      }

      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
      {/* Simple showing text - left aligned */}
      <div className="flex items-center gap-1.5 text-sm">
        {icon}
        <span className="text-gray-400">
          Showing <span className="font-medium text-white">{startItem}</span> to{" "}
          <span className="font-medium text-white">{endItem}</span> of{" "}
          <span className="font-medium text-amber-500">{totalItems}</span> {contentLabel}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-gray-500"
              : "text-gray-400 hover:text-amber-500 cursor-pointer"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="hidden sm:flex items-center mx-2">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              )
            }

            return (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-md mx-0.5 transition-colors ${
                  currentPage === page
                    ? "bg-amber-500 text-black font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-amber-500"
                }`}
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed text-gray-500"
              : "text-gray-400 hover:text-amber-500 cursor-pointer"
          }`}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
