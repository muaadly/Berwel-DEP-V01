import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context";

export const metadata: Metadata = {
  title: "Berwel | Libyan Traditional Music",
  description: "Discover the rich heritage of Libyan traditional music",
    generator: 'v0.dev'
}

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {props.children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
