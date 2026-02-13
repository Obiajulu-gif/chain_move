
// app/dashboard/admin/adminfunctions/helpers.ts

/**
 * Determines the background and text color for a notification based on its priority.
 * This utility function helps in visually distinguishing the severity of different
 * activities in the recent activity feed.
 * @param priority The priority of the notification ('high', 'medium', 'low').
 * @returns A string of CSS classes for styling the notification badge.
 */
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
