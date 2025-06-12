import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex items-center gap-2">
          <Image src="/images/berwel-logo.png" alt="Berwel Logo" width={24} height={24} className="rounded-sm" />
          <span className="text-sm font-medium">© 2025 Berwel. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-xs text-gray-400 underline-offset-4 hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-xs text-gray-400 underline-offset-4 hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
