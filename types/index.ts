
// types/index.ts

/**
 * Defines the structure for the main dashboard statistics.
 * This interface is used to ensure type safety when fetching and displaying
 * key metrics on the admin dashboard.
 */
export interface DashboardStats {
  totalUsers: number;
  totalDrivers: number;
  totalInvestors: number;
  activeLoans: number;
  pendingLoans: number;
  totalFundsInvested: number;
  totalFundsAvailable: number;
  platformRevenue: number;
  successRate: number;
  systemUptime: string;
  averageROI: number;
  vehicleUtilization: {
    available: number;
    financed: number;
    reserved: number;
    maintenance: number;
  };
  totalVehicles: number;
  recentActivity: Array<{
    id: number;
    title: string;
    message: string;
    timestamp: string;
    priority: string;
  }>;
}

/**
 * Defines the structure for a single vehicle object.
 * This interface ensures that all vehicle-related data is consistent
 * across the application, from the backend to the frontend components.
 */
export interface Vehicle {
  _id: string;
  name: string;
  type: string;
  year: number;
  price: number;
  image?: string;
  status: "Available" | "Financed" | "Reserved" | "Maintenance";
  roi: number;
  features: string[];
  specifications: {
    engine: string;
    fuelType: string;
    mileage: string;
    transmission: string;
    color: string;
    vin: string;
  };
  addedDate: string;
  popularity: number;
}

/**
 * Defines the structure for a single user object.
 * This interface is used for managing user data, including their roles and permissions.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "driver" | "investor";
  createdAt: string;
}
