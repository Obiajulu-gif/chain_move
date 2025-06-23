"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Award, TrendingUp, Star, Target, CheckCircle, Clock, Shield } from "lucide-react"

const performanceData = {
  overallScore: 87,
  creditScore: 720,
  level: "Gold Driver",
  nextLevel: "Platinum Driver",
  pointsToNext: 150,
  totalPoints: 2850,
  achievements: 12,
  streakDays: 28,
}

const metrics = [
  {
    name: "On-time Performance",
    score: 95,
    target: 90,
    status: "Excellent",
    icon: Clock,
    color: "text-green-400",
  },
  {
    name: "Customer Rating",
    score: 4.8,
    target: 4.5,
    status: "Excellent",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    name: "Trip Completion",
    score: 98.5,
    target: 95,
    status: "Excellent",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    name: "Safety Score",
    score: 92,
    target: 85,
    status: "Good",
    icon: Shield,
    color: "text-blue-400",
  },
]

const achievements = [
  {
    id: 1,
    title: "Perfect Week",
    description: "Complete 7 days with 5-star ratings",
    icon: "🌟",
    earned: true,
    date: "2025-01-08",
  },
  {
    id: 2,
    title: "Early Bird",
    description: "Complete 50 morning trips",
    icon: "🌅",
    earned: true,
    date: "2025-01-05",
  },
  {
    id: 3,
    title: "Distance Master",
    description: "Drive 1000km in a month",
    icon: "🛣️",
    earned: true,
    date: "2024-12-28",
  },
  {
    id: 4,
    title: "Customer Favorite",
    description: "Receive 100 five-star ratings",
    icon: "❤️",
    earned: false,
    progress: 87,
  },
  {
    id: 5,
    title: "Eco Driver",
    description: "Maintain fuel efficiency above 15km/l",
    icon: "🌱",
    earned: false,
    progress: 65,
  },
  {
    id: 6,
    title: "Night Owl",
    description: "Complete 25 late-night trips",
    icon: "🦉",
    earned: false,
    progress: 12,
  },
]

const creditBuilderTips = [
  {
    title: "Maintain On-time Payments",
    description: "Keep making loan payments on schedule to improve your credit score",
    impact: "High",
    status: "Active",
  },
  {
    title: "Complete More Trips",
    description: "Higher trip volume demonstrates consistent income",
    impact: "Medium",
    status: "In Progress",
  },
  {
    title: "Improve Customer Ratings",
    description: "Maintain high ratings to show reliability",
    impact: "Medium",
    status: "Good",
  },
  {
    title: "Reduce Cancellations",
    description: "Lower cancellation rate improves your reliability score",
    impact: "Low",
    status: "Needs Attention",
  },
]

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header userName="Emmanuel" userStatus="Not Registered" />

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Performance Score & Credit Builder</h1>
            <p className="text-gray-400">Track your performance metrics and build your credit profile</p>
          </div>

          {/* Performance Overview */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#E57700] mb-2">{performanceData.overallScore}</div>
                  <p className="text-sm text-gray-400 mb-4">Performance Score</p>
                  <Badge className="bg-yellow-600 text-white mb-4">{performanceData.level}</Badge>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress to {performanceData.nextLevel}</span>
                      <span className="text-white">{performanceData.pointsToNext} points needed</span>
                    </div>
                    <Progress value={75} className="h-2 bg-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Credit Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{performanceData.creditScore}</div>
                  <p className="text-sm text-gray-400 mb-4">Credit Score</p>
                  <Badge className="bg-green-600 text-white mb-4">Good Credit</Badge>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Credit Range</span>
                      <span className="text-white">300 - 850</span>
                    </div>
                    <Progress value={70} className="h-2 bg-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Points</span>
                    <span className="font-semibold text-white">{performanceData.totalPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Achievements</span>
                    <span className="font-semibold text-white">{performanceData.achievements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="font-semibold text-white">{performanceData.streakDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level Progress</span>
                    <span className="font-semibold text-white">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="bg-[#2a3441] border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
              <CardDescription className="text-gray-400">Key performance indicators and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon
                  const isPercentage = metric.name !== "Customer Rating"
                  const displayScore = isPercentage ? `${metric.score}%` : metric.score
                  const displayTarget = isPercentage ? `${metric.target}%` : metric.target
                  const progressValue = isPercentage ? metric.score : (metric.score / 5) * 100

                  return (
                    <div key={index} className="p-4 bg-[#1a2332] rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${metric.color}`} />
                          <div>
                            <h4 className="font-medium text-white">{metric.name}</h4>
                            <p className="text-sm text-gray-400">Target: {displayTarget}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{displayScore}</p>
                          <Badge
                            className={
                              metric.status === "Excellent"
                                ? "bg-green-600 text-white"
                                : metric.status === "Good"
                                  ? "bg-blue-600 text-white"
                                  : "bg-yellow-600 text-white"
                            }
                          >
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={progressValue} className="h-2 bg-gray-600" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-[#2a3441] border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Achievements & Badges</CardTitle>
              <CardDescription className="text-gray-400">
                Unlock rewards by reaching performance milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned ? "bg-green-900/20 border-green-700" : "bg-gray-900/20 border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      {achievement.earned ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <h4 className="font-medium text-white mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                    {achievement.earned ? (
                      <p className="text-xs text-green-400">Earned on {achievement.date}</p>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1 bg-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Credit Builder */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Credit Builder Tips</CardTitle>
              <CardDescription className="text-gray-400">
                Improve your credit score with these actionable recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditBuilderTips.map((tip, index) => (
                  <div key={index} className="p-4 bg-[#1a2332] rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{tip.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              tip.impact === "High"
                                ? "bg-red-600 text-white"
                                : tip.impact === "Medium"
                                  ? "bg-yellow-600 text-white"
                                  : "bg-green-600 text-white"
                            }
                          >
                            {tip.impact} Impact
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              tip.status === "Active"
                                ? "border-green-600 text-green-400"
                                : tip.status === "Good"
                                  ? "border-blue-600 text-blue-400"
                                  : tip.status === "In Progress"
                                    ? "border-yellow-600 text-yellow-400"
                                    : "border-red-600 text-red-400"
                            }
                          >
                            {tip.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                <h4 className="font-medium text-white mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-gray-400">
                  Consistent performance across all metrics will accelerate your credit score improvement. Focus on
                  maintaining high ratings and on-time payments for the best results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
