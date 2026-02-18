"use client"

const DASHBOARD_SIDEBAR_TOGGLE_EVENT = "dashboard-sidebar-toggle"
const DASHBOARD_SIDEBAR_CLOSE_EVENT = "dashboard-sidebar-close"

export function emitDashboardSidebarToggle() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(DASHBOARD_SIDEBAR_TOGGLE_EVENT))
}

export function emitDashboardSidebarClose() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(DASHBOARD_SIDEBAR_CLOSE_EVENT))
}

export function getDashboardSidebarEventNames() {
  return {
    toggle: DASHBOARD_SIDEBAR_TOGGLE_EVENT,
    close: DASHBOARD_SIDEBAR_CLOSE_EVENT,
  }
}

