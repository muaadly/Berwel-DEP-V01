"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface CommentFormProps {
  onSubmit: (comment: string) => void
  placeholder?: string
}

export function CommentForm({ onSubmit, placeholder = "Share your thoughts..." }: CommentFormProps) {
  const { user } = useAuth()
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment)
      setComment("")
    }
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-white/20 bg-gray-800/50 p-6 text-center">
        <p className="mb-4 text-gray-400">Please log in to leave a comment</p>
        <button className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-600">
          Log In
        </button>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Logged-in user profile */}
      <div className="flex items-center gap-3 mb-4">
        {user.avatar ? (
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
            <span className="text-sm font-bold text-black">{getInitials(user.name)}</span>
          </div>
        )}
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-gray-400">Logged in via {user.provider === "google" ? "Google" : "Facebook"}</p>
        </div>
      </div>

      <div>
        <label htmlFor="comment-text" className="mb-2 block text-sm font-medium text-gray-300">
          Comment
        </label>
        <textarea
          id="comment-text"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md border border-white/20 bg-gray-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
          placeholder={placeholder}
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-600 focus:outline-none disabled:opacity-50"
        disabled={!comment.trim()}
      >
        Post Comment
      </button>
    </form>
  )
}
