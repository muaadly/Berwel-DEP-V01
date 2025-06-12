import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-12 md:px-6 md:py-24">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
            <p className="mx-auto max-w-2xl text-gray-400 md:text-xl">
              Have questions about Berwel or want to contribute to our mission? We'd love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-lg border border-white/30 p-6 transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
              <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" className="border-gray-800 bg-gray-900" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="border-gray-800 bg-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" className="border-gray-800 bg-gray-900" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Your message" rows={5} className="border-gray-800 bg-gray-900" />
                </div>
                <Button className="w-full bg-white text-black hover:bg-gray-200">Send Message</Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col justify-between rounded-lg border border-white/30 p-6 transition-all duration-300 hover:border-2 hover:border-amber-500 hover:bg-gray-900/50 hover:shadow-md">
              <div>
                <h2 className="mb-6 text-2xl font-bold">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@berwel.com" className="text-gray-400 hover:text-gray-300">
                        info@berwel.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+218912345678" className="text-gray-400 hover:text-gray-300">
                        +218 91 234 5678
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-400">Tripoli, Libya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="rounded-full border border-white/30 p-2 text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-300"
                  >
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
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="#"
                    className="rounded-full border border-white/30 p-2 text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-300"
                  >
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
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href="#"
                    className="rounded-full border border-white/30 p-2 text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-300"
                  >
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
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="#"
                    className="rounded-full border border-white/30 p-2 text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-300"
                  >
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
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
