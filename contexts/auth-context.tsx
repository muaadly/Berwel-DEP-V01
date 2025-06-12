"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider: "google" | "facebook" | "email"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (provider: "google" | "facebook", userData?: Partial<User>) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      // Mock: Check if user is logged in (you would check cookies/localStorage in real app)
      const mockLoggedInUser = localStorage.getItem("berwel_user")
      if (mockLoggedInUser) {
        setUser(JSON.parse(mockLoggedInUser))
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (provider: "google" | "facebook", userData?: Partial<User>) => {
    // Mock login - in real app, this would call OAuth providers
    const mockUser: User = {
      id: "user123",
      name: userData?.name || "John Doe",
      email: userData?.email || "john.doe@example.com",
      avatar: userData?.avatar,
      provider,
    }

    setUser(mockUser)
    localStorage.setItem("berwel_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("berwel_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
