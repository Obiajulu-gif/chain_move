
// app/dashboard/admin/admincomponents/DashboardHeader.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  lastUpdated: Date;
  loading: boolean;
  onRefresh: () => void;
  onAddVehicle: () => void;
}

/**
 * Renders the header section of the admin dashboard.
 * This component displays the main title, system status, last updated time,
 * and provides buttons for refreshing data and adding a new vehicle.
 * @param props The props for the component.
 * @returns The rendered dashboard header.
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ lastUpdated, loading, onRefresh, onAddVehicle }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Platform Administration</h1>
        <p className="text-muted-foreground">
          Comprehensive monitoring and management of the ChainMove platform
        </p>
        <div className="flex items-center space-x-4 mt-2">
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </Badge>
          <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="ml-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
      <Button onClick={onAddVehicle} className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
        <Plus className="h-4 w-4 mr-2" />
        Add Vehicle
      </Button>
    </div>
  </div>
);

export default DashboardHeader;
