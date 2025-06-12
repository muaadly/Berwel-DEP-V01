"use client"
import Image from "next/image"
import { LibyanSongsTable } from "@/components/libyan-songs-table"
import { MaloofTable } from "@/components/maloof-table"
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from "@/components/enhanced-tabs"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  // Create a flashing and flipping effect for the logo
  useEffect(() => {
    // Initial animation after a short delay
    const initialTimeout = setTimeout(() => {
      setIsGlowing(true)

      setTimeout(() => {
        setIsFlipped(true)

        setTimeout(() => {
          setIsFlipped(false)
          setIsGlowing(false)
        }, 600)
      }, 400)
    }, 1000)

    // Set up interval for periodic animations
    const interval = setInterval(() => {
      setIsGlowing(true)

      setTimeout(() => {
        setIsFlipped(true)

        setTimeout(() => {
          setIsFlipped(false)
          setIsGlowing(false)
        }, 600)
      }, 400)
    }, 10000) // Repeat every 10 seconds

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col items-center gap-8 text-center">
        <div
          className={`relative transition-all duration-500 ${isFlipped ? "rotate-y-180 scale-110" : ""} ${
            isGlowing ? "logo-glow" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <Image
            src="/images/berwel-logo.png"
            alt="Berwel Logo"
            width={200}
            height={200}
            className={`rounded-sm transition-all duration-500 ${isFlipped ? "opacity-0" : "opacity-100"}`}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-sm bg-black transition-all duration-500 ${
              isFlipped ? "opacity-100 rotate-y-180" : "opacity-0"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <Image src="/images/berwel-logo.png" alt="Berwel Logo" width={200} height={200} className="rounded-sm" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Discover the rich heritage of Libyan traditional music
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Explore our collection of traditional Libyan songs and Maloof entries
          </p>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Trending</h2>
        <EnhancedTabs defaultValue="libyan-songs" className="w-full">
          <EnhancedTabsList className="w-full border border-white/50">
            <EnhancedTabsTrigger value="libyan-songs" className="py-3 px-4">
              Libyan Songs
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="maloof" className="py-3 px-4">
              Maloof
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value="libyan-songs" className="mt-6">
            <LibyanSongsTable showPagination={false} />
          </EnhancedTabsContent>
          <EnhancedTabsContent value="maloof" className="mt-6">
            <MaloofTable showPagination={false} />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </section>
  )
}
