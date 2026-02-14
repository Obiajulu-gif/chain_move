"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  Car,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TrendingUp,
  User,
} from "lucide-react"

import { CustomConnectWallet } from "@/app/CustomConnectWallet"
import { AuthInput } from "@/components/auth/AuthInput"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type UserRole = "driver" | "investor"

interface SignUpFieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const roleOptions: Array<{ value: UserRole; label: string; description: string; icon: typeof Car }> = [
  {
    value: "driver",
    label: "Driver",
    description: "Pay-to-own and grow your route earnings.",
    icon: Car,
  },
  {
    value: "investor",
    label: "Investor",
    description: "Back verified mobility assets transparently.",
    icon: TrendingUp,
  },
]

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const roleParam = searchParams.get("role")
  const initialRole: UserRole = roleParam === "investor" ? "investor" : "driver"

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({})
  const [formError, setFormError] = useState("")

  const validate = () => {
    const errors: SignUpFieldErrors = {}

    if (!name.trim()) {
      errors.name = "Full name is required."
    }

    if (!email.trim()) {
      errors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address."
    }

    if (!password) {
      errors.password = "Password is required."
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password."
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEmailSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError("")

    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role: selectedRole,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account created",
          description: "Your account is ready. Please sign in.",
        })
        router.push("/signin")
        return
      }

      setFormError(data.message || "Unable to create account right now. Please try again.")
    } catch {
      setFormError("A network error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your ChainMove account"
      description="Set up your account to start participating in transparent mobility ownership and payouts."
      badge={selectedRole === "driver" ? "Driver sign up" : "Investor sign up"}
      sideTitle="Built for drivers, investors, and operators"
      sideDescription="ChainMove connects real vehicles with structured pay-to-own operations and clear ownership records."
      sidePoints={[
        "Fractional ownership and transparent records",
        "Recurring payout rails designed for accountability",
        "Onboarding flow for verified ecosystem participants",
      ]}
      footer={
        <p className="text-sm text-[#666666]">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#F2780E] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E]"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleEmailSignup} noValidate className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-[#1F1F1F]">Join as</legend>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((option) => {
              const isActive = selectedRole === option.value
              const Icon = option.icon

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRole(option.value)}
                  aria-pressed={isActive}
                  className={`rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E] ${
                    isActive
                      ? "border-[#F2780E] bg-[#FFF3E8]"
                      : "border-[#D9D9D9] bg-white hover:border-[#F8BA8A]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1F1F]">
                    <Icon className="h-4 w-4 text-[#F2780E]" />
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#666666]">{option.description}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <AuthInput
          id="name"
          label="Full name"
          icon={User}
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (fieldErrors.name) {
              setFieldErrors((prev) => ({ ...prev, name: undefined }))
            }
          }}
          error={fieldErrors.name}
        />

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
          placeholder="Create a secure password"
          autoComplete="new-password"
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

        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          icon={Lock}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            if (fieldErrors.confirmPassword) {
              setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }))
            }
          }}
          error={fieldErrors.confirmPassword}
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="rounded p-1 text-[#666666] hover:text-[#1F1F1F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E]"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

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
              Creating account...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              Create account
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {selectedRole === "driver" ? (
        <div className="mt-6 border-t border-[#F0F0F0] pt-5">
          <p className="text-sm font-medium text-[#1F1F1F]">Or continue with wallet</p>
          <p className="mt-1 text-xs text-[#777777]">
            Wallet sign up currently provisions driver accounts.
          </p>
          <div className="mt-3">
            <CustomConnectWallet />
          </div>
        </div>
      ) : null}
    </AuthLayout>
  )
}
