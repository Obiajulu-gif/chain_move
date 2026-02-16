import mongoose from "mongoose"
import InvestmentPool from "@/models/InvestmentPool"
import PoolInvestment from "@/models/PoolInvestment"
import Transaction from "@/models/Transaction"
import User from "@/models/User"

export const TOTAL_OWNERSHIP_UNITS = 1_000_000

interface OwnershipResult {
  ownershipUnits: number
  ownershipBps: number
}

interface InvestInPoolInput {
  poolId: string
  userId: string
  amountNgn: number
  txRef?: string
}

export interface InvestInPoolResult {
  poolId: string
  userId: string
  amountNgn: number
  ownershipUnits: number
  ownershipBps: number
  txRef: string
  poolStatus: "OPEN" | "FUNDED" | "CLOSED"
  currentRaisedNgn: number
  targetAmountNgn: number
  investorCount: number
  userBalanceNgn: number
}

export function calculateOwnership(amountNgn: number, targetAmountNgn: number): OwnershipResult {
  const ownershipUnits = Math.floor((amountNgn * TOTAL_OWNERSHIP_UNITS) / targetAmountNgn)
  const ownershipBps = Math.floor((amountNgn * 10_000) / targetAmountNgn)

  return {
    ownershipUnits: Math.max(ownershipUnits, 0),
    ownershipBps: Math.max(ownershipBps, 0),
  }
}

export async function investInPool({ poolId, userId, amountNgn, txRef }: InvestInPoolInput): Promise<InvestInPoolResult> {
  if (!mongoose.Types.ObjectId.isValid(poolId)) {
    throw new Error("Invalid pool ID.")
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID.")
  }

  if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
    throw new Error("Amount must be greater than zero.")
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const [pool, user] = await Promise.all([
      InvestmentPool.findById(poolId).session(session),
      User.findById(userId).session(session),
    ])

    if (!pool) throw new Error("Pool not found.")
    if (!user) throw new Error("User not found.")

    if (pool.status !== "OPEN") {
      throw new Error("This pool is not open for investment.")
    }

    if (amountNgn < pool.minContributionNgn) {
      throw new Error(`Minimum contribution is ${pool.minContributionNgn}.`)
    }

    const remainingAmountNgn = pool.targetAmountNgn - pool.currentRaisedNgn
    if (remainingAmountNgn <= 0) {
      throw new Error("This pool has already reached its target amount.")
    }

    if (amountNgn > remainingAmountNgn) {
      throw new Error(`Amount exceeds remaining target by ${amountNgn - remainingAmountNgn}.`)
    }

    if (amountNgn > (user.availableBalance || 0)) {
      throw new Error("Insufficient internal wallet balance.")
    }

    const { ownershipUnits, ownershipBps } = calculateOwnership(amountNgn, pool.targetAmountNgn)

    const existingInvestment = await PoolInvestment.exists({
      poolId: pool._id,
      userId: user._id,
      status: "CONFIRMED",
    }).session(session)

    const generatedTxRef = txRef || `pool_${pool._id}_${Date.now()}`

    await PoolInvestment.create(
      [
        {
          poolId: pool._id,
          userId: user._id,
          amountNgn,
          ownershipUnits,
          ownershipBps,
          txRef: generatedTxRef,
          status: "CONFIRMED",
        },
      ],
      { session },
    )

    user.availableBalance = Math.max((user.availableBalance || 0) - amountNgn, 0)
    user.totalInvested = (user.totalInvested || 0) + amountNgn
    await user.save({ session })

    pool.currentRaisedNgn += amountNgn
    if (!existingInvestment) {
      pool.investorCount += 1
    }
    if (pool.currentRaisedNgn >= pool.targetAmountNgn) {
      pool.status = "FUNDED"
    }
    await pool.save({ session })

    await Transaction.create(
      [
        {
          userId: user._id,
          userType: user.role || "investor",
          type: "pool_investment",
          amount: amountNgn,
          currency: "NGN",
          method: "internal_wallet",
          status: "Completed",
          description: `${pool.assetType} pool investment`,
          relatedId: pool._id.toString(),
          gatewayReference: generatedTxRef,
          metadata: {
            ownershipUnits,
            ownershipBps,
          },
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return {
      poolId: pool._id.toString(),
      userId: user._id.toString(),
      amountNgn,
      ownershipUnits,
      ownershipBps,
      txRef: generatedTxRef,
      poolStatus: pool.status,
      currentRaisedNgn: pool.currentRaisedNgn,
      targetAmountNgn: pool.targetAmountNgn,
      investorCount: pool.investorCount,
      userBalanceNgn: user.availableBalance,
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}
