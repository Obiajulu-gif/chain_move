"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Vote,
  Wallet,
} from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatNaira } from "@/lib/currency"
import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"

type VoteChoice = "for" | "against" | "abstain"
type ProposalStatus = "active" | "passed" | "rejected" | "queued"

interface DaoProposal {
  id: string
  title: string
  summary: string
  description: string
  category: "governance" | "treasury" | "protocol" | "expansion"
  status: ProposalStatus
  createdAt: string
  endsAt: string
  quorum: number
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  userVote?: VoteChoice
}

const PROPOSAL_SEED: DaoProposal[] = [
  {
    id: "cmp-001",
    title: "Expand EV financing pool by 15%",
    summary: "Increase treasury allocation for high-demand electric vehicle financing.",
    description:
      "This proposal allocates an additional 15% of current treasury reserves to electric vehicle financing pools. The target is to shorten listing wait-time and improve capital utilization during peak demand windows.",
    category: "treasury",
    status: "active",
    createdAt: "2026-02-03T12:00:00.000Z",
    endsAt: "2026-02-18T12:00:00.000Z",
    quorum: 4500,
    votesFor: 3620,
    votesAgainst: 610,
    votesAbstain: 220,
  },
  {
    id: "cmp-002",
    title: "Introduce weekly governance digest",
    summary: "Automated investor digest covering votes, treasury events, and execution updates.",
    description:
      "Create a weekly digest distributed to governance participants with proposal snapshots, treasury movement summaries, and execution timelines. This improves governance transparency and actionability for investors.",
    category: "governance",
    status: "active",
    createdAt: "2026-02-05T10:30:00.000Z",
    endsAt: "2026-02-20T10:30:00.000Z",
    quorum: 3000,
    votesFor: 2100,
    votesAgainst: 540,
    votesAbstain: 180,
  },
  {
    id: "cmp-003",
    title: "Deploy repayment oracle upgrade",
    summary: "Protocol upgrade for repayment event indexing and faster settlement confirmations.",
    description:
      "This protocol change upgrades indexing for repayment events and reduces delayed settlement confirmation windows. It targets lower operational friction in driver repayment reporting and investor accounting.",
    category: "protocol",
    status: "passed",
    createdAt: "2026-01-24T08:00:00.000Z",
    endsAt: "2026-02-08T08:00:00.000Z",
    quorum: 4200,
    votesFor: 4810,
    votesAgainst: 820,
    votesAbstain: 210,
    userVote: "for",
  },
]

const STATUS_STYLES: Record<ProposalStatus, string> = {
  active: "bg-blue-600 text-white",
  passed: "bg-emerald-600 text-white",
  rejected: "bg-red-600 text-white",
  queued: "bg-amber-600 text-white",
}

const CATEGORY_LABELS: Record<DaoProposal["category"], string> = {
  governance: "Governance",
  treasury: "Treasury",
  protocol: "Protocol",
  expansion: "Expansion",
}

export default function DaoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, loading: authLoading } = useAuth()
  const { address, chain, isConnected } = useAccount()

  const investorName = getUserDisplayName(authUser, "Investor")

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proposals, setProposals] = useState<DaoProposal[]>([])
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [voteIntent, setVoteIntent] = useState<VoteChoice | null>(null)

  const loadProposals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setProposals(PROPOSAL_SEED)
      setSelectedProposalId((prev) => prev || PROPOSAL_SEED[0]?.id || null)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load governance proposals.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProposals()
  }, [loadProposals])

  const selectedProposal = useMemo(() => {
    return proposals.find((proposal) => proposal.id === selectedProposalId) || null
  }, [proposals, selectedProposalId])

  const governanceStats = useMemo(() => {
    const totalVotes = proposals.reduce(
      (sum, proposal) => sum + proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain,
      0,
    )
    const activeProposals = proposals.filter((proposal) => proposal.status === "active").length
    const treasuryValue = 342_000_000
    const treasuryRunwayMonths = 18
    const participationRate = proposals.length
      ? Math.round((totalVotes / proposals.reduce((sum, proposal) => sum + proposal.quorum, 0)) * 100)
      : 0

    return {
      treasuryValue,
      treasuryRunwayMonths,
      activeProposals,
      participationRate,
    }
  }, [proposals])

  const selectedVoteSummary = useMemo(() => {
    if (!selectedProposal) return null
    const total = selectedProposal.votesFor + selectedProposal.votesAgainst + selectedProposal.votesAbstain
    return {
      total,
      forPercent: total ? (selectedProposal.votesFor / total) * 100 : 0,
      againstPercent: total ? (selectedProposal.votesAgainst / total) * 100 : 0,
      abstainPercent: total ? (selectedProposal.votesAbstain / total) * 100 : 0,
      quorumProgress: selectedProposal.quorum ? (total / selectedProposal.quorum) * 100 : 0,
    }
  }, [selectedProposal])

  const handleVote = async (choice: VoteChoice) => {
    if (!selectedProposal) return

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Connect your wallet to vote on proposals.",
        variant: "destructive",
      })
      return
    }

    if (selectedProposal.status !== "active") {
      toast({
        title: "Voting closed",
        description: "This proposal is no longer open for voting.",
        variant: "destructive",
      })
      return
    }

    if (selectedProposal.userVote) {
      toast({
        title: "Vote already recorded",
        description: `You voted "${selectedProposal.userVote}" on this proposal.`,
      })
      return
    }

    setIsVoting(true)
    setVoteIntent(choice)
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))

      setProposals((prev) =>
        prev.map((proposal) => {
          if (proposal.id !== selectedProposal.id) return proposal
          return {
            ...proposal,
            votesFor: proposal.votesFor + (choice === "for" ? 1 : 0),
            votesAgainst: proposal.votesAgainst + (choice === "against" ? 1 : 0),
            votesAbstain: proposal.votesAbstain + (choice === "abstain" ? 1 : 0),
            userVote: choice,
          }
        }),
      )

      toast({
        title: "Vote submitted",
        description: `Your ${choice} vote was recorded on-chain wallet context.`,
      })
    } catch (voteError) {
      toast({
        title: "Vote failed",
        description: voteError instanceof Error ? voteError.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
      setVoteIntent(null)
    }
  }

  if (authLoading) {
    return <DashboardRouteLoading title="Loading DAO governance" description="Preparing wallet and proposal state." />
  }

  if (!authUser || authUser.role !== "investor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need an investor account to access DAO governance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="investor" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Investor" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  DAO governance
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Governance center for {investorName}</h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Review proposals, monitor treasury health, and vote using your connected wallet.
                </p>
              </div>

              <Card className="w-full lg:max-w-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Wallet status</CardTitle>
                  <CardDescription>Voting requires an active wallet connection.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border p-3 text-sm">
                    <p className="font-medium">{isConnected ? "Connected" : "Not connected"}</p>
                    <p className="text-muted-foreground">
                      {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect to enable voting"}
                    </p>
                    {chain ? <p className="mt-1 text-xs text-muted-foreground">Network: {chain.name}</p> : null}
                  </div>

                  <div className="w-fit">
                    <ConnectButton />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Treasury value</CardDescription>
                <CardTitle>{formatNaira(governanceStats.treasuryValue)}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Protocol-owned assets and reserves</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Runway</CardDescription>
                <CardTitle>{governanceStats.treasuryRunwayMonths} months</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Estimated at current treasury spend</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active proposals</CardDescription>
                <CardTitle>{governanceStats.activeProposals}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Open for voting now</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Participation index</CardDescription>
                <CardTitle>{governanceStats.participationRate}%</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Votes cast versus quorum targets</CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>Proposals</CardTitle>
                  <CardDescription>Latest governance activity and voting status.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={loadProposals} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="rounded-xl border p-4">
                        <Skeleton className="mb-2 h-4 w-52" />
                        <Skeleton className="mb-3 h-3 w-32" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Unable to load proposals</p>
                        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={loadProposals}>
                          Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : proposals.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <Vote className="mx-auto h-9 w-9 text-muted-foreground" />
                    <h3 className="mt-3 font-semibold">No proposals yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Governance proposals will appear here once created.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proposals.map((proposal) => (
                      <button
                        key={proposal.id}
                        type="button"
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                          selectedProposalId === proposal.id ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                        }`}
                        onClick={() => setSelectedProposalId(proposal.id)}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge className={STATUS_STYLES[proposal.status]}>{proposal.status}</Badge>
                          <Badge variant="outline">{CATEGORY_LABELS[proposal.category]}</Badge>
                          {proposal.userVote ? <Badge variant="secondary">Voted: {proposal.userVote}</Badge> : null}
                        </div>

                        <p className="font-medium">{proposal.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{proposal.summary}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Ends: {new Date(proposal.endsAt).toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal details</CardTitle>
                <CardDescription>Review context, voting distribution, and action state.</CardDescription>
              </CardHeader>

              <CardContent>
                {!selectedProposal ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <Clock3 className="mx-auto h-9 w-9 text-muted-foreground" />
                    <h3 className="mt-3 font-semibold">Select a proposal</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Choose a proposal from the list to inspect details.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl border p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge className={STATUS_STYLES[selectedProposal.status]}>{selectedProposal.status}</Badge>
                        <Badge variant="outline">{CATEGORY_LABELS[selectedProposal.category]}</Badge>
                      </div>
                      <p className="font-semibold">{selectedProposal.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedProposal.description}</p>
                    </div>

                    {selectedVoteSummary ? (
                      <div className="space-y-3 rounded-xl border p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total votes</span>
                          <span className="font-medium">{selectedVoteSummary.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Quorum target</span>
                          <span className="font-medium">{selectedProposal.quorum.toLocaleString()}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Quorum progress</span>
                            <span>{Math.min(selectedVoteSummary.quorumProgress, 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={Math.min(selectedVoteSummary.quorumProgress, 100)} className="h-2" />
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>For: {selectedVoteSummary.forPercent.toFixed(1)}%</p>
                          <p>Against: {selectedVoteSummary.againstPercent.toFixed(1)}%</p>
                          <p>Abstain: {selectedVoteSummary.abstainPercent.toFixed(1)}%</p>
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-2 rounded-xl border p-4">
                      <p className="text-sm font-medium">Cast vote</p>
                      {!isConnected ? (
                        <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                          Connect wallet to enable voting.
                        </div>
                      ) : null}

                      {selectedProposal.userVote ? (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          You already voted <span className="font-medium">{selectedProposal.userVote}</span>.
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {(["for", "against", "abstain"] as VoteChoice[]).map((choice) => (
                          <Button
                            key={choice}
                            variant={choice === "for" ? "default" : "outline"}
                            className={choice === "for" ? "bg-[#E57700] text-white hover:bg-[#E57700]/90" : ""}
                            disabled={
                              !isConnected ||
                              selectedProposal.status !== "active" ||
                              Boolean(selectedProposal.userVote) ||
                              isVoting
                            }
                            onClick={() => handleVote(choice)}
                          >
                            {isVoting && voteIntent === choice ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting
                              </>
                            ) : (
                              choice
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        Votes are wallet-gated and tracked in UI state until production contract wiring is configured.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need more voting power?</CardTitle>
                <CardDescription>Increase participation by expanding your active investment base.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => router.push("/dashboard/investor/invest")}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Go to invest flow
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
