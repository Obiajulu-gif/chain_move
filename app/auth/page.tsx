"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wallet, Mail, Car, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomConnectWallet } from "../CustomConnectWallet"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const roleParam = searchParams.get("role") as "driver" | "investor" | null
  const [selectedRole, setSelectedRole] = useState<"driver" | "investor" | null>(roleParam || null)

  // Local choice for the selection step (so users choose, then continue)
  const [roleChoice, setRoleChoice] = useState<"driver" | "investor" | null>(null)

  // State for the email signup form
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: selectedRole }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: "Success", description: "Account created successfully! Please sign in." })
        router.push("/signin")
      } else {
        setError(data.message || "An unexpected error occurred.")
      }
    } catch {
      setError("A network error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // ---------- STEP 1: SIMPLE ROLE SELECTION ----------
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background">
        {/* Sticky branded header (retain) */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={40} height={40} />
                <span className="text-xl sm:text-2xl font-bold text-[#E57700]">ChainMove</span>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="hidden sm:inline text-sm text-muted-foreground">Already have an account?</span>
                <Button variant="outline" size="sm" className="border-border hover:border-[#E57700] hover:text-[#E57700]" asChild>
                  <Link href="/signin">
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Sign In</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Minimal step indicator (retain) */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E57700] text-white flex items-center justify-center text-xs sm:text-sm">1</div>
                <span className="ml-2 font-medium text-xs sm:text-sm">Choose Role</span>
              </div>
              <span className="mx-2 sm:mx-3 h-px w-8 sm:w-10 bg-border" />
              <div className="flex items-center opacity-60">
                <div className="w-6 h-6 rounded-full border border-border text-muted-foreground flex items-center justify-center text-xs sm:text-sm">2</div>
                <span className="ml-2 font-medium text-xs sm:text-sm">Create Account</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                Join 2,500+ Mobility Entrepreneurs
              </Badge>
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Join as a driver or investor</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 px-4">Finance a vehicle or invest in real mobility assets.</p>
          </div>

          {/* Radio-style role options with Gen Z animated edge effect */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <button
              type="button"
              role="radio"
              aria-checked={roleChoice === "driver" ? "true" : "false"}
              onClick={() => setRoleChoice("driver")}
              className={`group relative text-left rounded-xl border bg-card p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-hidden ${
                roleChoice === "driver" ? "border-[#E57700]" : "border-border"
              }`}
            >
              {/* Gen Z animated border effect - starts from bottom, sweeps to top center */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#E57700]/20 via-transparent to-transparent animate-sweep-up" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E57700] to-transparent animate-edge-glow" />
              </div>
              
              <div className="relative flex items-start">
                <div className={`mt-1 mr-3 h-5 w-5 rounded-full border flex-shrink-0 ${roleChoice === "driver" ? "border-[#E57700]" : "border-border"} grid place-items-center transition-colors`}>
                  <span className={`h-2.5 w-2.5 rounded-full transition-all ${roleChoice === "driver" ? "bg-[#E57700] scale-100" : "bg-transparent scale-0"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap">
                    <Car className="h-4 w-4 mr-2 text-[#E57700] flex-shrink-0" />
                    <span className="font-semibold text-foreground text-sm sm:text-base">I'm a Driver</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Get a vehicle. Start earning.</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={roleChoice === "investor" ? "true" : "false"}
              onClick={() => setRoleChoice("investor")}
              className={`group relative text-left rounded-xl border bg-card p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-hidden ${
                roleChoice === "investor" ? "border-[#E57700]" : "border-border"
              }`}
            >
              {/* Gen Z animated border effect - starts from bottom, sweeps to top center */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#E57700]/20 via-transparent to-transparent animate-sweep-up" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E57700] to-transparent animate-edge-glow" />
              </div>
              
              <div className="relative flex items-start">
                <div className={`mt-1 mr-3 h-5 w-5 rounded-full border flex-shrink-0 ${roleChoice === "investor" ? "border-[#E57700]" : "border-border"} grid place-items-center transition-colors`}>
                  <span className={`h-2.5 w-2.5 rounded-full transition-all ${roleChoice === "investor" ? "bg-[#E57700] scale-100" : "bg-transparent scale-0"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap">
                    <TrendingUp className="h-4 w-4 mr-2 text-[#E57700] flex-shrink-0" />
                    <span className="font-semibold text-foreground text-sm sm:text-base">I'm an Investor</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Invest in vehicles. Earn returns.</p>
                </div>
              </div>
            </button>
          </div>

          <div className="max-w-3xl mx-auto mt-6 flex flex-col items-center space-y-4">
            <Button
              className="w-full sm:w-auto px-6 sm:px-8 bg-[#E57700] hover:bg-[#E57700]/90"
              disabled={!roleChoice}
              onClick={() => setSelectedRole(roleChoice)}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="text-center">
              <Link href="/signin" className="text-sm text-[#E57700] hover:text-[#E57700]/80 font-medium">
                Already have an account? Log In
              </Link>
            </div>
          </div>
        </main>

        {/* Add keyframe animations */}
        <style jsx global>{`
          @keyframes sweep-up {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100%);
              opacity: 0;
            }
          }
          
          @keyframes edge-glow {
            0% {
              transform: scaleX(0);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: scaleX(1);
              opacity: 0.8;
            }
          }
          
          .animate-sweep-up {
            animation: sweep-up 1.5s ease-in-out infinite;
          }
          
          .animate-edge-glow {
            animation: edge-glow 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  // ---------- STEP 2: MINIMAL SIGNUP FORM ----------
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky branded header (retain) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={40} height={40} />
              <span className="text-xl sm:text-2xl font-bold text-[#E57700]">ChainMove</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="hidden sm:inline text-sm text-muted-foreground">Already have an account?</span>
              <Button variant="outline" size="sm" className="border-border hover:border-[#E57700] hover:text-[#E57700]" asChild>
                <Link href="/signin">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Minimal step indicator (retain) */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <div className="flex items-center opacity-60">
              <div className="w-6 h-6 rounded-full border border-border grid place-items-center text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span className="ml-2 font-medium text-xs sm:text-sm">Choose Role</span>
            </div>
            <span className="mx-2 sm:mx-3 h-px w-8 sm:w-10 bg-border" />
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#E57700] text-white grid place-items-center text-xs sm:text-sm">2</div>
              <span className="ml-2 font-medium text-xs sm:text-sm">Create Account</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <Badge className="mb-3 px-3 py-1 bg-[#E57700] text-white text-xs sm:text-sm">{selectedRole === "driver" ? "Driver" : "Investor"}</Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{selectedRole === "driver" ? "Join as Driver" : "Join as Investor"}</h2>
            <p className="text-muted-foreground text-xs sm:text-sm px-4">
              {selectedRole === "driver" ? "Create your account to get financed and start earning." : "Create your account to invest in vehicles and earn returns."}
            </p>
            <button onClick={() => setSelectedRole(null)} className="mt-3 inline-flex items-center text-xs sm:text-sm text-[#E57700] hover:text-[#E57700]/80">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to role selection
            </button>
          </div>

          <Card className="bg-card border border-border">
            <CardContent className="pt-6 px-4 sm:px-6">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent border border-border rounded-lg">
                  <TabsTrigger value="wallet" className="flex items-center text-xs sm:text-sm data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center text-xs sm:text-sm data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="space-y-4">
                  <CustomConnectWallet />
                  <p className="text-xs text-muted-foreground text-center">Secure Web3 authentication</p>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                      <Input id="name" type="text" placeholder="Enter your full name" className="text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email address" className="text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                      <Input id="password" type="password" placeholder="Create a secure password" className="text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" className="text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={isLoading} className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white text-sm sm:text-base">
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/signin" className="text-[#E57700] hover:text-[#E57700]/80 font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}