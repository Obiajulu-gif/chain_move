"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Coins, TrendingUp, Vote, Gift, ArrowUpRight, ArrowDownRight, Clock, Wallet, Plus, Minus } from "lucide-react"
import Image from "next/image"

interface TokenTransaction {
  id: string
  type: "earned" | "spent" | "staked" | "unstaked" | "reward"
  amount: number
  description: string
  date: string
  status: "completed" | "pending"
}

interface StakingPool {
  id: string
  name: string
  apr: number
  totalStaked: number
  userStaked: number
  lockPeriod: number
  rewards: number
  status: "active" | "ended"
}

const mockTransactions: TokenTransaction[] = [
  {
    id: "1",
    type: "earned",
    amount: 150,
    description: "Investment completion bonus - Toyota Corolla",
    date: "2024-12-15",
    status: "completed",
  },
  {
    id: "2",
    type: "staked",
    amount: 500,
    description: "Staked in High Yield Pool",
    date: "2024-12-10",
    status: "completed",
  },
  {
    id: "3",
    type: "reward",
    amount: 25,
    description: "Weekly staking rewards",
    date: "2024-12-08",
    status: "completed",
  },
  {
    id: "4",
    type: "earned",
    amount: 100,
    description: "Referral bonus - New investor",
    date: "2024-12-05",
    status: "completed",
  },
  {
    id: "5",
    type: "spent",
    amount: 50,
    description: "DAO proposal submission fee",
    date: "2024-12-01",
    status: "completed",
  },
]

const mockStakingPools: StakingPool[] = [
  {
    id: "1",
    name: "High Yield Pool",
    apr: 18.5,
    totalStaked: 2500000,
    userStaked: 500,
    lockPeriod: 90,
    rewards: 125,
    status: "active",
  },
  {
    id: "2",
    name: "Flexible Pool",
    apr: 12.0,
    totalStaked: 1800000,
    userStaked: 300,
    lockPeriod: 0,
    rewards: 45,
    status: "active",
  },
  {
    id: "3",
    name: "Long Term Pool",
    apr: 25.0,
    totalStaked: 950000,
    userStaked: 0,
    lockPeriod: 365,
    rewards: 0,
    status: "active",
  },
]

export default function GovernanceTokensPage() {
  const [transactions] = useState<TokenTransaction[]>(mockTransactions)
  const [stakingPools] = useState<StakingPool[]>(mockStakingPools)
  const [activeTab, setActiveTab] = useState("overview")

  const totalTokens = 2450
  const stakedTokens = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0)
  const availableTokens = totalTokens - stakedTokens
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0)
  const votingPower = (totalTokens / 76500) * 100 // Assuming total supply of 76,500 tokens

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
      case "reward":
        return <ArrowUpRight className="h-4 w-4 text-green-400" />
      case "spent":
        return <ArrowDownRight className="h-4 w-4 text-red-400" />
      case "staked":
        return <Plus className="h-4 w-4 text-blue-400" />
      case "unstaked":
        return <Minus className="h-4 w-4 text-yellow-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
      case "reward":
        return "text-green-400"
      case "spent":
        return "text-red-400"
      case "staked":
        return "text-blue-400"
      case "unstaked":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="investor" />

      <div className="md:ml-64">
        <Header userName="Marcus" userStatus="Verified Investor" />

        <div className="p-6">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <Image
                  src="/images/dashboard-hero.png"
                  alt="Governance tokens hero"
                  width={600}
                  height={400}
                  className="rounded-2xl object-cover w-full h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-2xl" />
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-4">Governance Tokens</h1>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Manage your ChainMove governance tokens. Stake for rewards, participate in voting, and earn tokens
                    through platform activities.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <div className="w-3 h-3 bg-[#E57700] rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Token Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Tokens</CardTitle>
                <Coins className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</div>
                <p className="text-xs text-gray-400">CHMV Tokens</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Available</CardTitle>
                <Wallet className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{availableTokens.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Ready to use</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Staked</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stakedTokens.toLocaleString()}</div>
                <p className="text-xs text-green-400">Earning rewards</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Voting Power</CardTitle>
                <Vote className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{votingPower.toFixed(2)}%</div>
                <p className="text-xs text-gray-400">Of total supply</p>
              </CardContent>
            </Card>
          </div>

          {/* Token Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-[#2a3441] border-gray-700">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="staking"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Staking
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Rewards
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Token Distribution</CardTitle>
                    <CardDescription className="text-gray-400">How your tokens are allocated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Available</span>
                        <span className="text-white font-semibold">{availableTokens.toLocaleString()} CHMV</span>
                      </div>
                      <Progress value={(availableTokens / totalTokens) * 100} className="h-2 bg-gray-600" />

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Staked</span>
                        <span className="text-white font-semibold">{stakedTokens.toLocaleString()} CHMV</span>
                      </div>
                      <Progress value={(stakedTokens / totalTokens) * 100} className="h-2 bg-gray-600" />

                      <div className="pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total</span>
                          <span className="text-white font-bold text-lg">{totalTokens.toLocaleString()} CHMV</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Earning Opportunities</CardTitle>
                    <CardDescription className="text-gray-400">Ways to earn more tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Gift className="h-5 w-5 text-[#E57700]" />
                          <div>
                            <p className="text-sm font-medium text-white">Investment Completion</p>
                            <p className="text-xs text-gray-400">Earn tokens when investments complete</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white">50-200 CHMV</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Vote className="h-5 w-5 text-[#E57700]" />
                          <div>
                            <p className="text-sm font-medium text-white">DAO Participation</p>
                            <p className="text-xs text-gray-400">Vote on proposals and governance</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white">10-50 CHMV</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-[#E57700]" />
                          <div>
                            <p className="text-sm font-medium text-white">Staking Rewards</p>
                            <p className="text-xs text-gray-400">Earn up to 25% APR</p>
                          </div>
                        </div>
                        <Badge className="bg-purple-600 text-white">Weekly</Badge>
                      </div>

                      <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        View All Opportunities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking" className="space-y-6">
              <div className="grid gap-6">
                {stakingPools.map((pool) => (
                  <Card key={pool.id} className="bg-[#2a3441] border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                          <p className="text-sm text-gray-400">
                            {pool.lockPeriod === 0 ? "Flexible staking" : `${pool.lockPeriod} days lock period`}
                          </p>
                        </div>
                        <Badge className="bg-green-600 text-white">{pool.apr}% APR</Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Your Stake</p>
                          <p className="text-lg font-semibold text-white">{pool.userStaked.toLocaleString()} CHMV</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Staked</p>
                          <p className="text-lg font-semibold text-white">{pool.totalStaked.toLocaleString()} CHMV</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Your Rewards</p>
                          <p className="text-lg font-semibold text-green-400">{pool.rewards.toLocaleString()} CHMV</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <Badge className={pool.status === "active" ? "bg-green-600" : "bg-gray-600"}>
                            {pool.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {pool.userStaked > 0 ? (
                          <>
                            <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Add More</Button>
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              Claim Rewards
                            </Button>
                            {pool.lockPeriod === 0 && (
                              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                                Unstake
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Start Staking</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-[#2a3441] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                  <CardDescription className="text-gray-400">Your token transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-[#1a2332] rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="text-sm font-medium text-white">{transaction.description}</p>
                            <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === "spent" ? "-" : "+"}
                            {transaction.amount} CHMV
                          </p>
                          <Badge className={transaction.status === "completed" ? "bg-green-600" : "bg-yellow-600"}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Pending Rewards</CardTitle>
                    <CardDescription className="text-gray-400">Rewards ready to claim</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <div className="text-3xl font-bold text-[#E57700] mb-2">{totalRewards.toLocaleString()}</div>
                      <p className="text-gray-400 mb-4">CHMV Tokens</p>
                      <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Claim All Rewards</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Reward Breakdown</CardTitle>
                    <CardDescription className="text-gray-400">Sources of your rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stakingPools
                        .filter((pool) => pool.rewards > 0)
                        .map((pool) => (
                          <div key={pool.id} className="flex justify-between items-center">
                            <span className="text-gray-400">{pool.name}</span>
                            <span className="text-white font-semibold">{pool.rewards} CHMV</span>
                          </div>
                        ))}
                      <div className="pt-3 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total</span>
                          <span className="text-white font-bold">{totalRewards} CHMV</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
