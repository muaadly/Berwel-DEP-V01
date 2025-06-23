import Link from "next/link"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { createClient } from "@/utils/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from "@/components/mobile-nav"
import { User } from "@supabase/supabase-js"
import { handleLogout } from "@/app/actions/auth"
import { SearchButton } from "@/components/search-button"
import { NavLinks } from "@/components/nav-links"

function NavbarUserSection({ user }: { user: User | null }) {
  if (!user) {
    return (
      <div className="hidden md:flex md:items-center md:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-gray-800 hover:bg-gray-800 hover:text-gray-50"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button size="sm" className="h-9 bg-amber-500 text-black hover:bg-amber-600" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex md:items-center md:gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user.user_metadata?.avatar_url as string | undefined} alt={user.email || "user avatar"} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <form action={handleLogout}>
            <button type="submit" className="w-full">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/library", label: "Library" },
    { href: "/contributors", label: "Contributors" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/berwel-logo.png" alt="Berwel Logo" width={40} height={40} className="rounded-sm" />
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:justify-center">
          <NavLinks navLinks={navLinks} />
        </nav>

        <div className="flex items-center gap-3">
          <SearchButton />
          <LanguageSwitcher />
          <NavbarUserSection user={user} />
          <MobileNav user={user} navLinks={navLinks} />
        </div>
      </div>
    </header>
  )
}
