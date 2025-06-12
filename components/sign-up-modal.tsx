"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Mail, Phone, Check, ArrowRight, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import supabase from "@/lib/supabaseClient";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignUpModal(props: SignUpModalProps) {
  // Avoid destructuring props
  const isOpen = props.isOpen
  const onClose = props.onClose

  const [activeTab, setActiveTab] = useState<string>("email")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const isMobile = useMobile()

  // Reset form state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setActiveTab("email")
      setFormData({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (activeTab === 'email') {
      const { email, password, confirmPassword } = formData;

      if (password !== confirmPassword) {
        // Handle password mismatch error
        console.error('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      // Supabase email/password sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { // Optional: add user_metadata or other options
          data: { // Example: store profile data directly
            // You might want to add fields for name, etc. here later
          }
        }
      });

      setIsSubmitting(false);

      if (error) {
        // Handle signup error
        console.error('Signup error:', error.message);
        // Display a user-friendly error message
      } else {
        // Signup successful (usually requires email confirmation)
        // You might want to show a success message or redirect
        console.log('Signup successful. Check your email for confirmation.');
        setCurrentStep(2); // Move to confirmation step or close modal
      }
    } else if (activeTab === 'phone') {
      // Implement phone sign up logic here if needed
      console.log('Phone signup not yet implemented.');
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'facebook') => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
       options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Configure callback URL in Supabase
      },
    });

    if (error) {
      console.error(`${provider} signup error:`, error.message);
      setIsSubmitting(false);
    } else {
      // If no error, Supabase initiates the redirect.
      // Force a window reload after a short delay to pick up the new session cookie.
      setTimeout(() => {
        window.location.assign(window.location.origin);
      }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Sign Up for Berwel</DialogTitle>
          <DialogDescription>Create an account to discover and preserve Libyan musical heritage.</DialogDescription>
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
              <h2 className="text-xl font-bold text-white mb-1">Join Berwel</h2>
              <p className="text-gray-400 text-sm">Discover and preserve Libyan musical heritage</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white transition-all duration-300 w-full justify-center text-lg py-3"
                onClick={() => handleOAuthSignUp('google')}
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
              Already have an account?{' '}
              <button
                onClick={onClose}
                className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                Log in
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
