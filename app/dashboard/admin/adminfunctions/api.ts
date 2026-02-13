
// app/dashboard/admin/adminfunctions/api.ts

import { DashboardStats, Vehicle } from "@/types";

/**
 * Fetches the main dashboard statistics from the API.
 * This function retrieves key metrics such as total users, funds, and loans,
 * providing a high-level overview of the platform's status.
 * @returns A promise that resolves to the dashboard statistics.
 */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch("/api/admin/dashboard-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }
  return response.json();
};

/**
 * Fetches the list of all vehicles from the API.
 * This is used to populate the vehicle management tab, allowing admins
 * to view and interact with the vehicle fleet.
 * @returns A promise that resolves to an array of vehicles.
 */
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch("/api/vehicles");
  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error("Failed to fetch vehicles");
};

/**
 * Adds a new vehicle to the platform via an API call.
 * This function sends the new vehicle's data to the backend to be stored
 * in the database.
 * @param vehicleData The data for the new vehicle.
 * @returns A promise that resolves when the vehicle is added successfully.
 */
export const addVehicle = async (vehicleData: Omit<Vehicle, "_id">) => {
  const response = await fetch("/api/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to add vehicle");
  }
  return data;
};

/**
 * Updates an existing vehicle's information through the API.
 * This is used in the edit vehicle functionality to persist changes.
 * @param vehicleId The ID of the vehicle to update.
 * @param vehicleData The updated vehicle data.
 * @returns A promise that resolves when the vehicle is updated successfully.
 */
export const updateVehicle = async (vehicleId: string, vehicleData: Partial<Vehicle>) => {
  const response = await fetch(`/api/vehicles/${vehicleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to update vehicle");
  }
  return data;
};

/**
 * Deletes a vehicle from the platform using an API call.
 * This function is critical for removing vehicles from the fleet.
 * @param vehicleId The ID of the vehicle to delete.
 * @returns A promise that resolves when the vehicle is deleted successfully.
 */
export const deleteVehicle = async (vehicleId: string) => {
  const response = await fetch(`/api/vehicles/${vehicleId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to delete vehicle");
  }
  return data;
};

/**
 * Uploads an image file to the server.
 * This function handles the client-side logic for image uploads, sending the file
 * to a dedicated API endpoint for processing and storage.
 * @param file The image file to upload.
 * @returns The URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
    method: "POST",
    body: file,
  });
  if (!response.ok) {
    throw new Error("Failed to upload image");
  }
  const blob = await response.json();
  return blob.url;
};
