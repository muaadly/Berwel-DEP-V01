"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Search, Home, Library, Users, Info, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onSearchClick: () => void
  onLoginClick: () => void
  onSignUpClick: () => void
}

export function MobileMenu({ isOpen, onClose, onSearchClick, onLoginClick, onSignUpClick }: MobileMenuProps) {
  const pathname = usePathname()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5 mr-3" /> },
    { href: "/library", label: "Library", icon: <Library className="h-5 w-5 mr-3" /> },
    { href: "/contributors", label: "Contributors", icon: <Users className="h-5 w-5 mr-3" /> },
    { href: "/about", label: "About", icon: <Info className="h-5 w-5 mr-3" /> },
    { href: "/contact", label: "Contact", icon: <Phone className="h-5 w-5 mr-3" /> },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center">
          <Image src="/images/logo.jpeg" alt="Berwel Logo" width={40} height={40} className="rounded-sm" />
          <span className="ml-2 font-bold text-xl">Berwel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-10 w-10 rounded-full hover:bg-gray-800"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={link.href}
                className={`flex items-center py-4 px-3 text-lg font-medium rounded-lg ${
                  isActive(link.href)
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-white hover:bg-gray-900 hover:text-amber-500"
                }`}
                onClick={onClose}
              >
                {link.icon}
                {link.label}
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: navLinks.length * 0.05 }}
          >
            <button
              className="flex items-center w-full py-4 px-3 text-lg font-medium rounded-lg text-white hover:bg-gray-900 hover:text-amber-500"
              onClick={() => {
                onClose()
                onSearchClick()
              }}
            >
              <Search className="h-5 w-5 mr-3" />
              Search
            </button>
          </motion.div>
        </nav>
      </div>

      <div className="p-4 space-y-3 border-t border-gray-800">
        <Button
          variant="outline"
          className="w-full justify-center border-gray-800 hover:bg-gray-800 hover:text-gray-50 py-6 text-base"
          onClick={() => {
            onClose()
            onLoginClick()
          }}
        >
          Login
        </Button>
        <Button
          className="w-full justify-center bg-amber-500 text-black hover:bg-amber-600 py-6 text-base"
          onClick={() => {
            onClose()
            onSignUpClick()
          }}
        >
          Sign Up
        </Button>
      </div>
    </div>
  )
}
