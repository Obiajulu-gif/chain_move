"use client"

import { useState, useEffect } from "react"

export interface AuthUser {
  id: string
  name?: string
  email?: string
  role?: string
  availableBalance?: number
  totalInvested?: number
  totalReturns?: number
}

export function getUserDisplayName(
  user: Pick<AuthUser, "name" | "email"> | null | undefined,
  fallbackLabel = "User",
): string {
  if (!user) {
    return fallbackLabel
  }

  if (user.name && user.name.trim().length > 0) {
    return user.name.trim()
  }

  if (user.email && user.email.includes("@")) {
    return user.email.split("@")[0]
  }

  return fallbackLabel
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  return { user, loading, setUser }
}
