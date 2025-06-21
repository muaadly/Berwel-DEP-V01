"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { handleLogout } from "@/app/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  user: User | null
  navLinks: NavLink[]
}

export function MobileNav({ user, navLinks }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-gray-800"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Image src="/images/berwel-logo.png" alt="Berwel Logo" width={40} height={40} className="rounded-sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block w-full py-3 px-4 text-lg font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "bg-black border border-amber-500 text-amber-500"
                    : "bg-black border border-gray-800 text-white hover:border-amber-500 hover:text-amber-500"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-6 space-y-4">
              {user ? (
                <form action={handleLogout} className="w-full">
                  <button type="submit" className="w-full text-left">
                    <div className="flex w-full items-center justify-center rounded-md border border-gray-800 py-3 px-4 text-lg font-medium text-white hover:border-amber-500 hover:text-amber-500">
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </div>
                  </button>
                </form>
              ) : (
                <>
                  <Button asChild className="w-full py-3 bg-amber-500 text-black hover:bg-amber-600">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full py-3 bg-amber-500 text-black hover:bg-amber-600">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 