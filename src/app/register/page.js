"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaUserAlt, FaLock } from "react-icons/fa";

const RegisterPage = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 const handleRegister = async () => {
   if (!fullName || !email || !password) {
     setError("All fields are required!");
     return;
   }

   if (password.length < 8) {
     setError("Password must be at least 8 characters long.");
     return;
   }

   setError("");
   setSuccess("");
   setIsLoading(true);

   try {
     const response = await fetch("/api/usr", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ fullName, email, password }),
     });

     if (response.ok) {
       const data = await response.json();
       setSuccess("Registration successful! Redirecting to login in 10s...");

       setTimeout(() => {
         router.push("/login");
       }, 10000);
     } else {
       const errorData = await response.json();
       setError(errorData.error || "Failed to register. Please try again.");
     }
   } catch (error) {
     console.error("Error during registration:", error);
     setError("Something went wrong. Please try again later.");
   } finally {
     setIsLoading(false);
   }
 };


  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="relative w-1/2 hidden lg:block">
        <Image
          src="/images/login.png"
          alt="Become a Driver"
          fill
          className="opacity-90 object-cover"
        />
        <div className="absolute bottom-10 left-10 bg-black bg-opacity-60 text-white p-6 rounded-lg max-w-xs">
          <h3 className="text-lg font-semibold">Become a Driver</h3>
          <p className="text-sm mt-2">
            Easily share rides and split costs through secure, smart contract
            transactions, making group travel affordable.
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-10">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Sign up with your email
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="fullName" className="block text-gray-400 mb-1">
                Full Name
              </label>
              <FaUserAlt className="absolute left-3 top-11 text-gray-400" />
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 p-3 rounded-md bg-gray-800 text-white placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-gray-400 mb-1">
                Email
              </label>
              <FaEnvelope className="absolute left-3 top-11 text-gray-400" />
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
              <FaLock className="absolute left-3 top-11 text-gray-400" />
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
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <button
              onClick={handleRegister}
              className={`w-full font-semibold py-3 rounded-md transition ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white`}
              disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
            <div className="text-gray-400 mt-4 text-sm">
              {"Already have an account? "}
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-400 underline">
                Proceed to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
