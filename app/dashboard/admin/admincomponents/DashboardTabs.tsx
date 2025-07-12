
// app/dashboard/admin/admincomponents/DashboardTabs.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPriorityColor } from "../adminfunctions/helpers";
import { DashboardStats, Vehicle } from "@/types";
import Image from "next/image";
import {
  Users,
  DollarSign,
  Activity,
  Car,
  Wallet,
  BarChart3,
  PieChart,
  Target,
  Globe,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";

interface DashboardTabsProps {
  stats: DashboardStats;
  vehicles: Vehicle[];
  vehiclesLoading: boolean;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string, vehicleName: string) => void;
  onRefreshVehicles: () => void;
  onAddVehicle: () => void;
}

/**
 * Renders the main tabs section of the admin dashboard.
 * This component organizes the dashboard content into logical sections (Overview, Users, Vehicles, Analytics)
 * and displays the relevant data for each.
 * @param props The props for the component.
 * @returns The rendered dashboard tabs.
 */
const DashboardTabs: React.FC<DashboardTabsProps> = ({
  stats,
  vehicles,
  vehiclesLoading,
  onEditVehicle,
  onDeleteVehicle,
  onRefreshVehicles,
  onAddVehicle,
}) => (
  <Tabs defaultValue="overview" className="space-y-6">
    <TabsList className="grid w-full grid-cols-4 bg-muted">
      <TabsTrigger value="overview" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
        Overview
      </TabsTrigger>
      <TabsTrigger value="users" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
        Users
      </TabsTrigger>
      <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
        Vehicles
      </TabsTrigger>
      <TabsTrigger value="analytics" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
        Analytics
      </TabsTrigger>
    </TabsList>

    {/* Overview Tab */}
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-bold text-green-500">{stats.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Uptime</span>
                <span className="font-bold text-green-500">{stats.systemUptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average ROI</span>
                <span className="font-bold text-foreground">{stats.averageROI.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Funds</span>
                <span className="font-bold text-foreground">${stats.totalFundsAvailable.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Vehicle Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="text-sm text-foreground">{stats.vehicleUtilization.available}</span>
                </div>
                <Progress
                  value={(stats.vehicleUtilization.available / stats.totalVehicles) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Financed</span>
                  <span className="text-sm text-foreground">{stats.vehicleUtilization.financed}</span>
                </div>
                <Progress
                  value={(stats.vehicleUtilization.financed / stats.totalVehicles) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Reserved</span>
                  <span className="text-sm text-foreground">{stats.vehicleUtilization.reserved}</span>
                </div>
                <Progress
                  value={(stats.vehicleUtilization.reserved / stats.totalVehicles) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Maintenance</span>
                  <span className="text-sm text-foreground">{stats.vehicleUtilization.maintenance}</span>
                </div>
                <Progress
                  value={(stats.vehicleUtilization.maintenance / stats.totalVehicles) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Real-time Platform Activity
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Live monitoring of platform events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-[#E57700] rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(activity.priority)}>{activity.priority}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Users Tab */}
    <TabsContent value="users" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">{stats.totalUsers}</div>
            <p className="text-sm text-muted-foreground">Registered platform users</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">{stats.totalDrivers}</div>
            <p className="text-sm text-muted-foreground">Active drivers on platform</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">{stats.totalInvestors}</div>
            <p className="text-sm text-muted-foreground">Active investors on platform</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">User Distribution</CardTitle>
          <CardDescription className="text-muted-foreground">
            Breakdown of user types on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Drivers</span>
                <span className="text-sm text-foreground">
                  {stats.totalDrivers} ({((stats.totalDrivers / stats.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
              <Progress value={(stats.totalDrivers / stats.totalUsers) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Investors</span>
                <span className="text-sm text-foreground">
                  {stats.totalInvestors} ({((stats.totalInvestors / stats.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
              <Progress value={(stats.totalInvestors / stats.totalUsers) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Vehicles Tab */}
    <TabsContent value="vehicles" className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.vehicleUtilization.available}</div>
          <p className="text-sm text-green-700">Available</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.vehicleUtilization.financed}</div>
          <p className="text-sm text-blue-700">Financed</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.vehicleUtilization.reserved}</div>
          <p className="text-sm text-yellow-700">Reserved</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.vehicleUtilization.maintenance}</div>
          <p className="text-sm text-red-700">Maintenance</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center justify-between">
            <span className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Vehicle Management ({vehicles.length})
            </span>
            <Button onClick={onRefreshVehicles} variant="outline" size="sm" disabled={vehiclesLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${vehiclesLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage all vehicles in your fleet - add, edit, or remove vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehiclesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-16 w-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No vehicles found</p>
              <Button onClick={onAddVehicle} className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle._id} className="bg-muted border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={vehicle.image || "/placeholder.svg?height=80&width=120"}
                          alt={vehicle.name}
                          width={120}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.type}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              className={`${
                                vehicle.status === "Available"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.status === "Financed"
                                  ? "bg-blue-100 text-blue-800"
                                  : vehicle.status === "Reserved"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {vehicle.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">ROI: {vehicle.roi}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added: {new Date(vehicle.addedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg">${vehicle.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Vehicle Price</p>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-foreground bg-transparent"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-foreground bg-transparent"
                            onClick={() => onEditVehicle(vehicle)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => onDeleteVehicle(vehicle._id, vehicle.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Engine</p>
                        <p className="font-medium text-foreground">{vehicle.specifications.engine}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fuel</p>
                        <p className="font-medium text-foreground">{vehicle.specifications.fuelType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transmission</p>
                        <p className="font-medium text-foreground">{vehicle.specifications.transmission}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Color</p>
                        <p className="font-medium text-foreground">{vehicle.specifications.color}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    {/* Analytics Tab */}
    <TabsContent value="analytics" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Success Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.successRate}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average ROI</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stats.averageROI / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.averageROI.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vehicle Utilization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${((stats.vehicleUtilization.financed + stats.vehicleUtilization.reserved) / stats.totalVehicles) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {(
                      ((stats.vehicleUtilization.financed + stats.vehicleUtilization.reserved) /
                        stats.totalVehicles) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Platform Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Uptime</span>
                <span className="font-bold text-green-500">{stats.systemUptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Loans</span>
                <span className="font-bold text-foreground">{stats.activeLoans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Loans</span>
                <span className="font-bold text-yellow-500">{stats.pendingLoans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Vehicles</span>
                <span className="font-bold text-foreground">{stats.totalVehicles}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">${stats.totalFundsInvested.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Invested</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                ${stats.totalFundsAvailable.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Available Funds</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                ${((stats.totalFundsInvested * stats.averageROI) / 100).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Projected Returns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#E57700]">${stats.platformRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Platform Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

export default DashboardTabs;
