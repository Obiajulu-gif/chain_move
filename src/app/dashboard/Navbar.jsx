"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaWallet } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPrincipal, setUserPrincipal] = useState(null);

  useEffect(() => {
    // Retrieve userPrincipal from localStorage and format it
    const principal = localStorage.getItem("userPrincipal");
    if (principal) {
      // Format principal to show only first and last few characters
      const formattedPrincipal = `${principal.slice(0, 5)}...${principal.slice(-5)}`;
      setUserPrincipal(formattedPrincipal);
    }
  }, []);

  return (
    <div className="bg-gray-900 px-6 py-4 flex justify-between items-center lg:pl-72">
      {/* Left Section - Filters and Search bar */}
      <div className="flex items-center space-x-2 w-full lg:w-auto">
        {/* Dropdown Filter Button */}
        <div
          className="relative flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg cursor-pointer select-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <span>All Filters</span>
          <MdExpandMore className="ml-1" />
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-40 bg-gray-800 rounded shadow-lg z-10">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-700">Option 1</li>
                <li className="px-4 py-2 hover:bg-gray-700">Option 2</li>
                <li className="px-4 py-2 hover:bg-gray-700">Option 3</li>
              </ul>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg w-full lg:w-96">
          <FaSearch className="text-orange-500 mr-2" />
          <input
            type="text"
            placeholder="Search for any assets here..."
            className="bg-transparent text-white placeholder-gray-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right Section - Wallet, Notifications, and Profile */}
      <div className="flex items-center space-x-4">
        {userPrincipal && (
            <span className="text-white font-medium text-sm bg-orange-700 px-3 py-1 rounded-lg">
              {userPrincipal}
            </span>
          )}
        {/* Connect Wallet Button */}
        <FaWallet className="mr-2" />

        {/* Notification Bell with Badge */}
        <div className="relative">
          <FaBell className="text-gray-400 text-2xl cursor-pointer hover:text-white transition duration-300" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-orange-500 bg-black rounded-full transform -translate-y-1 translate-x-1">
            4
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/av1.png" // Replace with user's profile image URL if available
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
          />
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
