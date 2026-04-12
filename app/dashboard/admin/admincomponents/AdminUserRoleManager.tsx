"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type UserRole = "admin" | "driver" | "investor"

interface AdminUserRoleManagerProps {
  userId: string
  displayName: string
  initialRole: UserRole
  isSelf: boolean
}

const ROLE_OPTIONS: UserRole[] = ["investor", "driver", "admin"]

export function AdminUserRoleManager({
  userId,
  displayName,
  initialRole,
  isSelf,
}: AdminUserRoleManagerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole)
  const [isPending, startTransition] = useTransition()

  const hasChanges = selectedRole !== initialRole

  function handleSubmit() {
    if (!hasChanges || isSelf) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        })

        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.message || "Failed to update user role.")
        }

        toast({
          title: selectedRole === "admin" ? "Admin access granted" : "Role updated",
          description:
            selectedRole === "admin"
              ? `${displayName} can now access the admin dashboard.`
              : `${displayName} is now a ${selectedRole}.`,
        })

        router.refresh()
      } catch (error) {
        toast({
          title: "Role update failed",
          description: error instanceof Error ? error.message : "Failed to update user role.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-[#E57700]" />
        <span>Only existing admins can change platform roles.</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value as UserRole)}
          disabled={isPending || isSelf}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        <Button onClick={handleSubmit} disabled={!hasChanges || isPending || isSelf}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : selectedRole === "admin" && initialRole !== "admin" ? (
            "Make Admin"
          ) : (
            "Save Role"
          )}
        </Button>
      </div>

      {isSelf ? (
        <p className="text-sm text-muted-foreground">
          Your own admin role is locked here to avoid removing the last active admin by mistake.
        </p>
      ) : null}
    </div>
  )
}
