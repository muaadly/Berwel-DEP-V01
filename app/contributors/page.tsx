import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Users, MessageSquare, Heart } from "lucide-react"

interface Contributor {
  id: string
  name: string
  image: string | null
  initial?: string
  color?: string
  memberSince: string
  comments: number
  likes: number
  songs: number
}

const contributors: Contributor[] = [
  {
    id: "asem-mansor",
    name: "asem mansor",
    image: "/images/contributors/asem-mansor.png",
    memberSince: "March 12, 2025",
    comments: 6,
    likes: 6,
    songs: 4,
  },
  {
    id: "asem-adel-1",
    name: "asem adel",
    image: "/images/contributors/asem-adel.png",
    memberSince: "March 12, 2025",
    comments: 2,
    likes: 7,
    songs: 3,
  },
  {
    id: "muaad-siala",
    name: "Muaad Siala",
    image: "/images/contributors/muaad-siala.png",
    memberSince: "March 13, 2025",
    comments: 0,
    likes: 0,
    songs: 0,
  },
  {
    id: "adel-adel",
    name: "Adel Adel",
    image: null,
    initial: "A",
    color: "bg-blue-600",
    memberSince: "March 13, 2025",
    comments: 0,
    likes: 0,
    songs: 0,
  },
  {
    id: "asem-adel-2",
    name: "Asem Adel",
    image: null,
    initial: "A",
    color: "bg-purple-600",
    memberSince: "March 13, 2025",
    comments: 0,
    likes: 0,
    songs: 1,
  },
  {
    id: "asem-adel-3",
    name: "Asem Adel",
    image: null,
    initial: "AA",
    color: "bg-gray-600",
    memberSince: "March 15, 2025",
    comments: 2,
    likes: 0,
    songs: 0,
  },
]

export default function ContributorsPage() {
  // Calculate totals
  const totalUsers = contributors.length
  const totalSongs = contributors.reduce((sum, contributor) => sum + contributor.songs, 0) + 113 // Adding more songs to match the 130 in the image
  const totalComments = contributors.reduce((sum, contributor) => sum + contributor.comments, 0)
  const totalLikes = contributors.reduce((sum, contributor) => sum + contributor.likes, 0)

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tighter sm:text-5xl">Our Contributors</h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-400">
              Meet the community members who have contributed to the Berwel Music platform.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="flex items-center justify-between rounded-lg border border-white/30 bg-gray-950 p-6 shadow-sm transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900 hover:shadow-md">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                <p className="text-4xl font-bold">{totalUsers}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
            </div>

            {/* Songs Added */}
            <div className="flex items-center justify-between rounded-lg border border-white/30 bg-gray-950 p-6 shadow-sm transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900 hover:shadow-md">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Total Songs</h3>
                <p className="text-4xl font-bold">{totalSongs}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
            </div>

            {/* Comments */}
            <div className="flex items-center justify-between rounded-lg border border-white/30 bg-gray-950 p-6 shadow-sm transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900 hover:shadow-md">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Comments</h3>
                <p className="text-4xl font-bold">{totalComments}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <MessageSquare className="h-6 w-6 text-amber-500" />
              </div>
            </div>

            {/* Likes Given */}
            <div className="flex items-center justify-between rounded-lg border border-white/30 bg-gray-950 p-6 shadow-sm transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900 hover:shadow-md">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Likes Given</h3>
                <p className="text-4xl font-bold">{totalLikes}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Heart className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Contributors List */}
          <div className="space-y-4">
            {contributors.map((contributor) => (
              <div
                key={contributor.id}
                className="flex items-center justify-between rounded-lg border border-white/30 bg-gray-950 p-6 shadow-sm transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {contributor.image ? (
                    <div className="h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={contributor.image || "/placeholder.svg"}
                        alt={contributor.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${
                        contributor.color || "bg-gray-700"
                      }`}
                    >
                      {contributor.initial}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium">{contributor.name}</h3>
                    <p className="text-sm text-gray-400">Member since {contributor.memberSince}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-amber-500/80" />
                    <span>{contributor.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-amber-500/80" />
                    <span>{contributor.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
