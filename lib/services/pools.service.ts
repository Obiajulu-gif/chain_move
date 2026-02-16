import mongoose from "mongoose"
import InvestmentPool, { type PoolAssetType } from "@/models/InvestmentPool"
import PoolInvestment from "@/models/PoolInvestment"

export const ASSET_PRICE_NGN: Record<PoolAssetType, number> = {
  SHUTTLE: 4_600_000,
  KEKE: 3_500_000,
}

interface CreatePoolInput {
  assetType: PoolAssetType
  createdBy: string
  targetAmountNgn?: number
  minContributionNgn?: number
  description?: string
}

export interface PoolSummary {
  id: string
  assetType: PoolAssetType
  assetPriceNgn: number
  targetAmountNgn: number
  minContributionNgn: number
  status: "OPEN" | "FUNDED" | "CLOSED"
  currentRaisedNgn: number
  investorCount: number
  remainingAmountNgn: number
  progressRatio: number
  description?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  userOwnershipUnits?: number
  userOwnershipBps?: number
  userInvestedNgn?: number
}

function normalizePool(pool: any): PoolSummary {
  const remainingAmountNgn = Math.max(pool.targetAmountNgn - pool.currentRaisedNgn, 0)
  const progressRatio = pool.targetAmountNgn > 0 ? pool.currentRaisedNgn / pool.targetAmountNgn : 0

  return {
    id: pool._id.toString(),
    assetType: pool.assetType,
    assetPriceNgn: pool.assetPriceNgn,
    targetAmountNgn: pool.targetAmountNgn,
    minContributionNgn: pool.minContributionNgn,
    status: pool.status,
    currentRaisedNgn: pool.currentRaisedNgn,
    investorCount: pool.investorCount,
    remainingAmountNgn,
    progressRatio,
    description: pool.description,
    createdBy: pool.createdBy.toString(),
    createdAt: pool.createdAt.toISOString(),
    updatedAt: pool.updatedAt.toISOString(),
  }
}

export async function createPool({
  assetType,
  createdBy,
  targetAmountNgn,
  minContributionNgn,
  description,
}: CreatePoolInput) {
  const assetPriceNgn = ASSET_PRICE_NGN[assetType]
  const target = targetAmountNgn ?? assetPriceNgn
  const minContribution = minContributionNgn ?? 5_000

  if (!Number.isFinite(target) || target <= 0) {
    throw new Error("Target amount must be greater than zero.")
  }

  if (!Number.isFinite(minContribution) || minContribution <= 0) {
    throw new Error("Minimum contribution must be greater than zero.")
  }

  if (minContribution > target) {
    throw new Error("Minimum contribution cannot exceed target amount.")
  }

  const pool = await InvestmentPool.create({
    assetType,
    assetPriceNgn,
    targetAmountNgn: target,
    minContributionNgn: minContribution,
    status: "OPEN",
    currentRaisedNgn: 0,
    investorCount: 0,
    createdBy,
    description: description?.trim() || undefined,
  })

  return normalizePool(pool.toObject())
}

export async function listPools(userId?: string): Promise<PoolSummary[]> {
  const pools = await InvestmentPool.find({}).sort({ createdAt: -1 }).lean()
  if (pools.length === 0) return []

  const normalizedPools = pools.map(normalizePool)

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return normalizedPools
  }

  const poolObjectIds = pools.map((pool) => pool._id)
  const ownershipRows = await PoolInvestment.aggregate([
    {
      $match: {
        poolId: { $in: poolObjectIds },
        userId: new mongoose.Types.ObjectId(userId),
        status: "CONFIRMED",
      },
    },
    {
      $group: {
        _id: "$poolId",
        ownershipUnits: { $sum: "$ownershipUnits" },
        ownershipBps: { $sum: "$ownershipBps" },
        amountNgn: { $sum: "$amountNgn" },
      },
    },
  ])

  const ownershipByPool = new Map(
    ownershipRows.map((row) => [
      row._id.toString(),
      {
        ownershipUnits: row.ownershipUnits,
        ownershipBps: row.ownershipBps,
        amountNgn: row.amountNgn,
      },
    ]),
  )

  return normalizedPools.map((pool) => {
    const ownership = ownershipByPool.get(pool.id)
    return {
      ...pool,
      userOwnershipUnits: ownership?.ownershipUnits ?? 0,
      userOwnershipBps: ownership?.ownershipBps ?? 0,
      userInvestedNgn: ownership?.amountNgn ?? 0,
    }
  })
}

export async function getPoolById(poolId: string, userId?: string) {
  if (!mongoose.Types.ObjectId.isValid(poolId)) {
    throw new Error("Invalid pool ID.")
  }

  const poolObjectId = new mongoose.Types.ObjectId(poolId)
  const pool = await InvestmentPool.findById(poolObjectId).lean()
  if (!pool) {
    throw new Error("Pool not found.")
  }

  const normalizedPool = normalizePool(pool)

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return normalizedPool
  }

  const ownership = await PoolInvestment.aggregate([
    {
      $match: {
        poolId: poolObjectId,
        userId: new mongoose.Types.ObjectId(userId),
        status: "CONFIRMED",
      },
    },
    {
      $group: {
        _id: "$poolId",
        ownershipUnits: { $sum: "$ownershipUnits" },
        ownershipBps: { $sum: "$ownershipBps" },
        amountNgn: { $sum: "$amountNgn" },
      },
    },
  ])

  const currentUserOwnership = ownership[0]

  return {
    ...normalizedPool,
    userOwnershipUnits: currentUserOwnership?.ownershipUnits ?? 0,
    userOwnershipBps: currentUserOwnership?.ownershipBps ?? 0,
    userInvestedNgn: currentUserOwnership?.amountNgn ?? 0,
  }
}
