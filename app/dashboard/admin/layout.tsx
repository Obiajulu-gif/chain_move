
// app/dashboard/admin/layout.tsx

"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

/**
 * Defines the layout for the admin dashboard.
 * This component wraps all admin pages, providing a consistent structure
 * that includes a sidebar and a header. It ensures that all pages within the
 * admin section share the same navigation and header elements.
 * @param children The content to be rendered within the layout.
 * @returns The admin dashboard layout with the sidebar, header, and content.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="admin" />
      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" notificationCount={0} />
        <main>{children}</main>
      </div>
    </div>
  );
}
