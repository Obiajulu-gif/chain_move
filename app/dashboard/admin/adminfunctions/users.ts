
// app/dashboard/admin/adminfunctions/users.ts

import { User } from "@/types";

/**
 * Fetches the list of all users from the API.
 * This function is essential for populating the user management table, allowing admins
 * to view and manage all registered users.
 * @returns A promise that resolves to an array of users.
 */
export async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await res.json();
  return data.users;
}

/**
 * Updates a user's role through an API call.
 * This function is used to change a user's permissions (e.g., from driver to admin).
 * @param userId The ID of the user to update.
 * @param newRole The new role to assign to the user.
 * @returns A promise that resolves when the user's role is updated successfully.
 */
export async function updateUserRole(userId: string, newRole: "admin" | "driver" | "investor"): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Could not update user role.");
  }
}

/**
 * Deletes a user from the platform via an API call.
 * This is a critical function for removing users from the system.
 * @param userId The ID of the user to delete.
 * @returns A promise that resolves when the user is deleted successfully.
 */
export async function deleteUser(userId: string): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Could not delete the user.");
  }
}
