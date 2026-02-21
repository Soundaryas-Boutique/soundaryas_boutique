import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

/**
 * Checks if the current session belongs to an admin.
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

/**
 * Reusable helper to protect API routes.
 * Throws an error or returns a response if not an admin.
 */
export async function validateAdmin() {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) {
    throw new Error("Unauthorized: Admin access required");
  }
}
