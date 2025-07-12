"use client"

import { useState, useEffect, useCallback } from "react"

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  kycStatus?: "none" | "pending" | "approved" | "rejected" // Added kycStatus
  kycDocuments?: string[] // Added kycDocuments
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Wrap fetchCurrentUser in useCallback to make it stable
  const fetchCurrentUser = useCallback(async () => {
    setLoading(true)
    try {
      // This endpoint should return the full user object from your database
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // If response is not ok (e.g., 401 Unauthorized, 404 Not Found), clear user
        setUser(null)
        console.warn("Failed to fetch current user:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
      setUser(null) // Clear user on network error
    } finally {
      setLoading(false)
    }
  }, []) // No dependencies, so this function is stable

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser]) // Depend on the stable fetchCurrentUser

  // Expose a refetch function to manually trigger data re-fetching
  const refetch = useCallback(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser]) // Depend on the stable fetchCurrentUser

  return { user, loading, setUser, refetch } // Return refetch
}
