import mongoose from "mongoose"

import Investment from "@/models/Investment"
import InvestmentPool from "@/models/InvestmentPool"
import PoolInvestment from "@/models/PoolInvestment"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import Vehicle from "@/models/Vehicle"
import {
  buildAnalyticsWindow,
  countPrivyMappedUsers,
  countUsers,
  countVerifiedUsers,
  ensureAnalyticsDb,
  getDepositMethodBreakdown,
  getPoolFundingSummary,
  parseAnalyticsRange,
  sumDepositsNgn,
  sumInvestmentsNgn,
  sumReturnsPaidNgn,
  type AnalyticsRange,
} from "@/src/server/analytics/shared"

export type AdminAnalyticsRange = AnalyticsRange

interface AdminAnalyticsInput {
  range?: AdminAnalyticsRange
}

interface AdminRecentUser {
  id: string
  name: string
  email: string | null
  privyUserId: string | null
  role: string
  createdAt: string
}

interface AdminRecentDeposit {
  id: string
  userName: string
  userEmail: string | null
  amountNgn: number
  method: string
  status: string
  reference: string | null
  timestamp: string
}

interface AdminRecentInvestment {
  id: string
  source: "pool" | "legacy"
  userName: string
  userEmail: string | null
  assetLabel: string
  amountNgn: number
  ownershipBps: number | null
  status: string
  timestamp: string
}

interface AdminTopAsset {
  assetType: string
  poolsCount: number
  investorCount: number
  raisedNgn: number
  targetNgn: number
  progressRatio: number
}

interface AdminActivityItem {
  id: string
  kind: "user" | "deposit" | "investment"
  title: string
  subtitle: string
  timestamp: string
}

export interface AdminDashboardAnalytics {
  range: AdminAnalyticsRange
  startDate: string | null
  generatedAt: string
  totals: {
    totalUsers: number
    privyMappedUsers: number
    verifiedUsers: number
    totalDepositsNgn: number
    totalInvestedNgn: number
    totalReturnsPaidNgn: number
    activePoolsCount: number
    openPoolsCount: number
    fundedPoolsCount: number
    totalRaisedAcrossPoolsNgn: number
  }
  breakdowns: {
    depositMethods: Array<{ method: string; totalAmountNgn: number; count: number }>
    pools: {
      openPoolsCount: number
      fundedPoolsCount: number
      closedPoolsCount: number
      activePoolsCount: number
      totalRaisedAcrossPoolsNgn: number
      totalTargetAcrossPoolsNgn: number
    }
    topAssets: AdminTopAsset[]
  }
  recent: {
    users: AdminRecentUser[]
    deposits: AdminRecentDeposit[]
    investments: AdminRecentInvestment[]
  }
  platformActivity: AdminActivityItem[]
  notes: string[]
}

function getDateQuery(field: string, startDate: Date | null) {
  if (!startDate) return {}
  return { [field]: { $gte: startDate } }
}

function toReadableMethod(method: string) {
  if (!method || method === "unknown") return "Unknown"
  return method
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ")
}

function toReadableName(user: { name?: string; fullName?: string; email?: string | null } | undefined) {
  if (!user) return "Unknown User"
  if (user.fullName && user.fullName.trim()) return user.fullName.trim()
  if (user.name && user.name.trim()) return user.name.trim()
  if (user.email) return user.email.split("@")[0]
  return "Unknown User"
}

function toIsoDate(input: Date | string | undefined | null) {
  if (!input) return new Date(0).toISOString()
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return new Date(0).toISOString()
  return date.toISOString()
}

function normalizeObjectId(value: unknown) {
  if (value instanceof mongoose.Types.ObjectId) return value
  if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value)
  }
  return null
}

function collectObjectIds(values: unknown[]) {
  const map = new Map<string, mongoose.Types.ObjectId>()
  for (const value of values) {
    const normalized = normalizeObjectId(value)
    if (!normalized) continue
    map.set(normalized.toString(), normalized)
  }
  return Array.from(map.values())
}

async function loadRecentUsers(startDate: Date | null): Promise<AdminRecentUser[]> {
  const docs = await User.find(getDateQuery("createdAt", startDate))
    .sort({ createdAt: -1 })
    .limit(10)
    .select("name fullName email privyUserId role createdAt")
    .lean()

  return docs.map((doc: any) => ({
    id: doc._id.toString(),
    name: toReadableName(doc),
    email: doc.email || null,
    privyUserId: doc.privyUserId || null,
    role: doc.role || "unknown",
    createdAt: toIsoDate(doc.createdAt),
  }))
}

async function loadRecentDeposits(startDate: Date | null): Promise<AdminRecentDeposit[]> {
  const docs = await Transaction.find({
    type: { $in: ["deposit", "wallet_funding"] },
    status: { $in: ["Completed", "completed", "SUCCESS", "success", "Successful", "successful"] },
    ...getDateQuery("timestamp", startDate),
  })
    .sort({ timestamp: -1 })
    .limit(10)
    .select("userId amount method status gatewayReference timestamp")
    .lean()

  const userIds = docs
    .map((doc: any) => doc.userId)
  const normalizedUserIds = collectObjectIds(userIds)

  const users = normalizedUserIds.length
    ? await User.find({ _id: { $in: normalizedUserIds } }).select("name fullName email").lean()
    : []

  const usersById = new Map(users.map((user: any) => [user._id.toString(), user]))

  return docs.map((doc: any) => {
    const user = usersById.get(doc.userId?.toString?.() || "")
    return {
      id: doc._id.toString(),
      userName: toReadableName(user),
      userEmail: user?.email || null,
      amountNgn: Number(doc.amount || 0),
      method: toReadableMethod(doc.method || "unknown"),
      status: String(doc.status || "unknown"),
      reference: doc.gatewayReference || null,
      timestamp: toIsoDate(doc.timestamp),
    }
  })
}

async function loadRecentInvestments(startDate: Date | null): Promise<AdminRecentInvestment[]> {
  const [poolDocs, legacyDocs] = await Promise.all([
    PoolInvestment.find({
      status: "CONFIRMED",
      ...getDateQuery("createdAt", startDate),
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .select("userId poolId amountNgn ownershipBps status createdAt")
      .lean(),
    Investment.find({
      status: { $in: ["Active", "Completed"] },
      ...getDateQuery("date", startDate),
    })
      .sort({ date: -1 })
      .limit(30)
      .select("investorId vehicleId amount status date")
      .lean(),
  ])

  const userIds = collectObjectIds([
    ...poolDocs.map((doc: any) => doc.userId),
    ...legacyDocs.map((doc: any) => doc.investorId),
  ])

  const poolIds = collectObjectIds(
    poolDocs
    .map((doc: any) => doc.poolId)
  )

  const vehicleIds = collectObjectIds(
    legacyDocs
    .map((doc: any) => doc.vehicleId)
  )

  const [users, pools, vehicles] = await Promise.all([
    userIds.length ? User.find({ _id: { $in: userIds } }).select("name fullName email").lean() : Promise.resolve([]),
    poolIds.length ? InvestmentPool.find({ _id: { $in: poolIds } }).select("assetType").lean() : Promise.resolve([]),
    vehicleIds.length ? Vehicle.find({ _id: { $in: vehicleIds } }).select("name type").lean() : Promise.resolve([]),
  ])

  const usersById = new Map(users.map((user: any) => [user._id.toString(), user]))
  const poolsById = new Map(pools.map((pool: any) => [pool._id.toString(), pool]))
  const vehiclesById = new Map(vehicles.map((vehicle: any) => [vehicle._id.toString(), vehicle]))

  const normalizedPoolInvestments: AdminRecentInvestment[] = poolDocs.map((doc: any) => {
    const user = usersById.get(doc.userId?.toString?.() || "")
    const pool = poolsById.get(doc.poolId?.toString?.() || "")
    return {
      id: `pool-${doc._id.toString()}`,
      source: "pool",
      userName: toReadableName(user),
      userEmail: user?.email || null,
      assetLabel: pool?.assetType ? `${pool.assetType} Pool` : "Pool",
      amountNgn: Number(doc.amountNgn || 0),
      ownershipBps: Number.isFinite(doc.ownershipBps) ? Number(doc.ownershipBps) : null,
      status: String(doc.status || "unknown"),
      timestamp: toIsoDate(doc.createdAt),
    }
  })

  const normalizedLegacyInvestments: AdminRecentInvestment[] = legacyDocs.map((doc: any) => {
    const user = usersById.get(doc.investorId?.toString?.() || "")
    const vehicle = vehiclesById.get(doc.vehicleId?.toString?.() || "")
    const vehicleLabel = vehicle?.name || vehicle?.type || "Vehicle"
    return {
      id: `legacy-${doc._id.toString()}`,
      source: "legacy",
      userName: toReadableName(user),
      userEmail: user?.email || null,
      assetLabel: vehicleLabel,
      amountNgn: Number(doc.amount || 0),
      ownershipBps: null,
      status: String(doc.status || "unknown"),
      timestamp: toIsoDate(doc.date),
    }
  })

  return [...normalizedPoolInvestments, ...normalizedLegacyInvestments]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
}

async function loadTopAssets(startDate: Date | null): Promise<AdminTopAsset[]> {
  const rows = await InvestmentPool.aggregate([
    { $match: getDateQuery("createdAt", startDate) },
    {
      $group: {
        _id: "$assetType",
        poolsCount: { $sum: 1 },
        investorCount: { $sum: "$investorCount" },
        raisedNgn: { $sum: "$currentRaisedNgn" },
        targetNgn: { $sum: "$targetAmountNgn" },
      },
    },
    { $sort: { raisedNgn: -1 } },
    { $limit: 5 },
  ])

  return rows.map((row) => {
    const raisedNgn = Number(row.raisedNgn || 0)
    const targetNgn = Number(row.targetNgn || 0)
    return {
      assetType: String(row._id || "Unknown"),
      poolsCount: Number(row.poolsCount || 0),
      investorCount: Number(row.investorCount || 0),
      raisedNgn,
      targetNgn,
      progressRatio: targetNgn > 0 ? raisedNgn / targetNgn : 0,
    }
  })
}

function buildPlatformActivity({
  recentUsers,
  recentDeposits,
  recentInvestments,
}: {
  recentUsers: AdminRecentUser[]
  recentDeposits: AdminRecentDeposit[]
  recentInvestments: AdminRecentInvestment[]
}) {
  const userEvents: AdminActivityItem[] = recentUsers.map((user) => ({
    id: `user-${user.id}`,
    kind: "user",
    title: `${user.name} joined`,
    subtitle: user.email || user.privyUserId || "New user record",
    timestamp: user.createdAt,
  }))

  const depositEvents: AdminActivityItem[] = recentDeposits.map((deposit) => ({
    id: `deposit-${deposit.id}`,
    kind: "deposit",
    title: `${deposit.userName} funded wallet`,
    subtitle: `${toReadableMethod(deposit.method)} deposit`,
    timestamp: deposit.timestamp,
  }))

  const investmentEvents: AdminActivityItem[] = recentInvestments.map((investment) => ({
    id: `investment-${investment.id}`,
    kind: "investment",
    title: `${investment.userName} invested`,
    subtitle: investment.assetLabel,
    timestamp: investment.timestamp,
  }))

  return [...depositEvents, ...investmentEvents, ...userEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12)
}

export function parseAdminAnalyticsRange(rawRange?: string | null): AdminAnalyticsRange {
  return parseAnalyticsRange(rawRange)
}

export async function getAdminDashboardAnalytics({ range = "30d" }: AdminAnalyticsInput = {}): Promise<AdminDashboardAnalytics> {
  await ensureAnalyticsDb()

  const normalizedRange = parseAnalyticsRange(range)
  const window = buildAnalyticsWindow(normalizedRange)

  const [totalUsers, privyMappedUsers, verifiedUsers, totalDepositsNgn, totalInvestedNgn, totalReturnsPaidNgn, poolSummary] =
    await Promise.all([
      countUsers({ startDate: window.startDate }),
      countPrivyMappedUsers({ startDate: window.startDate }),
      countVerifiedUsers({ startDate: window.startDate }),
      sumDepositsNgn({ startDate: window.startDate }),
      sumInvestmentsNgn({ startDate: window.startDate }),
      sumReturnsPaidNgn({ startDate: window.startDate }),
      getPoolFundingSummary({ startDate: window.startDate }),
    ])

  const [depositMethods, topAssets, recentUsers, recentDeposits, recentInvestments] = await Promise.all([
    getDepositMethodBreakdown({ startDate: window.startDate }),
    loadTopAssets(window.startDate),
    loadRecentUsers(window.startDate),
    loadRecentDeposits(window.startDate),
    loadRecentInvestments(window.startDate),
  ])

  const notes: string[] = []
  if (privyMappedUsers < totalUsers) {
    notes.push(
      "User counts are based on internal DB records. Privy users not yet mapped into the DB cannot be counted globally.",
    )
  }

  return {
    range: normalizedRange,
    startDate: window.startDate ? window.startDate.toISOString() : null,
    generatedAt: new Date().toISOString(),
    totals: {
      totalUsers,
      privyMappedUsers,
      verifiedUsers,
      totalDepositsNgn,
      totalInvestedNgn,
      totalReturnsPaidNgn,
      activePoolsCount: poolSummary.activePoolsCount,
      openPoolsCount: poolSummary.openPoolsCount,
      fundedPoolsCount: poolSummary.fundedPoolsCount,
      totalRaisedAcrossPoolsNgn: poolSummary.totalRaisedAcrossPoolsNgn,
    },
    breakdowns: {
      depositMethods: depositMethods.map((item) => ({
        ...item,
        method: toReadableMethod(item.method),
      })),
      pools: poolSummary,
      topAssets,
    },
    recent: {
      users: recentUsers,
      deposits: recentDeposits,
      investments: recentInvestments,
    },
    platformActivity: buildPlatformActivity({ recentUsers, recentDeposits, recentInvestments }),
    notes,
  }
}
