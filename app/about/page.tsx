import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-12 md:px-6 md:py-24">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Preserving Libyan Musical Heritage
            </h1>
            <p className="mx-auto max-w-3xl text-gray-400 md:text-xl">
              Documenting and digitizing traditional Libyan music and poetry through community collaboration
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-white/30 p-6 transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Mission</h2>
              <p className="text-gray-400">
                Berwel aims to create a comprehensive digital archive of Libyan musical heritage, redistributing and
                publishing traditional musical and poetic arts with their associated information in a modern digital
                format
              </p>
            </div>
            <div className="rounded-lg border border-white/30 p-6 transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Vision</h2>
              <p className="text-gray-400">
                To become a complete documentation platform for Libyan musical heritage that facilitates research,
                sharing, and engagement, contributing to cultural heritage revival especially among younger generations
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold">Our Team</h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-gray-400">
              The Berwel project team consists of music enthusiasts with expertise in traditional Libyan musical arts,
              knowledge of various Libyan dialects, and ability to work with modern technical tools and media
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center rounded-lg border border-white/30 p-6 text-center transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/images/team/abdul-majeed-ben-dalla.jpeg"
                    alt="Abdul Majeed Ben Dalla"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">Abdul Majeed Ben Dalla</h3>
                <p className="mb-4 text-gray-400">Project Founder</p>
                <div className="mt-auto flex justify-center space-x-3">
                  <a href="#" className="text-amber-500/80 hover:text-amber-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" className="text-amber-500/80 hover:text-amber-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col items-center rounded-lg border border-white/30 p-6 text-center transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/middle-eastern-woman-portrait.png"
                    alt="Layla Al-Mansouri"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">Layla Al-Mansouri</h3>
                <p className="mb-4 text-gray-400">Music Archivist</p>
                <div className="mt-auto flex justify-center space-x-3">
                  <a href="#" className="text-amber-500/80 hover:text-amber-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" className="text-amber-500/80 hover:text-amber-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col items-center rounded-lg border border-white/30 p-6 text-center sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/middle-eastern-man-portrait.png"
                    alt="Mohammed Al-Faqih"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-bold">Mohammed Al-Faqih</h3>
                <p className="mb-4 text-gray-400">Technical Director</p>
                <div className="mt-auto flex justify-center space-x-3">
                  <a href="#" className="text-amber-500/80 hover:text-amber-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" className="text-amber-500/80 hover:text-amber-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="rounded-lg bg-gray-900 border border-white/30 p-8 text-center transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/70 hover:shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Join Our Mission</h2>
            <p className="mx-auto mb-6 max-w-2xl text-gray-400">
              We welcome contributions from music enthusiasts, researchers, and anyone passionate about preserving
              Libyan musical heritage. Together, we can ensure these cultural treasures are preserved for future
              generations.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-500 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-amber-600"
            >
              Get Involved
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
