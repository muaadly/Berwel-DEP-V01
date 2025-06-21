"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavLink {
  href: string
  label: string
}

interface NavLinksProps {
  navLinks: NavLink[]
}

export function NavLinks({ navLinks }: NavLinksProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
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
    </>
  )
} 