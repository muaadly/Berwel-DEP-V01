"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart } from "lucide-react"
import { TablePagination } from "@/components/table-pagination"
import { MaloofEntry } from "@/app/library/page"

interface MaloofTableProps {
  entries: MaloofEntry[]; // Accept entries data as a prop
  showPagination?: boolean
  itemsPerPage?: number
}

export function MaloofTable({ entries, showPagination = true, itemsPerPage = 8 }: MaloofTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination logic now uses the 'entries' prop
  const totalItems = entries.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentEntries = showPagination ? entries.slice(startIndex, endIndex) : entries.slice(0, itemsPerPage)

  const handleRowClick = (number: string | number) => {
    router.push(`/library/maloof/${number}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border-2 border-white dark:border-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-white hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className="w-[80px] py-3 font-bold text-white">#</TableHead>
              <TableHead className="py-3 font-bold text-white">Entry Name</TableHead>
              <TableHead className="py-3 font-bold text-white">Entry Type</TableHead>
              <TableHead className="py-3 font-bold text-white">Entry Rhythm</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEntries.map((entry) => (
              <TableRow
                key={entry.number}
                className="cursor-pointer hover:bg-white/10"
                onClick={() => handleRowClick(entry.number)}
              >
                <TableCell className="font-medium">{entry.number}</TableCell>
                <TableCell>{entry['Entry Name']}</TableCell>
                <TableCell>{entry['Entry Type']}</TableCell>
                <TableCell>{entry['Entry Rhythm']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          contentType="entries"
        />
      )}
    </div>
  )
}
