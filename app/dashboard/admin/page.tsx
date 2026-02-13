// app/dashboard/admin/page.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw, Users, DollarSign, FileText, TrendingUp } from "lucide-react";
import { useAdminDashboard } from "./adminfunctions/useAdminDashboard";
import DashboardHeader from "./admincomponents/DashboardHeader";
import MetricsCard from "./admincomponents/MetricsCard";
import VehicleDialog from "./admincomponents/VehicleDialog";
import DashboardTabs from "./admincomponents/DashboardTabs";

/**
 * The main component for the admin dashboard page.
 * This component integrates all the smaller, reusable parts and manages the overall layout.
 * It uses the useAdminDashboard hook to handle its state and logic, keeping the component
 * clean and focused on rendering the UI.
 * @returns The rendered admin dashboard page.
 */
export default function AdminDashboard() {
  const {
    stats,
    loading,
    error,
    lastUpdated,
    isAddVehicleOpen,
    setIsAddVehicleOpen,
    newVehicle,
    setNewVehicle,
    vehicles,
    vehiclesLoading,
    isEditVehicleOpen,
    setIsEditVehicleOpen,
    imagePreview,
    imageUploading,
    loadDashboardData,
    handleAddVehicle,
    handleEditVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    handleImageUpload,
    loadVehicles,
  } = useAdminDashboard();

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
          <div className="p-6">
            <Card className="max-w-md mx-auto mt-20">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Error Loading Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={loadDashboardData} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-background">
        <div className="p-6">
          <DashboardHeader
            lastUpdated={lastUpdated}
            loading={loading}
            onRefresh={loadDashboardData}
            onAddVehicle={() => setIsAddVehicleOpen(true)}
          />

          <VehicleDialog
            isOpen={isAddVehicleOpen}
            onClose={() => setIsAddVehicleOpen(false)}
            vehicle={newVehicle}
            onVehicleChange={(e) => setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value })}
            onImageUpload={handleImageUpload}
            onSubmit={handleAddVehicle}
            imagePreview={imagePreview}
            imageUploading={imageUploading}
          />

          <VehicleDialog
            isOpen={isEditVehicleOpen}
            onClose={() => setIsEditVehicleOpen(false)}
            isEdit
            vehicle={newVehicle}
            onVehicleChange={(e) => setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value })}
            onImageUpload={handleImageUpload}
            onSubmit={handleUpdateVehicle}
            imagePreview={imagePreview}
            imageUploading={imageUploading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              description={`${stats.totalDrivers} drivers, ${stats.totalInvestors} investors`}
              icon={Users}
              gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <MetricsCard
              title="Total Funds"
              value={`$${(stats.totalFundsInvested + stats.totalFundsAvailable).toLocaleString()}`}
              description={`$${stats.totalFundsInvested.toLocaleString()} invested`}
              icon={DollarSign}
              gradient="bg-gradient-to-r from-green-500 to-green-600"
            />
            <MetricsCard
              title="Active Loans"
              value={stats.activeLoans.toString()}
              description={`${stats.pendingLoans} pending review`}
              icon={FileText}
              gradient="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <MetricsCard
              title="Platform Revenue"
              value={`$${stats.platformRevenue.toLocaleString()}`}
              description={`${stats.successRate}% success rate`}
              icon={TrendingUp}
              gradient="bg-gradient-to-r from-orange-500 to-orange-600"
            />
          </div>

          <DashboardTabs
            stats={stats}
            vehicles={vehicles}
            vehiclesLoading={vehiclesLoading}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onRefreshVehicles={loadVehicles}
            onAddVehicle={() => setIsAddVehicleOpen(true)}
          />
        </div>
    </div>
  );
}