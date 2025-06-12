"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SignUpModal } from "@/components/sign-up-modal"
import { LoginModal } from "@/components/login-modal"
import { usePathname } from "next/navigation"
import { SearchDialog } from "@/components/search-dialog"
import { useUser } from "@/context/user-context"
import supabase from "@/lib/supabaseClient"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeButton, setActiveButton] = useState<"none" | "search" | "menu">("none")
  const pathname = usePathname()
  const { user, isLoading } = useUser()

  console.log('Navbar - User state:', user)
  console.log('Navbar - Loading state:', isLoading)

  // Prevent body scroll when mobile menu is open
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Update active button when search or menu is opened/closed
  useEffect(() => {
    if (isSearchOpen) {
      setActiveButton("search")
    } else if (isMenuOpen) {
      setActiveButton("menu")
    } else {
      setActiveButton("none")
    }
  }, [isSearchOpen, isMenuOpen])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout failed:', error.message)
    } else {
      console.log('User logged out successfully.')
      // Optionally redirect or show a message
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/library", label: "Library" },
    { href: "/contributors", label: "Contributors" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/berwel-logo.png" alt="Berwel Logo" width={40} height={40} className="rounded-sm" />
          </Link>
        </div>

        {/* Center navigation - Desktop */}
        <nav className="hidden md:flex md:items-center md:justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 border-b-2 px-4 py-1 text-sm font-medium transition-colors hover:text-amber-500 ${
                isActive(link.href) ? "border-amber-500 text-amber-500" : "border-transparent hover:border-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section - search, language switcher, and auth buttons */}
        <div className="flex items-center gap-3">
          {/* Search button with amber highlight when active */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className={`h-10 w-10 rounded-full ${
                activeButton === "search" ? "bg-amber-500/20" : "bg-amber-500/20 hover:bg-amber-500/30"
              } transition-all group`}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
            </Button>
            {/* Amber underline indicator when active */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ${
                activeButton === "search" ? "w-full bg-amber-500" : "w-0 bg-transparent"
              }`}
            ></div>
          </div>

          <LanguageSwitcher />

          <div className="hidden md:flex md:items-center md:gap-3">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-gray-800"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.user_metadata?.avatar_url as string | undefined} alt={user.email || 'user avatar'} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-gray-800 hover:bg-gray-800 hover:text-gray-50"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="h-9 bg-amber-500 text-black hover:bg-amber-600"
                  onClick={() => setIsSignUpModalOpen(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Menu button with amber highlight when active */}
          <div className="relative md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${
                activeButton === "menu" ? "bg-amber-500/20" : "hover:bg-gray-800"
              } transition-all`}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className={`h-6 w-6 ${activeButton === "menu" ? "text-amber-500" : ""}`} />
            </Button>
            {/* Amber underline indicator when active */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ${
                activeButton === "menu" ? "w-full bg-amber-500" : "w-0 bg-transparent"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with solid black background and orange login button */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black md:hidden">
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
              {isLoading ? (
                <div className="h-12 w-full animate-pulse rounded-md bg-gray-800"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer mx-auto">
                      <AvatarImage src={user.user_metadata?.avatar_url as string | undefined} alt={user.email || 'user avatar'} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="center" forceMount>
                    <DropdownMenuItem onClick={() => {
                       setIsMenuOpen(false)
                       handleLogout()
                     }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    className="w-full py-3 bg-amber-500 text-black hover:bg-amber-600"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsLoginModalOpen(true)
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    className="w-full py-3 bg-amber-500 text-black hover:bg-amber-600"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsSignUpModalOpen(true)
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Modals */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignUpClick={() => {
          setIsLoginModalOpen(false)
          setIsSignUpModalOpen(true)
        }}
      />
    </header>
  )
}
