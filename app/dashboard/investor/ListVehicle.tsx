"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from 'wagmi'

export default function ListVehicle() {
  const { address } = useAccount();

  const [form, setForm] = useState({
    name: "",
    type: "",
    year: "",
    price: "",
    roi: "",
    vin: "",
    driverWalletAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // If wallet is connected, always use it for driverWalletAddress
  useEffect(() => {
    if (address) {
      setForm((prev) => ({
        ...prev,
        driverWalletAddress: address,
      }));
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no wallet address, prompt user to connect wallet
    if (!address) {
      alert("Please connect your wallet before listing a vehicle.");
      return;
    }

    setLoading(true);
    setMessage(null);

    // Prepare the payload
    const payload: any = {
      name: form.name,
      type: form.type,
      year: Number(form.year),
      price: Number(form.price),
      roi: Number(form.roi),
      specifications: { vin: form.vin },
      driverWalletAddress: address, // always use connected wallet
    };

    try {
      const res = await fetch("/api/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Vehicle added successfully!");
        setForm({
          name: "",
          type: "",
          year: "",
          price: "",
          roi: "",
          vin: "",
          driverWalletAddress: address || "",
        });
      } else {
        setMessage(data.message || "Error adding vehicle.");
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to trim address for display
  const trimAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <Card className="bg-card border-border max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">List a New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              placeholder="Vehicle Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="type"
              placeholder="Type (e.g. Sedan, SUV)"
              value={form.type}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="roi"
              placeholder="ROI (%)"
              value={form.roi}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="vin"
              placeholder="VIN"
              value={form.vin}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="driverWalletAddress"
              placeholder="Driver Wallet Address"
              value={trimAddress(address) || ""}
              disabled
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Vehicle"}
          </Button>
          {message && (
            <div className={`text-center text-sm mt-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}