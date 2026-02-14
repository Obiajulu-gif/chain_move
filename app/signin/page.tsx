"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"

import { AuthInput } from "@/components/auth/AuthInput"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { usePlatform } from "@/contexts/platform-context"

interface SignInFieldErrors {
  email?: string
  password?: string
}

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({})
  const [formError, setFormError] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const { dispatch } = usePlatform()

  const validate = () => {
    const errors: SignInFieldErrors = {}

    if (!email.trim()) {
      errors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address."
    }

    if (!password) {
      errors.password = "Password is required."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError("")

    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        })

        dispatch({
          type: "SET_CURRENT_USER",
          payload: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          },
        })

        router.push(`/dashboard/${data.user.role}`)
        return
      }

      setFormError(data.message || "Unable to sign in right now. Please try again.")
    } catch {
      setFormError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in to ChainMove"
      description="Access your dashboard, review activity, and continue your mobility journey."
      sideTitle="A cleaner way to run mobility ownership"
      sideDescription="Use ChainMove to track asset performance, manage repayments, and monitor transparent payout history from one place."
      sidePoints={[
        "Fast account access for drivers and investors",
        "Transparent records for ownership and payouts",
        "Built for operational clarity and accountability",
      ]}
      footer={
        <p className="text-sm text-[#666666]">
          New to ChainMove?{" "}
          <Link
            href="/auth"
            className="font-medium text-[#F2780E] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E]"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          id="email"
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }))
            }
          }}
          error={fieldErrors.email}
        />

        <AuthInput
          id="password"
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: undefined }))
            }
          }}
          error={fieldErrors.password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="rounded p-1 text-[#666666] hover:text-[#1F1F1F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <p className="text-right text-sm text-[#8A8A8A]" aria-disabled="true">
          Forgot password? Coming soon
        </p>

        {formError ? (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{formError}</p>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-[#F2780E] text-white hover:bg-[#DF6D0A] focus-visible:ring-[#F2780E]"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
