"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import supabase from "@/lib/supabaseClient";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUpClick: () => void
}

export function LoginModal(props: LoginModalProps) {
  // Avoid destructuring props
  const isOpen = props.isOpen
  const onClose = props.onClose
  const onSignUpClick = props.onSignUpClick

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const isMobile = useMobile()

  // Reset form state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: "",
        password: "",
        remember: false,
      })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { email, password } = formData

    // Supabase email/password sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      // Handle login error (e.g., display an error message)
      console.error('Login error:', error.message)
      // You might want to show a user-friendly error message in the UI
    } else {
      // Login successful
      onClose()
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    console.log(`Attempting OAuth sign-in with ${provider}`); // Log start
    setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(`${provider} login error:`, error.message)
      setIsSubmitting(false)
    } else {
       console.log(`${provider} sign-in initiated successfully (expect redirect).`); // Log success
       // Supabase initiates the redirect here, so no need for explicit action
       // The timeout for window.location.assign is removed as it was for debugging post-redirect session issues.
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Login to Berwel</DialogTitle>
          <DialogDescription>Log in to continue your musical journey.</DialogDescription>
        </VisuallyHidden>
        <div className="relative h-full flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="relative h-16 w-16 overflow-hidden">
                <Image
                  src="/images/berwel-logo.png"
                  alt="Berwel Logo"
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent"></div>
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Log in to continue your musical journey</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white transition-all duration-300 w-full justify-center text-lg py-3"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 4.6 3.1 8.4 7.3 9.6-.1-1.8 0-4 .6-6-1.4-.3-2.8-.6-4.2-.9 0-3 2.5-5.4 5.5-5.4 3.1 0 5.5 2.5 5.5 5.5 0 .7-.1 1.4-.4 2.1 1.1.3 2.2.5 3.3.8.5 1.7.7 3.5.7 5.4 4.1-1.2 7.2-5 7.2-9.6"></path>
                </svg>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <span>Continue with Google</span>
                )}
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose()
                  onSignUpClick()
                }}
                className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                Sign up
              </button>
            </div>
            <div className="flex justify-center mt-6 gap-2">
              <div className={`h-1 w-8 rounded-full bg-amber-500`}></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
