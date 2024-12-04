"use client";
import Link from "next/link";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and password are required!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to log in. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Left Side - Image with Overlay Card */}
      <div className="relative w-1/2 hidden md:block">
        <Image
          src="/images/login.png"
          alt="Login Image"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-90"
        />
        <div className="absolute bottom-10 left-10 bg-black bg-opacity-60 text-white p-6 rounded-lg max-w-xs">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="bg-orange-500 rounded-full p-2 mr-2"></span>
            Welcome Back
          </h3>
          <p className="text-sm mt-2">
            Securely log in to manage your account and access our features.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-10">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Log In</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="block text-gray-400 mb-1">
                Email
              </label>
              <FaEnvelope className="absolute left-3 top-10 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-400 mb-1">
                Password
              </label>
              <FaLock className="absolute left-3 top-10 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white placeholder-gray-500"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              onClick={handleLogin}
              className={`w-full font-semibold py-3 rounded-md transition ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-500"
              } text-white`}
              disabled={isLoading}>
              {isLoading ? "Logging In..." : "Log In"}
            </button>
            <div className="text-gray-400 mt-4 text-sm">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="text-orange-500 hover:text-orange-400 underline">
                Proceed to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
