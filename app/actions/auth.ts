"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function handleLogout() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout failed:", error.message)
    // Optionally handle error state in UI
    return
  }

  revalidatePath("/", "layout")
  redirect("/")
} 