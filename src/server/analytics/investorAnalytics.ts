import mongoose from "mongoose"

import PoolInvestment from "@/models/PoolInvestment"
import {
  buildAnalyticsWindow,
  countUsers,
  ensureAnalyticsDb,
  getPoolFundingSummary,
  parseAnalyticsRange,
  sumDepositsNgn,
  sumInvestmentsNgn,
  sumReturnsPaidNgn,
  type AnalyticsRange,
} from "@/src/server/analytics/shared"

export interface InvestorAnalyticsInput {
  userId: string
  range?: AnalyticsRange
}

export interface InvestorAnalyticsSnapshot {
  range: AnalyticsRange
  startDate: string | null
  totals: {
    totalDepositsNgn: number
    totalInvestedNgn: number
    totalReturnsPaidNgn: number
    totalPortfolioValueNgn: number
  }
  investments: {
    confirmedPoolInvestmentsCount: number
  }
  pools: {
    activePoolsCount: number
    openPoolsCount: number
    fundedPoolsCount: number
  }
  users: {
    totalUsersInRange: number
  }
}

export async function getInvestorAnalytics({ userId, range = "30d" }: InvestorAnalyticsInput): Promise<InvestorAnalyticsSnapshot> {
  await ensureAnalyticsDb()

  const normalizedRange = parseAnalyticsRange(range)
  const window = buildAnalyticsWindow(normalizedRange)

  const scopedUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null

  const [totalDepositsNgn, totalInvestedNgn, totalReturnsPaidNgn, totalUsersInRange, poolSummary, confirmedPoolInvestmentsCount] =
    await Promise.all([
      sumDepositsNgn({ startDate: window.startDate, userId }),
      sumInvestmentsNgn({ startDate: window.startDate, userId }),
      sumReturnsPaidNgn({ startDate: window.startDate, userId }),
      countUsers({ startDate: window.startDate }),
      getPoolFundingSummary({ startDate: window.startDate }),
      scopedUserId
        ? PoolInvestment.countDocuments({
            userId: scopedUserId,
            status: "CONFIRMED",
            ...(window.startDate ? { createdAt: { $gte: window.startDate } } : {}),
          })
        : Promise.resolve(0),
    ])

  return {
    range: normalizedRange,
    startDate: window.startDate ? window.startDate.toISOString() : null,
    totals: {
      totalDepositsNgn,
      totalInvestedNgn,
      totalReturnsPaidNgn,
      totalPortfolioValueNgn: totalDepositsNgn + totalInvestedNgn + totalReturnsPaidNgn,
    },
    investments: {
      confirmedPoolInvestmentsCount,
    },
    pools: {
      activePoolsCount: poolSummary.activePoolsCount,
      openPoolsCount: poolSummary.openPoolsCount,
      fundedPoolsCount: poolSummary.fundedPoolsCount,
    },
    users: {
      totalUsersInRange,
    },
  }
}

