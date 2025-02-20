"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  FaCar,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaExchangeAlt,
  FaGift,
  FaIdCard,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserTie,
  FaHistory,
} from "react-icons/fa";

const SidebarLink = ({ href, icon, label, badge, isSidebarOpen }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}>
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors">
      <div className="flex items-center space-x-4">
        <span className="text-2xl text-gray-300">{icon}</span>
        {isSidebarOpen && (
          <span className="text-base font-semibold text-gray-100">{label}</span>
        )}
      </div>
      {isSidebarOpen && badge && (
        <motion.span
          className="bg-orange-500 text-xs text-white px-2 py-1 rounded-full font-semibold"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}>
          {badge}
        </motion.span>
      )}
    </Link>
  </motion.div>
);

const SidebarSection = ({ title, links, isSidebarOpen }) => (
  <div>
    {isSidebarOpen && title && (
      <motion.div
        className="text-sm text-gray-400 mt-6 pt-4 border-t border-gray-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        {title}
      </motion.div>
    )}
    <nav className="mt-4 space-y-3">
      {links.map((link) => (
        <SidebarLink key={link.href} {...link} isSidebarOpen={isSidebarOpen} />
      ))}
    </nav>
  </div>
);

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarVariants = {
    open: { width: "16rem", transition: { duration: 0.5 } },
    closed: { width: "4rem", transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const mainLinks = [
    { href: "/dashboard", icon: <FaChartBar />, label: "Overview" },
    { href: "/dashboard/book", icon: <FaCar />, label: "Book A Trip" },
    {
      href: "/dashboard/dispatch",
      icon: <FaExchangeAlt />,
      label: "Dispatcher",
      badge: "Coming Soon",
    },
    {
      href: "/dashboard/dao",
      icon: <FaUserTie />,
      label: "ChainMove DAO",
    },
    { href: "/dashboard/rewards", icon: <FaGift />, label: "Rewards" },
    {
      href: "/dashboard/trip-history",
      icon: <FaHistory />,
      label: "My Trip History",
    },
  ];

  const profileLinks = [
    { href: "/driverdashboard", icon: <FaIdCard />, label: "Driver Profile" },
    {
      href: "/investordashboard",
      icon: <FaUserTie />,
      label: "Investor Profile",
    },
  ];

  const bottomLinks = [
    { href: "/dashboard/help", icon: <FaQuestionCircle />, label: "Help" },
    { href: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
    { href: "/", icon: <FaSignOutAlt />, label: "Log Out" },
  ];

  return (
    <motion.div
      className="bg-gray-900 text-white max-h-screen p-2 flex flex-col justify-between fixed md:relative z-50 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg"
      style={{ height: "100vh" }}
      animate={isSidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}>
      {/* Sidebar Header */}
      <div>
        <Link href="/">
          <h2 className="text-3xl font-extrabold text-orange-500 tracking-wide">
            {isSidebarOpen && "ChainMove"}
          </h2>
        </Link>

        {/* Main Navigation */}
        <nav className="mt-8 flex flex-col space-y-4">
          {mainLinks.map(({ href, icon, label, badge }) => (
            <motion.div
              key={href}
              whileHover="hover"
              whileTap="tap"
              variants={linkVariants}>
              <Link
                href={href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl text-gray-300">{icon}</span>
                  {isSidebarOpen && (
                    <span className="text-base font-semibold text-gray-100">
                      {label}
                    </span>
                  )}
                </div>
                {isSidebarOpen && badge && (
                  <motion.span
                    className="bg-orange-500 text-xs text-white px-2 py-1 rounded-full font-semibold"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}>
                    {badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Profile Section */}
        {isSidebarOpen && (
          <div className="text-sm text-gray-400 mt-6 font-medium">
            Access Other Profiles
          </div>
        )}
        <nav className="mt-4 space-y-3">
          {profileLinks.map(({ href, icon, label }) => (
            <motion.div
              key={href}
              whileHover="hover"
              whileTap="tap"
              variants={linkVariants}>
              <Link
                href={href}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-2xl text-gray-300">{icon}</span>
                {isSidebarOpen && (
                  <span className="text-base font-semibold text-gray-100">
                    {label}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col space-y-4 mt-auto">
        {bottomLinks.map(({ href, icon, label }) => (
          <motion.div
            key={href}
            whileHover="hover"
            whileTap="tap"
            variants={linkVariants}>
            <Link
              href={href}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-2xl text-gray-300">{icon}</span>
              {isSidebarOpen && (
                <span className="text-base font-semibold text-gray-100">
                  {label}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Toggle Button */}
      <motion.button
        className="absolute top-4 right-4 text-orange-500 hover:text-orange-400"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}>
        {isSidebarOpen ? (
          <FaChevronLeft size={24} />
        ) : (
          <FaChevronRight size={24} />
        )}
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;
