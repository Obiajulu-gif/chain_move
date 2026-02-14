"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"

const riskFactors = [
  {
    factor: "Payment History",
    score: 95,
    trend: "up",
    impact: "High",
    description: "Consistent on-time payments",
  },
  {
    factor: "Vehicle Condition",
    score: 88,
    trend: "stable",
    impact: "Medium",
    description: "Well-maintained vehicle",
  },
  {
    factor: "Market Volatility",
    score: 72,
    trend: "down",
    impact: "Medium",
    description: "Current market conditions",
  },
  {
    factor: "Driver Performance",
    score: 91,
    trend: "up",
    impact: "High",
    description: "Excellent driving record",
  },
]

const portfolioRisk = {
  overall: 82,
  category: "Low-Medium",
  recommendation: "Well-diversified portfolio with manageable risk levels",
}

export function RiskAnalysis() {
  return (
    <Card className="bg-[#2a3441] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span>Risk Assessment</span>
        </CardTitle>
        <CardDescription className="text-gray-400">Comprehensive risk analysis for your investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="text-center p-4 bg-[#1a2332] rounded-lg">
            <div className="text-3xl font-bold text-white mb-2">{portfolioRisk.overall}/100</div>
            <Badge
              className={
                portfolioRisk.overall >= 80
                  ? "bg-green-600 text-white"
                  : portfolioRisk.overall >= 60
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
              }
            >
              {portfolioRisk.category} Risk
            </Badge>
            <p className="text-sm text-gray-400 mt-2">{portfolioRisk.recommendation}</p>
          </div>

          {/* Risk Factors */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Risk Factors</h4>
            {riskFactors.map((factor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">{factor.factor}</span>
                    {factor.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : factor.trend === "down" ? (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    ) : (
                      <BarChart3 className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{factor.score}/100</span>
                    <Badge
                      variant="outline"
                      className={
                        factor.impact === "High"
                          ? "border-red-600 text-red-400"
                          : factor.impact === "Medium"
                            ? "border-yellow-600 text-yellow-400"
                            : "border-green-600 text-green-400"
                      }
                    >
                      {factor.impact}
                    </Badge>
                  </div>
                </div>
                <Progress value={factor.score} className="h-2 bg-gray-600" />
                <p className="text-xs text-gray-400">{factor.description}</p>
              </div>
            ))}
          </div>

          {/* Risk Recommendations */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Recommendations</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 p-2 bg-green-900/20 rounded border border-green-700">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white">Diversify vehicle types</p>
                  <p className="text-xs text-gray-400">Consider adding electric vehicles to your portfolio</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-2 bg-yellow-900/20 rounded border border-yellow-700">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white">Monitor market conditions</p>
                  <p className="text-xs text-gray-400">Keep track of fuel prices and economic indicators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
