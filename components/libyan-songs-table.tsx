"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Play, Heart } from "lucide-react"
import { TablePagination } from "@/components/table-pagination"

interface Song {
  number: string | number
  name: string
  singer: string
  category: string
  play: string
  likes: number
}

interface LibyanSongsTableProps {
  songs: Song[]; // Accept songs data as a prop
  showPagination?: boolean
  itemsPerPage?: number
}

export function LibyanSongsTable({ songs, showPagination = true, itemsPerPage = 8 }: LibyanSongsTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination logic now uses the 'songs' prop
  const totalItems = songs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSongs = showPagination ? songs.slice(startIndex, endIndex) : songs.slice(0, itemsPerPage)

  const handleRowClick = (number: string | number) => {
    router.push(`/library/libyan-songs/${number}`)
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
              <TableHead className="py-3 font-bold text-white">Song Name</TableHead>
              <TableHead className="py-3 font-bold text-white">Singer Name</TableHead>
              <TableHead className="py-3 font-bold text-white">Category</TableHead>
              <TableHead className="py-3 font-bold text-white">Likes</TableHead>
              <TableHead className="py-3 font-bold text-white">Play</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSongs.map((song, idx) => (
              <TableRow
                key={song.number}
                className="cursor-pointer hover:bg-white/10"
                onClick={() => handleRowClick(song.number)}
              >
                <TableCell className="font-medium">{song.number}</TableCell>
                <TableCell>{song.name}</TableCell>
                <TableCell>{song.singer}</TableCell>
                <TableCell>{song.category}</TableCell>
                <TableCell>{song.likes}</TableCell>
                <TableCell>
                  {song.play ? (
                    <a href={song.play} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Play className="h-5 w-5 text-yellow-400" />
                      </Button>
                    </a>
                  ) : (
                    <Button variant="ghost" size="icon" disabled>
                      <Play className="h-5 w-5 text-gray-400" />
                    </Button>
                  )}
                </TableCell>
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
          contentType="songs"
        />
      )}
    </div>
  )
}
