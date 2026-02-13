
// app/dashboard/admin/admincomponents/VehicleDialog.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  vehicle: any; // Consider creating a specific type for the vehicle form
  onVehicleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  imagePreview: string | null;
  imageUploading: boolean;
}

/**
 * Renders a dialog for adding or editing a vehicle.
 * This component encapsulates the form and logic for vehicle management,
 * providing a consistent UI for both creating and updating vehicle information.
 * @param props The props for the component.
 * @returns The rendered vehicle dialog.
 */
const VehicleDialog: React.FC<VehicleDialogProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  vehicle,
  onVehicleChange,
  onImageUpload,
  onSubmit,
  imagePreview,
  imageUploading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">{isEdit ? "Edit Vehicle" : "Add New Vehicle to Platform"}</h2>
              <p className="text-sm text-gray-600">
                {isEdit ? "Update vehicle information" : "Add a new vehicle to the platform for drivers and investors"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Image</label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Vehicle preview"
                      width={128}
                      height={96}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-gray-400 text-2xl">📷</div>
                      <p className="text-xs text-gray-500">Upload Image</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                    id={`vehicle-image-${isEdit ? "edit" : "add"}`}
                    disabled={imageUploading}
                  />
                  <label htmlFor={`vehicle-image-${isEdit ? "edit" : "add"}`} className="cursor-pointer">
                    <Button type="button" variant="outline" asChild disabled={imageUploading}>
                      <span>{imageUploading ? "Uploading..." : isEdit ? "Change Image" : "Upload Image"}</span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB {imageUploading && "- Uploading..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vehicle Name *</label>
                <input
                  type="text"
                  name="name"
                  value={vehicle.name}
                  onChange={onVehicleChange}
                  placeholder="e.g., Toyota Corolla 2024"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type *</label>
                <select
                  name="type"
                  value={vehicle.type}
                  onChange={onVehicleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                >
                  <option value="">Select type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Commercial Van">Commercial Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Tricycle(Keke)">Tricycle(Keke)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={vehicle.year}
                  onChange={onVehicleChange}
                  placeholder="2024"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={vehicle.price}
                  onChange={onVehicleChange}
                  placeholder="25000"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Expected ROI (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="roi"
                  value={vehicle.roi}
                  onChange={onVehicleChange}
                  placeholder="Abeg leave empty"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color</label>
                <input
                  type="text"
                  name="color"
                  value={vehicle.color}
                  onChange={onVehicleChange}
                  placeholder="White"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h4 className="font-medium">Vehicle Specifications</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Engine</label>
                  <input
                    type="text"
                    name="engine"
                    value={vehicle.engine}
                    onChange={onVehicleChange}
                    placeholder="2.0L 4-Cylinder"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={vehicle.fuelType}
                    onChange={onVehicleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Transmission</label>
                  <select
                    name="transmission"
                    value={vehicle.transmission}
                    onChange={onVehicleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">VIN</label>
                  <input
                    type="text"
                    name="vin"
                    value={vehicle.vin}
                    onChange={onVehicleChange}
                    placeholder={isEdit ? "Vehicle VIN" : "Auto-generated if empty"}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="text-sm font-medium">Features (comma-separated)</label>
              <textarea
                name="features"
                value={vehicle.features}
                onChange={onVehicleChange}
                placeholder="Fuel Efficient, Reliable, GPS Navigation, Air Conditioning"
                rows={3}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                disabled={!vehicle.name || !vehicle.type || !vehicle.year || !vehicle.price}
              >
                {isEdit ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDialog;
