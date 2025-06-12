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
        {/* Content implementation */}
        <div className="relative h-full flex flex-col">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

          {/* Content */}
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

            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1 content */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Join Berwel</h2>
                    <p className="text-gray-400 text-sm">Discover and preserve Libyan musical heritage</p>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white transition-all duration-300"
                        onClick={() => handleOAuthSignUp('facebook')}
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
                          className="text-blue-500"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        <span>Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white transition-all duration-300"
                        onClick={() => handleOAuthSignUp('google')}
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
                        <span>Google</span>
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-800"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gradient-to-r from-gray-900 via-black to-gray-900 px-2 text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 p-1">
                        <TabsTrigger
                          value="email"
                          className="data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all duration-300"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </TabsTrigger>
                        <TabsTrigger
                          value="phone"
                          className="data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all duration-300"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Phone
                        </TabsTrigger>
                      </TabsList>

                      <form onSubmit={handleSubmit}>
                        <TabsContent value="email" className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm text-gray-300">
                              Email
                            </Label>
                            <div className="relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-gray-900/50 border-gray-800 focus:border-amber-500/50 pl-10 transition-all duration-300 h-12"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 h-12 text-base"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Continue
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </TabsContent>

                        <TabsContent value="phone" className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm text-gray-300">
                              Libyan Phone Number
                            </Label>
                            <div className="flex">
                              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-800 bg-gray-900/80 px-3 text-gray-400 h-12">
                                +218
                              </span>
                              <div className="relative flex-1">
                                <Input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  className="rounded-l-none bg-gray-900/50 border-gray-800 focus:border-amber-500/50 pl-10 transition-all duration-300 h-12"
                                  placeholder="9X XXX XXXX"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  required
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                              </div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 h-12 text-base"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Continue
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </TabsContent>
                      </form>
                    </Tabs>

                    <div className="text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        onClick={onClose}
                        className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 2 content */}
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Create your password</h2>
                    <p className="text-gray-400 text-sm">
                      {activeTab === "email"
                        ? `We'll use ${formData.email} to secure your account`
                        : `We'll use +218 ${formData.phone} to secure your account`}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          className="bg-gray-900/50 border-gray-800 focus:border-amber-500/50 transition-all duration-300 h-12"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="flex gap-1 mt-1">
                        <div className="h-1 flex-1 rounded-full bg-gray-800"></div>
                        <div className="h-1 flex-1 rounded-full bg-gray-800"></div>
                        <div className="h-1 flex-1 rounded-full bg-gray-800"></div>
                        <div className="h-1 flex-1 rounded-full bg-gray-800"></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use 8+ characters with a mix of letters, numbers & symbols
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        className="bg-gray-900/50 border-gray-800 focus:border-amber-500/50 transition-all duration-300 h-12"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 h-12 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="flex justify-center mt-6 gap-2">
              <div className={`h-1 w-8 rounded-full ${currentStep === 1 ? "bg-amber-500" : "bg-gray-700"}`}></div>
              <div className={`h-1 w-8 rounded-full ${currentStep === 2 ? "bg-amber-500" : "bg-gray-700"}`}></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
