import mongoose from "mongoose"
import InvestmentPool, { type PoolAssetType } from "@/models/InvestmentPool"
import PoolInvestment from "@/models/PoolInvestment"
import { TOTAL_OWNERSHIP_UNITS } from "@/lib/services/investments.service"

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

const TOTAL_OWNERSHIP_BPS = 10_000

function calculateOwnershipFromAmount(amountNgn: number, targetAmountNgn: number) {
  if (!Number.isFinite(amountNgn) || !Number.isFinite(targetAmountNgn) || targetAmountNgn <= 0) {
    return { ownershipUnits: 0, ownershipBps: 0 }
  }

  return {
    ownershipUnits: Math.max(Math.floor((amountNgn * TOTAL_OWNERSHIP_UNITS) / targetAmountNgn), 0),
    ownershipBps: Math.max(Math.floor((amountNgn * TOTAL_OWNERSHIP_BPS) / targetAmountNgn), 0),
  }
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
        amountNgn: { $sum: "$amountNgn" },
      },
    },
  ])

  const ownershipByPool = new Map(
    ownershipRows.map((row) => [
      row._id.toString(),
      {
        amountNgn: row.amountNgn,
      },
    ]),
  )

  return normalizedPools.map((pool) => {
    const ownership = ownershipByPool.get(pool.id)
    const amountNgn = ownership?.amountNgn ?? 0
    const computedOwnership = calculateOwnershipFromAmount(amountNgn, pool.targetAmountNgn)

    return {
      ...pool,
      userOwnershipUnits: computedOwnership.ownershipUnits,
      userOwnershipBps: computedOwnership.ownershipBps,
      userInvestedNgn: amountNgn,
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
        amountNgn: { $sum: "$amountNgn" },
      },
    },
  ])

  const currentUserOwnership = ownership[0]
  const investedAmountNgn = currentUserOwnership?.amountNgn ?? 0
  const computedOwnership = calculateOwnershipFromAmount(investedAmountNgn, normalizedPool.targetAmountNgn)

  return {
    ...normalizedPool,
    userOwnershipUnits: computedOwnership.ownershipUnits,
    userOwnershipBps: computedOwnership.ownershipBps,
    userInvestedNgn: investedAmountNgn,
  }
}
