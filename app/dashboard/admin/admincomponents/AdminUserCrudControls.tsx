"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type UserRole = "admin" | "driver" | "investor"

export interface AdminManagedUser {
  id: string
  name: string
  fullName?: string | null
  email?: string | null
  phoneNumber?: string | null
  role: UserRole
  privyUserId?: string | null
  walletAddress?: string | null
}

interface AdminUserFormDialogProps {
  mode: "create" | "edit"
  user?: AdminManagedUser
  isSelf?: boolean
  buttonText: string
  buttonVariant?: ButtonProps["variant"]
  buttonSize?: ButtonProps["size"]
  className?: string
}

interface AdminUserCrudActionsProps {
  user: AdminManagedUser
  isSelf?: boolean
  compact?: boolean
  className?: string
}

const ROLE_OPTIONS: UserRole[] = ["investor", "driver", "admin"]

type UserFormState = {
  name: string
  fullName: string
  email: string
  phoneNumber: string
  role: UserRole
  privyUserId: string
  walletAddress: string
}

function buildInitialFormState(user?: AdminManagedUser): UserFormState {
  return {
    name: user?.name || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    role: user?.role || "investor",
    privyUserId: user?.privyUserId || "",
    walletAddress: user?.walletAddress || "",
  }
}

function displayName(user?: AdminManagedUser) {
  return user?.fullName || user?.name || user?.email || "user"
}

export function AdminUserFormDialog({
  mode,
  user,
  isSelf = false,
  buttonText,
  buttonVariant = "outline",
  buttonSize = "sm",
  className,
}: AdminUserFormDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<UserFormState>(() => buildInitialFormState(user))

  const initialForm = useMemo(() => buildInitialFormState(user), [user])

  useEffect(() => {
    if (open) {
      setForm(initialForm)
    }
  }, [initialForm, open])

  function updateField(field: keyof UserFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast({
        title: "Name required",
        description: "Enter at least a name before saving this user.",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(mode === "create" ? "/api/users" : `/api/users/${user?.id}`, {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            fullName: form.fullName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            role: form.role,
            privyUserId: form.privyUserId,
            walletAddress: form.walletAddress,
          }),
        })

        const result = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(result.message || "Unable to save user changes.")
        }

        toast({
          title:
            mode === "create"
              ? form.role === "admin"
                ? "Admin created"
                : "User created"
              : form.role === "admin" && user?.role !== "admin"
                ? "Admin access granted"
                : "User updated",
          description:
            mode === "create"
              ? `${form.fullName || form.name} has been added successfully.`
              : form.role === "admin" && user?.role !== "admin"
                ? `${displayName(user)} can now access the admin dashboard.`
                : `${form.fullName || form.name} has been updated.`,
        })

        setOpen(false)
        router.refresh()
      } catch (error) {
        toast({
          title: mode === "create" ? "User creation failed" : "User update failed",
          description: error instanceof Error ? error.message : "Unable to save user changes.",
          variant: "destructive",
        })
      }
    })
  }

  const submitLabel =
    mode === "create"
      ? form.role === "admin"
        ? "Create Admin"
        : "Create User"
      : form.role === "admin" && user?.role !== "admin"
        ? "Save and Make Admin"
        : "Save Changes"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {mode === "create" ? <Plus className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create User" : `Edit ${displayName(user)}`}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new platform user and assign their starting role."
              : "Update user identity details, role, Privy linkage, or wallet information."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`user-name-${mode}`}>Name</Label>
            <Input
              id={`user-name-${mode}`}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Akpo Chinedu"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`user-fullname-${mode}`}>Full Name</Label>
            <Input
              id={`user-fullname-${mode}`}
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Akpo Chinedu Joachim"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`user-email-${mode}`}>Email</Label>
            <Input
              id={`user-email-${mode}`}
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="user@example.com"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`user-phone-${mode}`}>Phone Number</Label>
            <Input
              id={`user-phone-${mode}`}
              value={form.phoneNumber}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
              placeholder="+234..."
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`user-role-${mode}`}>Role</Label>
            <select
              id={`user-role-${mode}`}
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              disabled={isPending || isSelf}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`user-privy-${mode}`}>Privy ID</Label>
            <Input
              id={`user-privy-${mode}`}
              value={form.privyUserId}
              onChange={(event) => updateField("privyUserId", event.target.value)}
              placeholder="did:privy:..."
              disabled={isPending}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`user-wallet-${mode}`}>Wallet Address</Label>
            <Input
              id={`user-wallet-${mode}`}
              value={form.walletAddress}
              onChange={(event) => updateField("walletAddress", event.target.value)}
              placeholder="0x..."
              disabled={isPending}
            />
          </div>
        </div>

        {isSelf ? (
          <p className="text-sm text-muted-foreground">
            Your own role stays locked here to avoid removing your current admin access by mistake.
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AdminUserCrudActions({
  user,
  isSelf = false,
  compact = false,
  className,
}: AdminUserCrudActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [pendingAction, setPendingAction] = useState<"promote" | "delete" | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleMakeAdmin() {
    if (user.role === "admin") return

    startTransition(async () => {
      setPendingAction("promote")
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "admin" }),
        })

        const result = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(result.message || "Unable to promote this user.")
        }

        toast({
          title: "Admin access granted",
          description: `${displayName(user)} can now access the admin dashboard.`,
        })

        router.refresh()
      } catch (error) {
        toast({
          title: "Promotion failed",
          description: error instanceof Error ? error.message : "Unable to promote this user.",
          variant: "destructive",
        })
      } finally {
        setPendingAction(null)
      }
    })
  }

  function handleDelete() {
    if (isSelf) return

    const confirmed = window.confirm(
      `Delete ${displayName(user)}? This removes the user record and cannot be undone from the dashboard.`,
    )
    if (!confirmed) return

    startTransition(async () => {
      setPendingAction("delete")
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "DELETE",
        })

        const result = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(result.message || "Unable to delete this user.")
        }

        toast({
          title: "User deleted",
          description: `${displayName(user)} was removed successfully.`,
        })

        router.refresh()
      } catch (error) {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Unable to delete this user.",
          variant: "destructive",
        })
      } finally {
        setPendingAction(null)
      }
    })
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <AdminUserFormDialog
        mode="edit"
        user={user}
        isSelf={isSelf}
        buttonText={compact ? "Edit" : "Edit User"}
        buttonVariant="outline"
        buttonSize="sm"
      />

      {user.role !== "admin" ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleMakeAdmin}
          disabled={isPending}
        >
          {isPending && pendingAction === "promote" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Promoting
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              {compact ? "Make Admin" : "Promote to Admin"}
            </>
          )}
        </Button>
      ) : null}

      {!isSelf ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending && pendingAction === "delete" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      ) : null}
    </div>
  )
}
